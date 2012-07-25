CWD=`pwd`

build:
	@mkdir -p dist/images
	@cp -r src/images/ dist/images/
	@jake

test:
	# node test/db.js

.PHONY: test