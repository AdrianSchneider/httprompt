PROJECT = "httprompt"

test: ;@echo "Unit Testing ${PROJECT}"; \
    node_modules/.bin/mocha tests --recursive;

.PHONY: test
