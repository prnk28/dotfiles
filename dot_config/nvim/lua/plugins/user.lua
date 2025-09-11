-- You can also add or configure plugins by creating files in this `plugins/` folder
-- PLEASE REMOVE THE EXAMPLES YOU HAVE NO INTEREST IN BEFORE ENABLING THIS FILE
-- Here are some examples:

---@type LazySpec
return {
  {
    "dustinblackman/oatmeal.nvim",
    cmd = { "Oatmeal" },
    keys = {
      { "<C-a>o", mode = "n", desc = "Start Oatmeal session" },
    },
    opts = {
      backend = "claude",
    },
  },
  -- Lazy.nvim
  {
    "folke/snacks.nvim",
    opts = {
      input = {},
      terminal = {},
      explorer = {
        opts = {
          auto_close = true,
          win = {
            list = {
              keys = {
                ["<BS>"] = "explorer_up",
                ["l"] = "confirm",
                ["h"] = "explorer_close", -- close directory
                ["a"] = "explorer_add",
                ["d"] = "explorer_del",
                ["<c-l>"] = "close",
                ["r"] = "explorer_rename",
                ["c"] = "explorer_copy",
                ["m"] = "explorer_move",
                ["o"] = "explorer_open", -- open with system application
                ["P"] = "toggle_preview",
                ["y"] = { "explorer_yank", mode = { "n", "x" } },
                ["p"] = "explorer_paste",
                ["u"] = "explorer_update",
                ["<c-c>"] = "tcd",
                ["<leader>/"] = "picker_grep",
                ["<c-t>"] = "terminal",
                ["."] = "explorer_focus",
                ["I"] = "toggle_ignored",
                ["H"] = "toggle_hidden",
                ["Z"] = "explorer_close_all",
                ["]g"] = "explorer_git_next",
                ["[g"] = "explorer_git_prev",
                ["]d"] = "explorer_diagnostic_next",
                ["[d"] = "explorer_diagnostic_prev",
                ["]w"] = "explorer_warn_next",
                ["[w"] = "explorer_warn_prev",
                ["]e"] = "explorer_error_next",
                ["[e"] = "explorer_error_prev",
              },
            },
          },
        },
      },
      dashboard = {
        preset = {
          header = table.concat({
            "",
            "",
            "                ████████                ",
            "             ██████████████             ",
            "           ████████████████             ",
            "         ██████████  █████              ",
            "       ██████████               █       ",
            "     ██████████               █████     ",
            "    █████████               █████████   ",
            "  █████████       ████       █████████  ",
            " ████████       ████████       ████████ ",
            "███████       ████████████       ███████",
            "███████      ██████████████       ██████",
            "███████       ████████████       ███████",
            " ████████       ████████       ████████ ",
            "  █████████       ████       █████████  ",
            "    ████████               ██████████   ",
            "     ██████              ██████████     ",
            "       ██               █████████       ",
            "               ████  ██████████         ",
            "             ████████████████           ",
            "             ██████████████             ",
            "                ████████                ",
            "",
            "",
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
