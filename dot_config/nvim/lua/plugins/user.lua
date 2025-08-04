-- You can also add or configure plugins by creating files in this `plugins/` folder
-- PLEASE REMOVE THE EXAMPLES YOU HAVE NO INTEREST IN BEFORE ENABLING THIS FILE
-- Here are some examples:

---@type LazySpec
return {
  -- Lazy.nvim
  {
    "xvzc/chezmoi.nvim",
    dependencies = { "nvim-lua/plenary.nvim" },
    config = function()
      require("chezmoi").setup {
        -- your configurations
      }
    end,
  },
  {
    "nvim-neotest/neotest",
    dependencies = {
      "nvim-neotest/nvim-nio",
      "nvim-lua/plenary.nvim",
      "antoinemadec/FixCursorHold.nvim",
      "nvim-treesitter/nvim-treesitter",
    },
  },
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
}
