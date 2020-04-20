PROJECT_DIR=$(shell pwd)

.PHONY: run 

run: 
	docker run -v $(PROJECT_DIR)/vendor/bundle:/usr/local/bundle -v $(PROJECT_DIR):/srv/jekyll -p 4000:4000 jekyll/jekyll:4.0.0 jekyll serve --watch --future

default: run
