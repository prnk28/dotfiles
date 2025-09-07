-- Bufferline configuration with custom groups
return {
  "akinsho/bufferline.nvim",
  version = "*",
  dependencies = "nvim-tree/nvim-web-devicons",
  config = function()
    local bufferline = require "bufferline"
    local groups = require "bufferline.groups"

    bufferline.setup {
      options = {
        mode = "buffers",
        numbers = "none",
        show_tab_indicators = false,
        separator_style = "thick",
        indicator = {
          style = "icon",
          icon = "▎",
        },
        diagnostics = "nvim_lsp",
        diagnostics_indicator = function(count, level, diagnostics_dict, context)
          local s = " "
          for e, _ in pairs(diagnostics_dict) do
            local sym = e == "error" and " " or (e == "warning" and " " or " ")
            s = s .. sym
          end
          return s
        end,
        always_show_bufferline = true,
        show_buffer_close_icons = true,
        show_close_icon = true,
        modified_icon = "●",
        buffer_close_icon = "󰅖",
        close_icon = "",
        left_trunc_marker = "",
        right_trunc_marker = "",
        offsets = {
          {
            filetype = "neo-tree",
            text = "",
            highlight = "Directory",
            text_align = "left",
            padding = 0,
          },
        },
        groups = {
          options = {
            toggle_hidden_on_enter = true,
          },
          items = {
            -- 1. UNGROUPED - First visible
            groups.builtin.ungrouped,

            -- 2. DEX (Cyan)
            {
              name = "DEX",
              highlight = { fg = "#5ef1ff" },
              auto_close = false,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                local is_in_dex_module = bufname:match "x/dex/.*%.go$"
                local is_in_dex_proto = bufname:match "proto/dex/.*%.proto$"
                return is_in_dex_module or is_in_dex_proto
              end,
            },

            {
              name = "DID",
              highlight = { fg = "#5ef1ff" },
              auto_close = false,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                local is_in_dex_module = bufname:match "x/did/.*%.go$"
                local is_in_dex_proto = bufname:match "proto/did/.*%.proto$"
                return is_in_dex_module or is_in_dex_proto
              end,
            },

            {
              name = "DWN",
              highlight = { fg = "#5ef1ff" },
              auto_close = false,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                local is_in_dex_module = bufname:match "x/dwn/.*%.go$"
                local is_in_dex_proto = bufname:match "proto/dwn/.*%.proto$"
                return is_in_dex_module or is_in_dex_proto
              end,
            },
            {
              name = "SVC",
              highlight = { fg = "#5ef1ff" },
              auto_close = false,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                local is_in_dex_module = bufname:match "x/svc/.*%.go$"
                local is_in_dex_proto = bufname:match "proto/svc/.*%.proto$"
                return is_in_dex_module or is_in_dex_proto
              end,
            },

            -- 3. Tests (Pink)
            {
              name = "Tests",
              highlight = { fg = "#ff5ea0" },
              auto_close = false,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                return bufname:match "_integration%.go$" or bufname:match "_test%.go$" or bufname:match "/test/"
              end,
            },

            -- 4. Actions (Magenta)
            {
              name = "Actions",
              highlight = { fg = "#ff5ef1" },
              auto_close = true,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                return bufname:match "%.ya?ml$" and bufname:match "%.github/"
              end,
            },
            -- 5. Claude (Yellow)
            {
              name = "Claude",
              highlight = { fg = "#ffbd5e" },
              auto_close = true,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                return bufname:match "%.claude/"
              end,
            },
            -- 7. Docs (White) - Auto close
            {
              name = "Docs",
              highlight = { fg = "#ffffff" },
              auto_close = true,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                return bufname:match "%.mdx$" or bufname:match "/docs/"
              end,
            },
            {
              name = "Config",
              highlight = { fg = "#3c4048" },
              auto_close = true,
              matcher = function(buf)
                local bufname = vim.api.nvim_buf_get_name(buf.id)
                -- Exclude .github/ yml files (they go to Actions)
                return (bufname:match "%.ya?ml$" and not bufname:match "%.github/")
                  or bufname:match "%.json$"
                  or bufname:match "%.sh$"
              end,
            },
          },
        },
      },
      highlights = {
        -- Group label styling
        group_label = {
          fg = "#ffffff", -- Bright white for better visibility
          bg = "#423f5a", -- Darker background for contrast (same as background)
          bold = true,
        },
        group_separator = {
          fg = "#585b70", -- Slightly brighter separator
        },
        -- Buffer styling within groups
        buffer_selected = {
          fg = "#89dceb",
          bold = true,
          italic = false,
        },
        buffer_visible = {
          fg = "#585b70",
        },
        background = {
          fg = "#585b70",
        },
        -- Diagnostic styling
        hint = {
          fg = "#94e2d5",
        },
        hint_selected = {
          fg = "#94e2d5",
          bold = true,
        },
        warning = {
          fg = "#f9e2af",
        },
        warning_selected = {
          fg = "#f9e2af",
          bold = true,
        },
        error = {
          fg = "#f38ba8",
        },
        error_selected = {
          fg = "#f38ba8",
          bold = true,
        },
      },
    }
  end,
}
