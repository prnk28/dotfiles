return {
	black = 0xff16181a, -- Updated to match cyberdream black
	white = 0xffffffff, -- Updated to match cyberdream white
	red = 0xffff6e5e, -- Updated to match cyberdream red
	green = 0xff5eff6c, -- Updated to match cyberdream green
	blue = 0xff5ea1ff, -- Updated to match cyberdream blue
	yellow = 0xfff1ff5e, -- Updated to match cyberdream yellow
	orange = 0xffffbd5e, -- Updated from cyberdream indexed color 16
	magenta = 0xffbd5eff, -- Updated to match cyberdream magenta
	cyan = 0xff5ef1ff, -- Added cyan from cyberdream
	grey = 0xff3c4048, -- Updated to match cyberdream bright black
	transparent = 0x00000000,

	bar = {
		bg = 0xf016181a, -- Updated to match cyberdream background
		border = 0xff16181a, -- Updated to match cyberdream background
	},
	popup = {
		bg = 0xc016181a, -- Updated to match cyberdream background
		border = 0xff3c4048, -- Updated to match cyberdream bright black
	},
	bg1 = 0xff3c4048, -- Updated to match cyberdream bright black
	bg2 = 0xff4a4e58, -- Slightly lighter than bg1 for contrast

	with_alpha = function(color, alpha)
		if alpha > 1.0 or alpha < 0.0 then
			return color
		end
		return (color & 0x00ffffff) | (math.floor(alpha * 255.0) << 24)
	end,
}
