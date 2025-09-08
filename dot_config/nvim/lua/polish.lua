-- Polish configuration: Final setup and overrides
-- This runs last in the setup process

-- Overseer setup for task running
require("overseer").setup {
  strategy = {
    "toggleterm",
    use_shell = false,
    auto_scroll = true,
    close_on_exit = false,
    direction = "vertical",
    quit_on_exit = "success",
    open_on_start = true,
    hidden = true,
  },
}

-- ToggleTerm setup with dynamic sizing
require("toggleterm").setup {
  size = function(term)
    if term.direction == "horizontal" then
      return 15
    elseif term.direction == "vertical" then
      return vim.o.columns * 0.35
    else
      return 20
    end
  end,
  shade_terminals = false,
  start_in_insert = true,
}