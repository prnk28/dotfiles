
all: install build

install:
	@cd dot_extensions/omarchy && npm install
	@echo "Done!"

build:
	@cd dot_extensions/omarchy && npm run build
	@echo "Done!"

dev:
	@cd dot_extensions/omarchy && npm run dev
	@echo "Done!"
