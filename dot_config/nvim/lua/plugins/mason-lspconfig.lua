-- Mason LSPConfig for AstroNvim v4+
return {
  {
    "williamboman/mason-lspconfig.nvim",
    dependencies = {
      "williamboman/mason.nvim",
      "neovim/nvim-lspconfig",
    },
    opts = {
      ensure_installed = {
        "lua_ls",
        "gopls",
        "tsserver",
        "html",
        "cssls",
        "tailwindcss",
        "jsonls",
        "yamlls",
        "bashls",
        "marksman",
        -- Add more servers as needed
      },
      automatic_installation = true,
      handlers = nil, -- Let AstroLSP handle the setup
    },
  },
}