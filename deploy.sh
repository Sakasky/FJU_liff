#!/usr/bin/env sh
# abort on errors
set -e
# build
npm run build
# navigate into the build output directory
cd dist
# if you are deploying to a custom domain
echo 'fjuh.one' > CNAME
git init
git add -A
git commit -m 'deploy'
# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:billxu0521/billxu0521.github.io.git main
# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:billxu0521/FJU_liff.git main:gh-pages
cd -
