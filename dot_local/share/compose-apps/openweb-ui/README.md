# MCP (Model Context Protocol) Integration for Open WebUI

This setup includes an MCP-to-OpenAPI proxy server (mcpo) that exposes MCP tool servers via standard REST/OpenAPI endpoints for use with Open WebUI.

## Quick Start

1. **Copy and configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env to configure your MCP server preferences
   ```

2. **For GitHub MCP server, add your token:**
   ```bash
   # Edit .env and set GITHUB_PERSONAL_ACCESS_TOKEN
   # Get a token from: https://github.com/settings/tokens
   ```

3. **Start the services:**
   ```bash
   docker-compose up -d
   ```

## Available Services

- **Open WebUI**: http://localhost:3000
- **MCP Proxy API (ref-tools)**: http://localhost:8001
- **MCP API Documentation**: http://localhost:8001/docs
- **MCP Proxy API (GitHub, if enabled)**: http://localhost:8002

## MCP Server Options

### ref-tools MCP Server (Default)
Provides reference tools for documentation and code examples.

This is enabled by default and requires no additional configuration.

### GitHub MCP Server
Provides access to GitHub repositories, issues, PRs, and more.

To enable:
1. Set `GITHUB_PERSONAL_ACCESS_TOKEN` in your `.env` file
2. Uncomment the `mcpo-github` service in `docker-compose.yml`
3. Restart the services

Required GitHub token scopes:
- `repo` - Full control of private repositories
- `read:org` - Read org and team membership
- `read:user` - Read user profile data

### Time MCP Server (Example/Demo)
Simple server that provides time and timezone utilities.

To enable:
1. Set `MCP_SERVER_TYPE=time` in your `.env` file
2. Restart the mcpo service

## Adding MCP Tools to Open WebUI

Once the MCP proxy is running:

1. Access Open WebUI at http://localhost:3000
2. Navigate to Settings → Tools
3. Add a new OpenAPI tool
4. Enter the appropriate MCP proxy URL:
   - For ref-tools: http://mcpo-ref:8000 (or http://localhost:8001 from outside Docker)
   - For GitHub: http://mcpo-github:8000 (or http://localhost:8002 from outside Docker)
5. The available MCP tools will be automatically discovered and added

## Customization

### Adding More MCP Servers

To add additional MCP servers:

1. Install the server package in `Dockerfile.mcpo`:
   ```dockerfile
   RUN pip install mcp-server-your-server
   ```

2. Update the startup script in `Dockerfile.mcpo` to include your server

3. Rebuild the container:
   ```bash
   docker-compose build mcpo
   docker-compose up -d mcpo
   ```

### Available MCP Servers

Find more MCP servers at: https://github.com/modelcontextprotocol/servers

Popular options:
- `mcp-server-time`: Time and timezone utilities
- `mcp-server-github`: GitHub integration
- `mcp-server-filesystem`: Local filesystem access
- `mcp-server-slack`: Slack integration
- `mcp-server-google-drive`: Google Drive access

## Security Considerations

- **GitHub Token**: Keep your GitHub personal access token secure and never commit it to version control
- **Filesystem Access**: The filesystem server only has access to the mounted `/data` directory
- **Network Isolation**: Services communicate through the Docker network, not exposed to the host

## Troubleshooting

1. **Check service status:**
   ```bash
   docker-compose ps
   ```

2. **View logs:**
   ```bash
   docker-compose logs mcpo
   docker-compose logs open-webui
   ```

3. **Test MCP proxy:**
   ```bash
   curl http://localhost:8001/docs
   ```

4. **Restart services:**
   ```bash
   docker-compose restart
   ```

## Development

To develop or test locally without Docker:

```bash
# Install mcpo
pip install mcpo

# Run ref-tools server
uvx mcpo --port 8000 -- npx ref-tools-mcp@latest

# Or run GitHub server (using Docker)
docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_TOKEN \
  ghcr.io/github/github-mcp-server | \
  uvx mcpo --port 8000

# Or run time server (example)
uvx mcpo --port 8000 -- uvx mcp-server-time --local-timezone=America/New_York
```

## Architecture Notes

### GitHub MCP Server
The GitHub MCP server is distributed as a Docker image (`ghcr.io/github/github-mcp-server`). We provide two approaches:

1. **Dockerfile.mcpo-github**: Extracts the server binary from the official image
2. **Docker-in-Docker**: Runs the official Docker image directly (requires Docker socket access)

### ref-tools MCP Server
The ref-tools server is a Node.js package that provides reference documentation and code examples. It's installed via npm and runs directly.

### Multiple Servers
You can run multiple MCP servers simultaneously on different ports. Each server provides different capabilities that can be added to Open WebUI as separate tools.