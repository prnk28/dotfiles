-- DuckDB plugin configuration
require("duckdb"):setup({
	mode = "standard", -- Default: "summarized"
	cache_size = 1000, -- Default: 500
	minmax_column_width = 21, -- Default: 21
	column_fit_factor = 10.0, -- Default: 10.0
})
