local Terminal = require("toggleterm.terminal").Terminal

local explorerOptions = {
  auto_close = false,
  include = {
    ".chezmoidata",
    ".chezmoiscripts",
    ".chezmoitemplates",
  },
  ignore = {
    "chain_*.json",
    ".typecopy",
    ".python-version",
    "*.pb.go",
    "*config.*.js",
    "*config.js",
    "deps.mjs",
    ".parcelrc",
    "worker-configuration.d.ts",
    "wrangler.jsonc",
    "*.pkl.go",
    ".trunk",
    ".config",
    ".cz.toml",
    "*_integration.go",
    "*_test.go",
    "*_query_docs.md",
    "*_tx_docs.md",
    "*_mock.go",
    "biome*",
    "client",
    "contracts",
    "crypto",
    "proto",
    "CONSTITUTION.md",
    "CONTRIBUTING.md",
    "api",
    "turbo.json",
    "scripts",
    "OpenCode.md",
    "AGENT.md",
    "AGENTS.md",
    "svgo.config.mjs",
    ".prettierrc.cjs",
    ".eslintrc.cjs",
    "tsconfig.json",
    "process-compose.yaml",
    "process-compose.yml",
    "tsconfig.prod.json",
    ".prettierignore",
    "CONVENTIONS.md",
    ".gitkeep",
    ".source",
    "settings.json",
    ".gitignore",
    "analysis_options.yaml",
    "slumber.yml",
    ".eslintignore",
    "CONTRIBUTING.md",
    "CHANGELOG.md",
    "devbox.d",
    "env",
    ".husky",
    "translations",
    "LICENSE.md",
    ".envrc",
    "CLAUDE.md",
    "chains",
    "test",
    ".golangci.yml",
    "go.mod",
    "pnpm-workspace.yaml",
    ".git",
    "pnpm-lock.yaml",
    ".next",
    ".task",
    ".devbox",
    ".dart_tool",
    ".idea",
    ".metadata",
    ".venv",
    ".gradle",
    "gradle.bat",
    ".aider.chat.history.md",
    ".aider.input.history",
    ".aider.tags.cache.v3",
    ".devcontainer",
    "heighliner",
    ".tmp",
    "go.work.sum",
    ".DS_Store",
    ".git",
    "LICENSE",
    "tmp",
    "sonr.log",
    "DISCUSSION_TEMPLATE",
    "ISSUE_TEMPLATE",
    ".devbox",
    ".timemachine",
    "junit.xml",
    ".jj",
    ".spawn",
    ".turbo",
    "CLAUDE*",
    ".pkl-lsp",
    ".tsbuildinfo",
    "contrib",
    "interchaintest",
    "package-lock.json",
    ".prettierrc",
    "node_modules",
    "PULL_REQUEST_TEMPLATE.md",
    ".DocumentRevisions-V100",
    ".Spotlight-V100",
    ".TemporaryItems",
    ".Trashes",
    ".fseventsd",
    ".editorconfig",
    "*.min.js",
    ".gitpod.*",
    "cspell.*",
    "*.lock",
    "*.lockb",
    "*.pulsar.go",
    "*.pb.gorm.go",
    "*.pb.gw.go",
    "*_templ.go",
    "*.tmp",
    "*.work.*",
    "*.sum",
    ".wrangler",
    "*.wasm",
    "*.png",
    "*.min.js",
    "*.jpg",
    ".parcel-cache",
    "*.icns",
    "*.ico",
    ".aider.tags.cache.v4",
    "*.iml",
    "Icon?",
    "iCloud~",
    "com~",
    "readme.md",
    "*.icns",
    ".conform*",
    ".null-ls_*",
  },
  win = {
    list = {
      keys = {
        ["<c-l>"] = "close",
        ["H"] = "explorer_up",
        ["L"] = "explorer_focus",
        ["l"] = "confirm",
        ["s"] = "confirm", -- close directory
        ["a"] = "explorer_add",
        ["d"] = "explorer_del",
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
        ["I"] = "toggle_ignored",
        ["."] = "toggle_hidden",
        ["<bs>"] = "explorer_close_all",
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

local scooter = Terminal:new {
  cmd = "scooter",
  hidden = true,
  direction = "vertical", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

local claude = Terminal:new {
  cmd = "claude --continue",
  hidden = true,
  direction = "tab", -- function to run on opening the terminal
  auto_scroll = true,
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

local mk = Terminal:new {
  cmd = "mk",
  hidden = true,
  direction = "vertical", -- function to run on opening the terminal
  on_open = function(term)
    vim.cmd "startinsert!"
    vim.api.nvim_buf_set_keymap(term.bufnr, "n", "q", "<cmd>close<CR>", { noremap = true, silent = true })
  end,
}

-- Toggle Functions
function Claude_toggle() claude:toggle() end
function Lazyjournal_toggle() lazyjournal:toggle() end
function Mk_toggle() mk:toggle() end
function Scooter_toggle() scooter:toggle() end
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
          "docs.json",
        }, -- lastly check for a file named `main`
      },
      -- ignore things from root detection
      ignore = {
        servers = {}, -- list of language server names to ignore (Ex. { "efm" })
        dirs = {}, -- list of directory patterns (Ex. { "~/.cargo/*" })
      },
      -- automatically update working directory (update manually with `:AstroRoot`)
      autochdir = false,
      -- scope of working directory to change ("global"|"tab"|"win")
      scope = "global", -- Changed from "win" to "global" to make directory changes apply globally
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
        ["<C-c>"] = { "<Cmd>wa<CR><Cmd>bd<CR>", desc = "Save and close buffer" }, -- Added C-x to save and close buffer
        ["F"] = { "za", desc = "Toggle fold under cursor" },
        ["L"] = { "<Cmd>BufferLineCycleNext<CR>", desc = "Next buffer" },
        ["H"] = { "<Cmd>BufferLineCyclePrev<CR>", desc = "Previous buffer" },
        ["<C-e>"] = {
          function() require("snacks").explorer.open(explorerOptions) end,
          desc = "Open Explorer",
        },
        ["<C-m>"] = { "<Cmd>OverseerRun<CR>", desc = "Run Overseer" },
        ["<leader><leader>"] = {
          Claude_toggle,
          desc = "Claude",
        },
        ["<C-b>b"] = { "<Cmd>BufferLinePick<CR>", desc = "Pick buffer" },
        ["<C-b>f"] = {
          function() require("snacks").picker.buffers() end,
          desc = "Find buffers",
        },
        ["<C-b>x"] = {
          function()
            local current_buffer = vim.api.nvim_get_current_buf()
            for _, buf in ipairs(vim.api.nvim_list_bufs()) do
              if buf ~= current_buffer then vim.api.nvim_buf_delete(buf, { force = true }) end
            end
          end,
          desc = "Close all buffers except the current one",
        },
        ["<C-b>g"] = {
          function()
            local groups = { "DEX", "DID", "DWN", "SVC", "Tests", "Actions", "Claude", "Docs", "Config" }
            for _, group in ipairs(groups) do
              vim.cmd("BufferLineGroupToggle " .. group)
            end
          end,
          desc = "Toggle all buffer groups",
        },
        -- Quick group toggles
        ["<C-b>1"] = { "<Cmd>BufferLineGroupToggle DEX<CR>", desc = "Toggle DEX group" },
        ["<C-b>2"] = { "<Cmd>BufferLineGroupToggle DID<CR>", desc = "Toggle DID group" },
        ["<C-b>3"] = { "<Cmd>BufferLineGroupToggle DWN<CR>", desc = "Toggle DWN group" },
        ["<C-b>4"] = { "<Cmd>BufferLineGroupToggle SVC<CR>", desc = "Toggle SVC group" },
        ["<C-b>t"] = { "<Cmd>BufferLineGroupToggle Tests<CR>", desc = "Toggle Tests group" },
        ["<C-b>c"] = { "<Cmd>BufferLineGroupToggle Config<CR>", desc = "Toggle Config group" },
        ["<C-b>k"] = { "<Cmd>BufferLinePickClose<CR>", desc = "Pick buffer to close" },
        ["<C-g>o"] = { "<cmd>!gh repo view --web<CR>", desc = "Open Repo on Web" },
        ["<C-g>h"] = {
          function()
            require("snacks").terminal("gh dash", {
              hidden = true,
              auto_close = false,
              interactive = true,
            })
          end,
          desc = "Dashboard",
        },
        ["<C-g>g"] = {
          function()
            require("snacks").terminal("lazygit", {
              hidden = true,
              auto_close = false,
              interactive = true,
            })
          end,
          desc = "Lazygit",
        },
        ["<C-g>d"] = {
          function() require("snacks").picker.git_diff() end,
          desc = "Search git diffs",
        },
        ["<C-g>b"] = {
          function() require("snacks").picker.git_branches() end,
          desc = "Search git branches",
        },
        ["<C-t>m"] = { Mk_toggle, desc = "Run mk", noremap = true },
        ["<C-t>j"] = { Lazyjournal_toggle, desc = "Lazyjournal Toggle" },
        ["<C-t>l"] = {
          function()
            require("snacks").terminal("lazydocker", {
              hidden = true,
              auto_close = false,
              start_in_insert = true,
              interactive = true,
            })
          end,
          desc = "Lazydocker Toggle",
        },
        ["<C-t>du"] = {
          function()
            require("snacks").terminal("devbox services up", {
              hidden = true,
              auto_close = false,
              start_in_insert = true,
              interactive = true,
            })
          end,
          desc = "Devbox Services Up",
          noremap = true,
        },
        ["<C-t>dd"] = {
          function()
            require("snacks").terminal("devbox services down", {
              hidden = true,
              auto_close = false,
              start_in_insert = true,
              interactive = true,
            })
          end,
          desc = "Devbox Services Down",
          noremap = true,
        },
        ["<C-t>da"] = {
          function()
            require("snacks").terminal("devbox services attach", {
              hidden = true,
              auto_close = false,
              start_in_insert = true,
              interactive = true,
            })
          end,
          desc = "Devbox Services Attach",
          noremap = true,
        },
        ["<C-t>."] = { Yazi_toggle, desc = "Yazi Toggle" },
        ["<C-t>t"] = {
          function() require("snacks").terminal() end,
          desc = "Toggle Terminal",
        },
        ["K"] = { function() vim.diagnostic.goto_prev() end, desc = "Previous Diagnostic" },
        ["J"] = { function() vim.diagnostic.goto_next() end, desc = "Next Diagnostic" },
        ["vv"] = { "gg0VG$", desc = "Select all contents in buffer" },
        ["<C-f>r"] = {
          Scooter_toggle,
          desc = "Find and replace",
        },
        ["<C-f>d"] = {
          function() require("snacks").picker.diagnostics() end,
          desc = "Find diagnostics",
        },
        ["<C-f>f"] = {
          function() require("snacks").picker.smart() end,
          desc = "Find files",
        },
        ["<C-f>o"] = {
          function() require("snacks").picker.recent() end,
          desc = "Find recent files",
        },
        ["<C-f>g"] = {
          function() require("snacks").picker.git_files() end,
          desc = "Find git files",
        },
        ["<C-f>l"] = {
          function() require("snacks").picker.lines() end,
          desc = "Find in line",
        },
        ["<C-f>w"] = {
          function() require("snacks").picker.grep_buffers() end,
          desc = "Find word in open buffers",
        },
        ["<C-f>p"] = {
          function() require("snacks").picker.zoxide() end,
          desc = "Find Projects with Zoxide",
        },
        ["<C-a>a"] = { function() vim.lsp.buf.code_action() end, desc = "LSP Code Action" },
        ["<C-a>h"] = { function() vim.lsp.buf.hover() end, desc = "LSP Hover" },
        ["<C-a>d"] = {
          function() require("snacks").picker.lsp_definitions() end,
          desc = "Find LSP definitions",
        },
        ["<C-a>r"] = {
          function() require("snacks").picker.lsp_references() end,
          desc = "Find LSP references",
        },
        ["<C-a>s"] = {
          function() require("snacks").picker.lsp_symbols() end,
          desc = "Find LSP symbols",
        },
        -- Terminal launcher
      },
      i = {
        ["<C-s>"] = { "<Cmd>wa<CR><Esc>", desc = "Save and return to normal mode" },
        ["<C-c>"] = { "<Cmd>wa<CR><Cmd>bd<CR><Esc>", desc = "Save, close buffer, and return to normal mode" },
        ["<C-x>"] = { "<Cmd>wa<CR><Cmd>bd<CR><Esc>", desc = "Save, close buffer, and return to normal mode" }, -- Added C-x for insert mode
      },
      v = {
        ["<C-e>"] = {
          function() require("snacks").explorer.open(explorerOptions) end,
          desc = "Open Explorer",
        },
        ["<C-c>"] = { "<Cmd>w<CR><Cmd>bd<CR>", desc = "Save and close buffer" }, -- Modified to save and close buffer
        ["<C-x>"] = { "<Cmd>w<CR><Cmd>bd<CR>", desc = "Save and close buffer" }, -- Added C-x for visual mode
      },
      t = {
        ["<C-e>"] = {
          function() require("snacks").explorer.open(explorerOptions) end,
          desc = "Open Explorer",
        },
        ["<leader>e"] = {
          function() require("snacks").explorer.open() end,
          desc = "Open Explorer",
        },
        ["<C-b>f"] = {
          function() require("snacks").picker.buffers() end,
          desc = "Find buffers",
        },
        -- Exit terminal mode and close window
        ["<C-c>"] = {
          function()
            vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes([[<C-\><C-n>]], true, false, true), "n", false)
            vim.cmd "close"
          end,
          desc = "Exit terminal and close window",
        },
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
