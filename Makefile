PROJECT = "httprompt"

test: ;@echo "Unit Testing ${PROJECT}"; \
    node_modules/.bin/mocha tests --recursive -R dot;

.PHONY: test
