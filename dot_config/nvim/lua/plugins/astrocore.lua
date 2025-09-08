local Terminal = require("toggleterm.terminal").Terminal

-- Terminals
local claude = Terminal:new {
  cmd = "claude --continue",
  hidden = true,
  direction = "tab",
  close_on_exit = false, -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local opencode = Terminal:new {
  cmd = "opencode",
  hidden = true,
  direction = "tab",
  close_on_exit = false, -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local yazi = Terminal:new {
  cmd = "yazi",
  hidden = true,
  direction = "tab",
  close_on_exit = true, -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local ghdash = Terminal:new {
  cmd = "gh dash",
  hidden = true,
  direction = "float", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local lazydocker = Terminal:new {
  cmd = "lazydocker",
  hidden = true,
  direction = "float", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local lazygit = Terminal:new {
  cmd = "lazygit",
  hidden = true,
  direction = "float", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local lazyjournal = Terminal:new {
  cmd = "lazyjournal",
  hidden = true,
  direction = "float", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local pc = Terminal:new {
  cmd = "devbox services up",
  hidden = true,
  direction = "float", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local scratchFloat = Terminal:new {
  cmd = "zsh",
  hidden = true,
  direction = "float", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

-- Toggle Functions
function Claude_toggle() claude:toggle() end
function Opencode_toggle() opencode:toggle() end
function Ghdash_toggle() ghdash:toggle() end

function Lazydocker_toggle() lazydocker:toggle() end
function Lazygit_toggle() lazygit:toggle() end
function Lazyjournal_toggle() lazyjournal:toggle() end
function PC_toggle() pc:toggle() end
function ScratchFloat_toggle() scratchFloat:toggle() end
function Yazi_toggle() yazi:toggle() end

return {
  "AstroNvim/astrocore",
  ---@type AstroCoreOpts
  opts = {
    rooter = {
      -- list of detectors in order of prevalence, elements can be:
      --   "lsp" : lsp detection
      --   string[] : a list of directory patterns to look for
      --   fun(bufnr: integer): string|string[] : a function that takes a buffer number and outputs detected roots
      detector = {
        "lsp", -- highest priority is getting workspace from running language servers
        { ".git", "_darcs", ".hg", ".bzr", ".svn" }, -- next check for a version controlled parent directory
        {
          "go.mod",
          "package.json",
          "lua",
          "Cargo.toml",
          "go.work",
          "go.mod",
          "package.json",
          "Pipfile",
          "buf.yaml",
          "docs.json",
        }, -- lastly check for a file named `main`
      },
      -- ignore things from root detection
      ignore = {
        servers = {}, -- list of language server names to ignore (Ex. { "efm" })
        dirs = {}, -- list of directory patterns (Ex. { "~/.cargo/*" })
      },
      -- automatically update working directory (update manually with `:AstroRoot`)
      autochdir = true,
      -- scope of working directory to change ("global"|"tab"|"win")
      scope = "win", -- Changed from "win" to "global" to make directory changes apply globally
      -- show notification on every working directory change
      notify = false,
    },

    -- Configure core features of AstroNvim
    features = {
      autopairs = true, -- enable autopairs at start
      diagnostics_mode = 1, -- diagnostic mode on start (0 = off, 1 = no signs/virtual text, 2 = no virtual text, 3 = on)
      highlighturl = true, -- highlight URLs at start
      notifications = false, -- enable notifications at start
    },

    -- Diagnostics configuration (for vim.diagnostics.config({...})) when diagnostics are on
    diagnostics = {
      virtual_text = true,
      underline = true,
    },
    -- vim options can be configured here
    options = {
      opt = { -- vim.opt.<key>
        relativenumber = false, -- sets vim.opt.relativenumber
        number = true, -- sets vim.opt.number
        spell = false, -- sets vim.opt.spell
        wrap = true, -- sets vim.opt.wrap
      },
      g = { -- vim.g.<key>
        -- configure global vim variables (vim.g)
        -- NOTE: `mapleader` and `maplocalleader` must be set in the AstroNvim opts or before `lazy.setup`
        -- This can be found in the `lua/lazy_setup.lua` file
      },
    },
    -- Mappings can be configured through AstroCore as well.
    -- NOTE: keycodes follow the casing in the vimdocs. For example, `<Leader>` must be capitalized
    mappings = {
      -- first key is the mode
      n = {
        -- navigate buffer tabs
        ["F"] = { "za", desc = "Toggle fold under cursor" },
        ["L"] = { "<Cmd>BufferLineCycleNext<CR>", desc = "Next buffer" },
        ["H"] = { "<Cmd>BufferLineCyclePrev<CR>", desc = "Previous buffer" },
        ["B"] = { "<Cmd>BufferLinePick<CR>", desc = "Pick buffer" },
        ["<leader>bb"] = { "<Cmd>BufferLinePick<CR>", desc = "Pick buffer" },
        ["<leader>bc"] = { "<Cmd>BufferLinePickClose<CR>", desc = "Pick buffer to close" },
        ["<leader>bg"] = {
          function()
            -- Toggle only groups that auto-close (not currently highlighted by default)
            local auto_close_groups = { "Actions", "Claude", "Config", "Docs", "Scripts", "Terminals" }
            for _, group in ipairs(auto_close_groups) do
              vim.cmd("BufferLineGroupToggle " .. group)
            end
          end,
          desc = "Toggle auto-close buffer groups",
        },
        ["<C-e>"] = { "<Cmd>Neotree toggle<CR>", desc = "Show Explorer" },
        ["<leader>k"] = { Claude_toggle, desc = "Claude Toggle" },
        ["<C-i>p"] = { PC_toggle, desc = "Devbox Services Toggle", noremap = true },
        ["<C-i>o"] = { Opencode_toggle, desc = "OpenCode Toggle" },
        ["<C-i>d"] = { Lazydocker_toggle, desc = "Lazydocker Toggle" },
        ["<C-i>j"] = { Lazyjournal_toggle, desc = "Lazyjournal Toggle" },
        ["<C-i>k"] = { Claude_toggle, desc = "Claude Toggle" },
        ["<C-g>g"] = { Lazygit_toggle, desc = "Lazygit Toggle" },
        ["<C-g>d"] = { Ghdash_toggle, desc = "GitHub Dashboard Toggle" },
        ["<C-g>o"] = { "<cmd>!gh repo view --web<CR>", desc = "Open repo in browser" },
        ["<C-t>."] = { Yazi_toggle, desc = "Yazi Toggle" },
        ["K"] = { function() vim.diagnostic.goto_prev() end, desc = "Previous Diagnostic" },
        ["J"] = { function() vim.diagnostic.goto_next() end, desc = "Next Diagnostic" },
        ["T"] = { "gg", desc = "Go to top of file" },
        ["X"] = { "<Cmd>wa<CR><Cmd>bd<CR><Esc>", desc = "Save, close buffer, and return to normal mode" },
        ["vv"] = { "gg0VG$", desc = "Select all contents in buffer" },
        ["<leader><leader>"] = {
          function() require("snacks").picker.grep_buffers() end,
          desc = "Find in buffers",
        },
        ["<leader>fd"] = {
          function() require("snacks").picker.diagnostics() end,
          desc = "Find diagnostics",
        },
        ["'"] = { "<Cmd>Grapple toggle<CR>", desc = "Grapple toggle tag" },
        ["M"] = { "<Cmd>Grapple toggle_tags<CR>", desc = "Grapple toggle tag" },
        ["<C-f>"] = {
          function() require("telescope.builtin").live_grep() end,
          desc = "Find word in all files",
        },
        ["<C-m>"] = { "<Cmd>OverseerRun<CR>", desc = "Run Overseer" },
        ["<C-s>"] = { "<Cmd>wa<CR>", desc = "Save and close buffer" }, -- Modified to save and close buffer
        ["<C-c>"] = { "<Cmd>wa<CR><Cmd>bd<CR>", desc = "Save and close buffer" }, -- Modified to save and close buffer
        ["<C-x>"] = { "<Cmd>wa<CR><Cmd>bd<CR>", desc = "Save and close buffer" }, -- Added C-x to save and close buffer
        ["<C-r>"] = { ":IncRename", desc = "Rename" }, -- Modified to save and close buffer
        ["<C-u>"] = {
          function() require("snacks").picker.lsp_symbols() end,
          desc = "Find diagnostics",
        },
        -- LSP Source Action <C-.>
        ["<C-a>"] = { function() vim.lsp.buf.code_action() end, desc = "LSP Code Action" },
        ["<C-,>"] = { function() vim.lsp.buf.hover() end, desc = "LSP Hover" },
        -- Terminal launcher
        ["<C-t>j"] = { "<cmd>ToggleTerm direction=horizontal<CR>", desc = "Terminal horizontal" },
        ["<C-t>k"] = { "<cmd>ToggleTerm direction=vertical<CR>", desc = "Terminal vertical" },
        ["<C-t>s"] = { ScratchFloat_toggle, desc = "Scratch Terminal" },
      },
      i = {
        ["<C-s>"] = { "<Cmd>wa<CR><Esc>", desc = "Save and return to normal mode" },
        ["<C-c>"] = { "<Cmd>wa<CR><Cmd>bd<CR><Esc>", desc = "Save, close buffer, and return to normal mode" },
        ["<C-x>"] = { "<Cmd>wa<CR><Cmd>bd<CR><Esc>", desc = "Save, close buffer, and return to normal mode" }, -- Added C-x for insert mode
      },
      v = {
        ["<C-e>"] = { "<Cmd>Neotree toggle<CR>", desc = "Show Explorer" },
        ["<C-c>"] = { "<Cmd>w<CR><Cmd>bd<CR>", desc = "Save and close buffer" }, -- Modified to save and close buffer
        ["<C-x>"] = { "<Cmd>w<CR><Cmd>bd<CR>", desc = "Save and close buffer" }, -- Added C-x for visual mode
      },
      t = {
        ["<Esc>"] = {
          function()
            vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n>]], true, false, true), "n", false)
          end,
          desc = "Exit terminal mode",
        },
        -- Exit terminal mode and close window
        ["<C-c>"] = {
          function()
            vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n>]], true, false, true), "n", false)
          end,
          desc = "Exit terminal and close window",
        },
        -- Add tmux-style window navigation
        ["<C-h>"] = {
          function()
            vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n><C-w>h]], true, false, true), "n", false)
          end,
          desc = "Navigate to left window",
        },
        ["<C-j>"] = {
          function()
            vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n><C-w>j]], true, false, true), "n", false)
          end,
          desc = "Navigate to bottom window",
        },
        ["<C-k>"] = {
          function()
            vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n><C-w>k]], true, false, true), "n", false)
          end,
          desc = "Navigate to top window",
        },
        ["<C-l>"] = {
          function()
            vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n><C-w>l]], true, false, true), "n", false)
          end,
          desc = "Navigate to right window",
        },
      },
    },
  },
}
