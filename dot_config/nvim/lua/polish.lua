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
  form = {
    win_opts = {
      winblend = 0,
      winhighlight = "NormalFloat:MyCustomHighlight",
    },
  },
  confirm = {
    win_opts = {
      winblend = 0,
      winhighlight = "NormalFloat:MyCustomHighlight",
    },
  },
  task_win = {
    win_opts = {
      winblend = 0,
      winhighlight = "NormalFloat:MyCustomHighlight",
    },
  },
}
