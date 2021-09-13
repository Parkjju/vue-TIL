#!/usr/bin/env sh

# abort on errors
set -e

# build commands
yarn build

# navigate into the build output directory
cd src/.vuepress/dist

git init
git add -A
git commit -m 'deploy with vuepress script'
git push -f https://github.com/Parkjju/vue-TIL.git main:gh-pages
# git push -f https://github.com/Parkjju/vuepressBlog.git/ main:gh-pages

cd -