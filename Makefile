build_hugo:
	hugo --minify

build_scripts:
	cd scripts && npm install

download_images: build_scripts
	node scripts/index.js -d ./content

.PHONY: build_scripts download_images build_hugo