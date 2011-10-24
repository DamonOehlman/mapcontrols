CWD=`pwd`

build:
	@cp -r src/images dist
	@node build
	
test:
	# node test/db.js

.PHONY: test