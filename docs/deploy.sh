#!/usr/bin/env sh

# abort on errors
set -e

# build commands
npm run build

# navigate into the build output directory
cd src/.vuepress/dist

git init
git add -A
git commit -m "deploy with vuepress script"
git push -f https://github.com/Parkjju/vue-TIL.git master:gh-pages
# 작업 환경따라서 main-master 변경하기
# git push -f https://github.com/Parkjju/vue-TIL.git main:gh-pages

cd -