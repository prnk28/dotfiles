-- You can also add or configure plugins by creating files in this `plugins/` folder
-- PLEASE REMOVE THE EXAMPLES YOU HAVE NO INTEREST IN BEFORE ENABLING THIS FILE
-- Here are some examples:

---@type LazySpec
return {
  -- Lazy.nvim
  {
    "folke/snacks.nvim",
    opts = {
      dashboard = {
        preset = {
          header = table.concat({
            "       ▗▄████▄▖       ",
            "      ▟███▛███▛▘      ",
            "    ▄███▜▝  ▘▀   ▗    ",
            "  ▗▟██▜▞▘       ▟██▖  ",
            " ▟██▛█▘   ▄▙▖  ▝▜█▜█▙ ",
            "▟██▜▀   ▄████▄   ▀██▟▙",
            "██▟▌   ▐████▟█▜   ▐▟██",
            "▜▛██▄   ▀▜▟█▛▀   ▄██▛▛",
            " ▜█▛█▙▖  ▝▀▌▘  ▗▟█▟▙▛ ",
            "  ▝▜█▛▘       ▟██▟█▘  ",
            "    ▘   ▄▄  ▄███▟▀    ",
            "      ▗▟▜▛██▜█▜▞▘     ",
            "       ▝▀████▀▘       ",
          }, "\n"),
        },
      },
    },
  },
  {
    "apple/pkl-neovim",
    lazy = true,
    ft = "pkl",
    dependencies = {
      {
        "nvim-treesitter/nvim-treesitter",
        build = function(_) vim.cmd "TSUpdate" end,
      },
      "L3MON4D3/LuaSnip",
    },
    build = function()
      require("pkl-neovim").init()
      -- Set up syntax highlighting.
      vim.cmd "TSInstall pkl"
    end,
    config = function()
      -- Set up snippets.
      require("luasnip.loaders.from_snipmate").lazy_load()
      -- Configure pkl-lsp
      vim.g.pkl_neovim = {
        start_command = { "pkl-lsp" },
        -- or if pkl-lsp is installed with brew:
        -- start_command = { "pkl-lsp" },
        pkl_cli_path = "/opt/homebrew/bin/pkl",
      }
    end,
  },
}
