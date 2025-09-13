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

-- Register Devbox template for Overseer
local overseer = require("overseer")

overseer.register_template({
  name = "devbox",
  params = {
    script = {
      type = "string",
      optional = false,
      desc = "The devbox script to run",
    },
  },
  condition = {
    callback = function(opts)
      -- Look for devbox.json in the git root directory
      local git_root = vim.fn.systemlist("git rev-parse --show-toplevel")[1]
      if vim.v.shell_error ~= 0 then
        return false, "Not in a git repository"
      end
      
      local devbox_file = git_root .. "/devbox.json"
      if vim.fn.filereadable(devbox_file) == 0 then
        return false, "No devbox.json found in git root"
      end
      
      if vim.fn.executable("devbox") == 0 then
        return false, "devbox command not found"
      end
      
      return true
    end,
  },
  generator = function(opts, cb)
    local git_root = vim.fn.systemlist("git rev-parse --show-toplevel")[1]
    local devbox_file = git_root .. "/devbox.json"
    
    -- Read and parse devbox.json
    local file = io.open(devbox_file, "r")
    if not file then
      cb({})
      return
    end
    
    local content = file:read("*all")
    file:close()
    
    local ok, data = pcall(vim.json.decode, content)
    if not ok or not data then
      cb({})
      return
    end
    
    local ret = {}
    
    -- Add tasks for each script in devbox.json
    if data.shell and data.shell.scripts then
      for script_name, _ in pairs(data.shell.scripts) do
        table.insert(ret, {
          name = "devbox run " .. script_name,
          builder = function()
            return {
              cmd = { "devbox" },
              args = { "run", script_name },
              cwd = git_root,
            }
          end,
        })
      end
    end
    
    -- Add a generic devbox shell task
    table.insert(ret, {
      name = "devbox shell",
      builder = function()
        return {
          cmd = { "devbox" },
          args = { "shell" },
          cwd = git_root,
        }
      end,
    })
    
    cb(ret)
  end,
})
