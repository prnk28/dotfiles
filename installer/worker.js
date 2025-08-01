export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    // GitHub username
    const GITHUB_USER = "prnk28";

    // Installation scripts
    const scripts = {
      "/apply": `#!/bin/sh
# Install chezmoi and apply dotfiles
# Usage: curl -fsLS prad.codes/apply | sh

set -e

echo "🚀 Installing chezmoi and applying dotfiles from ${GITHUB_USER}..."
echo ""

sh -c "$(curl -fsLS get.chezmoi.io)" -- init --apply ${GITHUB_USER}

echo ""
echo "✅ Dotfiles installed successfully!"
echo "🔄 Run 'chezmoi update' to pull latest changes"
`,

      "/oneshot": `#!/bin/sh
# Install chezmoi and apply dotfiles (one-shot mode for containers)
# Usage: curl -fsLS prad.codes/oneshot | sh

set -e

echo "🚀 Installing chezmoi and applying dotfiles from ${GITHUB_USER} (one-shot mode)..."
echo ""

sh -c "$(curl -fsLS get.chezmoi.io)" -- init --one-shot ${GITHUB_USER}

echo ""
echo "✅ Dotfiles applied successfully!"
`,

      "/": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dotfiles Installer</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background: #0a0a0a;
            color: #e0e0e0;
        }
        h1 { color: #60a5fa; }
        h2 { color: #94a3b8; margin-top: 2rem; }
        pre {
            background: #1e293b;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #334155;
        }
        code {
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            color: #22d3ee;
        }
        .command { user-select: all; }
        .command-container {
            position: relative;
            display: inline-block;
            width: 100%;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #374151;
            border: 1px solid #4b5563;
            color: #d1d5db;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75rem;
            transition: all 0.2s;
        }
        .copy-btn:hover {
            background: #4b5563;
            border-color: #6b7280;
        }
        .copy-btn.copied {
            background: #059669;
            border-color: #10b981;
            color: white;
        }
        .description { 
            color: #94a3b8; 
            margin: 1rem 0;
            line-height: 1.6;
        }
        a { color: #60a5fa; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .warning {
            background: #7c2d12;
            border: 1px solid #ea580c;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
        }
    </style>
</head>
<body>
    <h1>🏠 Dotfiles Installer</h1>
    
    <p class="description">
        Quick installation scripts for <a href="https://github.com/${GITHUB_USER}/dotfiles">${GITHUB_USER}'s dotfiles</a> 
        managed with <a href="https://www.chezmoi.io/">chezmoi</a>.
    </p>

    <h2>📦 Full Installation</h2>
    <p class="description">
        Install chezmoi and apply all dotfiles on a new machine:
    </p>
    <div class="command-container">
        <pre><code class="command">curl -fsLS prad.codes/apply | sh</code></pre>
        <button class="copy-btn" onclick="copyCommand(this, 'curl -fsLS prad.codes/apply | sh')">Copy</button>
    </div>
    
    <h2>🚀 One-Shot Installation</h2>
    <p class="description">
        For containers, VMs, or temporary environments (doesn't persist chezmoi):
    </p>
    <div class="command-container">
        <pre><code class="command">curl -fsLS prad.codes/oneshot | sh</code></pre>
        <button class="copy-btn" onclick="copyCommand(this, 'curl -fsLS prad.codes/oneshot | sh')">Copy</button>
    </div>
    
    <h2>🔧 Manual Installation</h2>
    <p class="description">
        If you prefer to see what you're running:
    </p>
    <pre><code># Install chezmoi first
sh -c "$(curl -fsLS get.chezmoi.io)"

# Then initialize and apply dotfiles
chezmoi init --apply ${GITHUB_USER}</code></pre>

    <h2>📋 Requirements</h2>
    <ul>
        <li>curl or wget</li>
        <li>git</li>
        <li>A POSIX-compliant shell</li>
    </ul>

    <div class="warning">
        <strong>⚠️ Security Notice:</strong> Always review scripts before running them. 
        Check the <a href="https://github.com/${GITHUB_USER}/dotfiles">repository</a> first.
    </div>

    <h2>🔗 Links</h2>
    <ul>
        <li><a href="https://github.com/${GITHUB_USER}/dotfiles">GitHub Repository</a></li>
        <li><a href="https://www.chezmoi.io/">Chezmoi Documentation</a></li>
        <li><a href="/apply">View apply script</a></li>
        <li><a href="/oneshot">View oneshot script</a></li>
    </ul>

    <script>
        function copyCommand(button, text) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
        }
    </script>
</body>
</html>
`,
    };

    // Handle requests
    if (path === "/apply" || path === "/oneshot") {
      // Detect if it's a browser or curl/wget
      const userAgent = request.headers.get("User-Agent") || "";
      const isBrowser =
        userAgent.includes("Mozilla") ||
        userAgent.includes("Chrome") ||
        userAgent.includes("Safari");

      if (isBrowser && !url.searchParams.has("raw")) {
        // Show the script in a nice format for browsers
        return new Response(
          `<!DOCTYPE html>
<html>
<head>
    <title>Dotfiles Installer Script</title>
    <style>
        body { 
            font-family: monospace; 
            background: #0a0a0a; 
            color: #e0e0e0; 
            padding: 2rem;
            margin: 0;
        }
        pre { 
            background: #1e293b; 
            padding: 2rem; 
            border-radius: 8px;
            overflow-x: auto;
            border: 1px solid #334155;
        }
        .header {
            margin-bottom: 2rem;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .command-container {
            position: relative;
            display: inline-block;
            width: 100%;
        }
        .copy-btn {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #374151;
            border: 1px solid #4b5563;
            color: #d1d5db;
            padding: 0.5rem 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.75rem;
            transition: all 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .copy-btn:hover {
            background: #4b5563;
            border-color: #6b7280;
        }
        .copy-btn.copied {
            background: #059669;
            border-color: #10b981;
            color: white;
        }
        a { color: #60a5fa; }
        code { color: #22d3ee; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Dotfiles Installation Script</h1>
        <div class="command-container">
            <p>Run with: <code>curl -fsLS prad.codes${path} | sh</code></p>
            <button class="copy-btn" onclick="copyCommand(this, 'curl -fsLS prad.codes${path} | sh')">Copy</button>
        </div>
        <p><a href="${path}?raw=true">View raw</a> | <a href="/">Back to home</a></p>
    </div>
    <div class="command-container">
        <pre>${scripts[path].replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        <button class="copy-btn" onclick="copyCommand(this, \`${scripts[path].replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`)">Copy Script</button>
    </div>
    
    <script>
        function copyCommand(button, text) {
            navigator.clipboard.writeText(text).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
        }
    </script>
</body>
</html>`,
          {
            headers: { "Content-Type": "text/html" },
          },
        );
      }

      // Serve raw script for curl/wget
      return new Response(scripts[path], {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=300", // Cache for 5 minutes
        },
      });
    }

    // Home page
    if (path === "/") {
      return new Response(scripts["/"], {
        headers: { "Content-Type": "text/html" },
      });
    }

    // 404 for other paths
    return new Response("Not found", { status: 404 });
  },
};
