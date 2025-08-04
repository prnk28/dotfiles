-- This will run last in the setup process and is a good place to configure
-- things like custom filetypes. This just pure lua so anything that doesn't
-- fit in the normal config locations above can go here
-- Map <C-/> to toggle Aider terminal in all modes

require("overseer").setup {
  strategy = {
    "toggleterm",
    use_shell = false,
    auto_scroll = true,
    close_on_exit = false,
    quit_on_exit = "success",
    open_on_start = true,
    hidden = true,
  },
}

require("conform").setup {
  format_on_save = {
    timeout_ms = 1500,
    lsp_format = "fallback",
  },
  formatters_by_ft = {
    lua = { "stylua" },
    json = { "fixjson" },
    python = { "isort", "black" },
    markdown = { "markdownlint-cli2", "prettierd", "prettier", stop_after_first = true },
    yaml = { "yamlfmt" },
    toml = { "prettierd", "prettier", stop_after_first = true },
    go = { "gofumpt", "goimports" },
    javascript = { "prettierd", "prettier", stop_after_first = true },
    sh = { "shfmt" },
  },
}
