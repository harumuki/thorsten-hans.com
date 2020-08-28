PROJECT_DIR=$(shell pwd)
.PHONY: run run-non-future

run: 
	$(shell mkdir -p $(PROJECT_DIR)/vendor/bundle)
	docker run -v $(PROJECT_DIR)/vendor/bundle:/usr/local/bundle -v $(PROJECT_DIR):/srv/jekyll -p 4000:4000 jekyll/jekyll:4.1.0 jekyll serve --watch --future

run-non-future:
	$(shell mkdir -p $(PROJECT_DIR)/vendor/bundle)
	docker run -v $(PROJECT_DIR)/vendor/bundle:/usr/local/bundle -v $(PROJECT_DIR):/srv/jekyll -p 4000:4000 jekyll/jekyll:4.1.0 jekyll serve --watch
default: run
