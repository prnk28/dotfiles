# Multi-stage Dockerfile for MCP servers with mcpo proxy
# Use --target flag to build specific MCP server

# =============================================================================
# Base image for all Python-based MCP servers
# =============================================================================
FROM python:3.11-slim AS python-base

WORKDIR /app

# Install common system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install common Python packages
RUN pip install --no-cache-dir mcpo uv

# Common environment variables
ENV MCP_PORT=8000
ENV MCP_HOST="0.0.0.0"

# =============================================================================
# Base image for Node.js-based MCP servers
# =============================================================================
FROM python-base AS node-base

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# =============================================================================
# Sequential Thinking MCP server
# =============================================================================
FROM node-base AS sequentialthinking

# Install Sequential Thinking MCP server
RUN npm install -g @modelcontextprotocol/server-sequential-thinking@latest

# Environment variables
ENV DISABLE_THOUGHT_LOGGING="false"

# Create startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting Sequential Thinking MCP server proxy..."
if [ "$DISABLE_THOUGHT_LOGGING" = "true" ]; then
    echo "Thought logging is disabled"
fi

# Run mcpo with the Sequential Thinking MCP server
exec uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
    npx @modelcontextprotocol/server-sequential-thinking
EOF

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$MCP_PORT/health || curl -f http://localhost:$MCP_PORT/docs || exit 1

# Expose port
EXPOSE 8000

# Run the startup script
CMD ["/app/start.sh"]

# =============================================================================
# Filesystem MCP server
# =============================================================================
FROM node-base AS filesystem

# Install Node.js MCP filesystem server
RUN npm install -g @modelcontextprotocol/server-filesystem@latest

# Environment variables
ENV FILESYSTEM_DIRS="/data/sonr /data/ui /data/notes"

# Create startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting Filesystem MCP server proxy..."
echo "Exposing directories: $FILESYSTEM_DIRS"

# Convert FILESYSTEM_DIRS string to array
IFS=' ' read -r -a DIRS <<< "$FILESYSTEM_DIRS"

# Run mcpo with the filesystem MCP server
exec uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
    npx @modelcontextprotocol/server-filesystem "${DIRS[@]}"
EOF

RUN chmod +x /app/start.sh

# Create default mount points
RUN mkdir -p /data/sonr /data/ui /data/notes

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$MCP_PORT/health || curl -f http://localhost:$MCP_PORT/docs || exit 1

# Expose port
EXPOSE 8000

# Run the startup script
CMD ["/app/start.sh"]

# =============================================================================
# Context7 MCP server proxy (uses FastAPI instead of mcpo)
# =============================================================================
FROM python-base AS context7

# Install additional Python packages for proxy
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn \
    httpx \
    pydantic

# Environment variables
ENV CONTEXT7_API_KEY=""
ENV CONTEXT7_URL="https://mcp.context7.com/mcp"

# Create the proxy application
RUN cat > /app/proxy.py << 'EOF'
import os
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.responses import JSONResponse
import httpx
import json

app = FastAPI(title="Context7 MCP Proxy", version="1.0.0")

CONTEXT7_URL = os.getenv("CONTEXT7_URL", "https://mcp.context7.com/mcp")
CONTEXT7_API_KEY = os.getenv("CONTEXT7_API_KEY", "")

if not CONTEXT7_API_KEY:
    raise ValueError("CONTEXT7_API_KEY environment variable is required")

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.get("/docs")
async def docs_redirect():
    return {"message": "OpenAPI docs available at /docs"}

@app.post("/")
async def proxy_mcp(request: Request):
    """Proxy MCP requests to Context7"""
    try:
        body = await request.body()

        headers = {
            "CONTEXT7_API_KEY": CONTEXT7_API_KEY,
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                CONTEXT7_URL,
                content=body,
                headers=headers,
                timeout=30.0
            )

            return Response(
                content=response.content,
                status_code=response.status_code,
                headers=dict(response.headers)
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {
        "service": "Context7 MCP Proxy",
        "status": "ready",
        "endpoint": CONTEXT7_URL
    }
EOF

# Create startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e

if [ -z "$CONTEXT7_API_KEY" ]; then
    echo "Error: CONTEXT7_API_KEY is required for Context7 MCP server"
    exit 1
fi

echo "Starting Context7 MCP server proxy..."
echo "Proxying to: $CONTEXT7_URL"
echo "Server will be available at http://$MCP_HOST:$MCP_PORT"

# Run the FastAPI proxy server
exec uvicorn proxy:app --host $MCP_HOST --port $MCP_PORT --log-level info
EOF

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$MCP_PORT/health || exit 1

# Expose port
EXPOSE 8000

# Run the startup script
CMD ["/app/start.sh"]

# =============================================================================
# Obsidian MCP server
# =============================================================================
FROM python-base AS obsidian

# Install Obsidian MCP server
RUN pip install --no-cache-dir mcp-obsidian

# Environment variables
ENV OBSIDIAN_API_KEY=""
ENV OBSIDIAN_HOST=""
ENV OBSIDIAN_PORT=""

# Create startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting Obsidian MCP server proxy..."
echo "Connecting to Obsidian at ${OBSIDIAN_HOST}:${OBSIDIAN_PORT}"

# Run mcpo with the Obsidian MCP server
exec uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
    uvx mcp-obsidian
EOF

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$MCP_PORT/health || curl -f http://localhost:$MCP_PORT/docs || exit 1

# Expose port
EXPOSE 8000

# Run the startup script
CMD ["/app/start.sh"]

# =============================================================================
# GitHub MCP server (requires Docker-in-Docker)
# =============================================================================
FROM python-base AS github

# Install Docker CLI
RUN apt-get update && apt-get install -y \
    ca-certificates \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg && \
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && \
    apt-get update && \
    apt-get install -y docker-ce-cli && \
    rm -rf /var/lib/apt/lists/*

# Environment variables
ENV GITHUB_PERSONAL_ACCESS_TOKEN=""

# Create startup script that runs GitHub MCP server via Docker
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e

if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
    echo "Error: GITHUB_PERSONAL_ACCESS_TOKEN is required"
    exit 1
fi

echo "Starting GitHub MCP server proxy..."

# Run mcpo with the GitHub MCP server Docker container
# The server runs via Docker and communicates through stdio
exec uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
    docker run -i --rm \
    -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_PERSONAL_ACCESS_TOKEN" \
    ghcr.io/github/github-mcp-server
EOF

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$MCP_PORT/health || curl -f http://localhost:$MCP_PORT/docs || exit 1

# Expose port
EXPOSE 8000

# Run the startup script
CMD ["/app/start.sh"]

# =============================================================================
# REF Tools MCP server (default target)
# =============================================================================
FROM node-base AS ref

# Install ref-tools MCP server
RUN npm install -g ref-tools-mcp@latest

# Create startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting ref-tools MCP server..."
uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
    npx ref-tools-mcp@latest
EOF

RUN chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$MCP_PORT/health || curl -f http://localhost:$MCP_PORT/docs || exit 1

# Expose port
EXPOSE 8000

# Run the startup script
CMD ["/app/start.sh"]

# =============================================================================
# Generic MCP server with runtime configuration (legacy compatibility)
# =============================================================================
FROM node-base AS generic

# Install additional dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir mcp-obsidian

# Install Node.js MCP servers globally
RUN npm install -g \
    ref-tools-mcp@latest \
    @modelcontextprotocol/server-filesystem@latest \
    @modelcontextprotocol/server-sequential-thinking@latest

# Environment variables for configuration
ENV MCP_SERVER_TYPE="ref"
ENV GITHUB_PERSONAL_ACCESS_TOKEN=""

# Create a startup script
RUN cat > /app/start.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting MCP server type: $MCP_SERVER_TYPE"

case "$MCP_SERVER_TYPE" in
    "github")
        if [ -z "$GITHUB_PERSONAL_ACCESS_TOKEN" ]; then
            echo "Error: GITHUB_PERSONAL_ACCESS_TOKEN is required for GitHub MCP server"
            exit 1
        fi
        echo "Starting GitHub MCP server via Docker-in-Docker..."
        # Note: This requires Docker socket mounting or Docker-in-Docker setup
        # For now, we'll use the GitHub MCP server directly if available
        uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
            docker run -i --rm \
            -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_PERSONAL_ACCESS_TOKEN" \
            ghcr.io/github/github-mcp-server
        ;;

    "ref")
        echo "Starting ref-tools MCP server..."
        uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
            npx ref-tools-mcp@latest
        ;;

    "time")
        echo "Starting time MCP server (example/demo)..."
        uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
            uvx mcp-server-time --local-timezone=America/New_York
        ;;

    "filesystem")
        echo "Starting filesystem MCP server..."
        # Convert FILESYSTEM_DIRS string to array
        IFS=' ' read -r -a DIRS <<< "${FILESYSTEM_DIRS:-/data}"
        uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
            npx @modelcontextprotocol/server-filesystem "${DIRS[@]}"
        ;;

    "obsidian")
        echo "Starting Obsidian MCP server..."
        if [ -z "$OBSIDIAN_API_KEY" ] || [ -z "$OBSIDIAN_HOST" ] || [ -z "$OBSIDIAN_PORT" ]; then
            echo "Error: OBSIDIAN_API_KEY, OBSIDIAN_HOST, and OBSIDIAN_PORT are required for Obsidian MCP server"
            exit 1
        fi
        uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
            uvx mcp-obsidian
        ;;

    "sequentialthinking")
        echo "Starting Sequential Thinking MCP server..."
        if [ "$DISABLE_THOUGHT_LOGGING" = "true" ]; then
            echo "Thought logging is disabled"
        fi
        uvx mcpo --host $MCP_HOST --port $MCP_PORT -- \
            npx @modelcontextprotocol/server-sequential-thinking
        ;;

    *)
        echo "Error: Unknown MCP_SERVER_TYPE: $MCP_SERVER_TYPE"
        echo "Valid options: github, ref, time, filesystem, obsidian, sequentialthinking"
        exit 1
        ;;
esac
EOF

RUN chmod +x /app/start.sh

# Expose the default port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:$MCP_PORT/health || curl -f http://localhost:$MCP_PORT/docs || exit 1

# Run the startup script
CMD ["/app/start.sh"]