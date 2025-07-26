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
          "requirements.txt",
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
      scope = "tab", -- Changed from "win" to "global" to make directory changes apply globally
      -- show notification on every working directory change
      notify = false,
    },

    -- Configure core features of AstroNvim
    features = {
      autopairs = true, -- enable autopairs at start
      diagnostics_mode = 3, -- diagnostic mode on start (0 = off, 1 = no signs/virtual text, 2 = no virtual text, 3 = on)
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
        ["L"] = { function() require("astrocore.buffer").nav(vim.v.count1) end, desc = "Next buffer" },
        ["H"] = { function() require("astrocore.buffer").nav(-vim.v.count1) end, desc = "Previous buffer" },
        ["K"] = { function() vim.diagnostic.goto_prev() end, desc = "Previous Diagnostic" },
        ["J"] = { function() vim.diagnostic.goto_next() end, desc = "Next Diagnostic" },
        ["T"] = { "gg", desc = "Go to top of file" },
        ["X"] = { "<Cmd>wa<CR><Cmd>bd<CR><Esc>", desc = "Save, close buffer, and return to normal mode" },
        ["vv"] = { "gg0VG$", desc = "Select all contents in buffer" },
        ["<leader><leader>"] = {
          function() require("snacks").picker.smart() end,
          desc = "Smart find files",
        },
        ["<C-d>"] = {
          function() require("snacks").picker.diagnostics() end,
          desc = "Find diagnostics",
        },

        ["<C-o>"] = {
          function() require("snacks").picker.lsp_symbols() end,
          desc = "Find diagnostics",
        },
        ["'"] = { "<Cmd>Grapple toggle<CR>", desc = "Grapple toggle tag" },
        ["M"] = { "<Cmd>Grapple toggle_tags<CR>", desc = "Grapple toggle tag" },
        ["<C-f>"] = {
          function() require("telescope.builtin").live_grep() end,
          desc = "Find word in all files",
        },

        ["<C-e>"] = { "<Cmd>Neotree toggle<CR>", desc = "Show Explorer" },
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

        ["<C-p>"] = { "<cmd>ClaudeCode<CR>", desc = "Toggle Claude Code" },
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
            -- Check if we're in an Aider terminal buffer
            local current_buf = vim.api.nvim_get_current_buf()
            local buf_name = vim.api.nvim_buf_get_name(current_buf)

            -- If the buffer name contains "Aider" (as seen in the screenshot)
            if buf_name:match "Aider" then
              vim.cmd "AiderTerminalToggle"
            else
              -- Default behavior: exit terminal mode
              vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n>]], true, false, true), "n", false)
            end
          end,
          desc = "Exit terminal mode or toggle Aider terminal",
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
