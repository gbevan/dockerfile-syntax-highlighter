#!/bin/bash

# build lexer
node node_modules/.bin/jacob -t Dockerfile.jacoblex -l dockerlex.js

# create Brackets zip packages
rm -f ../dockerfile-syntax-highlighter.zip
zip -r ../dockerfile-syntax-highlighter.zip . -x .git/\* screenshots/\* node_modules/\* tests/\* .gitignore build.sh
