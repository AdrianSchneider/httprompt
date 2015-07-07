PROJECT = "httprompt"

test: ;@echo "Unit Testing ${PROJECT}"; \
    node_modules/.bin/mocha tests --recursive -R dot;

coverage: ;@echo "Making Coverage for ${PROJECT}"; \
		istanbul cover -x src/app/commands/index.js -x src/bootstrap.js --include-all-sources ./node_modules/mocha/bin/_mocha tests -- --recursive -R spec;

.PHONY: test coverage
