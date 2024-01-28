build_hugo:
	hugo --minify

deploy:
	aws s3 sync ./public s3://blog-kernelanxiety --delete --profile ${USER_AWS_PROFILE}
	aws cloudfront create-invalidation --distribution-id ${{ secrets.DISTRIBUTION_ID }} --paths "/*" --profile ${USER_AWS_PROFILE}

build_scripts:
	cd scripts && npm install

download_images: build_scripts
	node scripts/index.js -d ./content

.PHONY: build_scripts download_images build_hugo