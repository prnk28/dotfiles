-- AstroLSP configuration for v4+
return {
  "AstroNvim/astrolsp",
  ---@type AstroLSPOpts
  opts = {
    -- Configuration for language servers
    servers = {
      -- Language servers will be configured here when needed
      -- Example:
      -- "lua_ls" = {
      --   settings = {
      --     Lua = {
      --       diagnostics = { globals = { "vim" } }
      --     }
      --   }
      -- }
    },
    -- Configure buffer local auto commands to add when attaching a language server
    autocmds = {
      -- First key is the `lsp` event to listen to, value is a list of autocmds to register
      -- See `:h LspAttach`, `:h LspDetach`, etc. for more information
      lsp_document_highlight = {
        -- Disable document highlight if needed
        cond = "textDocument/documentHighlight",
      },
    },
    -- Configure server registration options
    capabilities = {
      -- Add any additional capabilities here
    },
    -- Configure `vim.lsp.handlers`
    handlers = {
      -- Add any custom handlers here
    },
    -- Configure `vim.diagnostic.config`
    diagnostics = {
      -- Diagnostics configuration is handled in astrocore.lua
    },
    -- Configure options for specific language servers
    config = {
      -- Example for specific server configuration:
      -- lua_ls = function(opts)
      --   opts.settings.Lua.diagnostics.globals = vim.tbl_extend("force", opts.settings.Lua.diagnostics.globals or {}, { "vim" })
      --   return opts
      -- end
    },
    -- Customize how language servers are set up
    setup_handlers = {
      -- Default handler
      function(server, opts)
        require("lspconfig")[server].setup(opts)
      end,
    },
    -- Configure on_attach function for all servers
    on_attach = function(client, bufnr)
      -- Custom on_attach logic can go here
    end,
    -- Formatting options
    formatting = {
      -- Control auto formatting on save
      format_on_save = {
        enabled = true, -- Enable or disable format on save globally
        allow_filetypes = { -- Table of filetypes to enable format on save
          -- Add filetypes here
        },
        ignore_filetypes = { -- Table of filetypes to disable format on save
          -- Add filetypes here
        },
      },
      disabled = { -- Disable formatting capabilities for specific language servers
        -- Add server names here
      },
      timeout_ms = 1000, -- Default format timeout
    },
  },
}