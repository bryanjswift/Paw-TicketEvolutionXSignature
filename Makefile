IDENTIFIER=com.bryanjswift.PawExtensions.XSignature
# Target for installation
INSTALL_DIR=$(HOME)/Library/Containers/com.luckymarmot.Paw/Data/Library/Application Support/com.luckymarmot.Paw/Extensions/$(IDENTIFIER)
# Source directories
SRC_DIR=./src
# Source files
SRC := $(shell find $(SRC_DIR) -regex '.*\.ts' -not -name '*.d.ts')
## Find `package.json` files everywhere except `node_modules`
PACKAGE_JSON := $(shell find . -depth 3 -name 'package.json' -and -not -path './node_modules/*') package.json
# Output files
## Replace file suffixes keeping src path
SRC_OUT := $(SRC:.ts=.js)
# Output directories
OUT_DIR=./dist
## Replace src path with out path
OUT := $(subst $(SRC_DIR), $(OUT_DIR), $(SRC_OUT))
## Bundle files
SRC_BUNDLE := $(OUT) $(OUT_DIR)/README.md $(OUT_DIR)/LICENSE

.PHONY: build bundle clean install test archive

build: $(OUT)

bundle: $(SRC_BUNDLE)

clean:
	rm -Rf ./dist/

node_modules: $(PACKAGE_JSON) package-lock.json
	npm install
	@touch -mr $(shell ls -Atd $? | head -1) $@

$(OUT): node_modules $(SRC)
	@# Remove files from `ERRORS_OUT` that don't correspond to source files
	@rm -rf $(filter-out $(OUT), $(wildcard $(OUT_DIR)/*.* $(OUT_DIR)/*/*.*))
	npm run build

$(OUT_DIR)/README.md:
	cp README.md $(OUT_DIR)/

$(OUT_DIR)/LICENSE:
	cp LICENSE $(OUT_DIR)/

install: bundle
	@mkdir -p "$(INSTALL_DIR)/"
	cp -r ./dist/* "$(INSTALL_DIR)/"

test:
	npm test

XSignature.zip: $(SRC_BUNDLE)
	mv $(OUT_DIR) $(IDENTIFIER)
	zip -r XSignature.zip "$(IDENTIFIER)/"
	mv $(IDENTIFIER) $(OUT_DIR)

archive: XSignature.zip

print-%:
	@echo '$*=$($*)'

