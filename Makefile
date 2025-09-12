
all: install build

install:
	@cd extensions/omarchy && npm install
	@echo "Done!"

build:
	@cd extensions/omarchy && npm run build
	@echo "Done!"

dev:
	@cd extensions/omarchy && npm run dev
	@echo "Done!"
