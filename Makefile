CWD=`pwd`

build:
	@cp -r src/images dist
	@jake
	
test:
	# node test/db.js

.PHONY: test