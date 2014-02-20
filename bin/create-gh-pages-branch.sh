git checkout --orphan gh-pages
git rm -rf .
echo "Test" > index.html
touch .nojekyll
git add .
git commit -m "Initial commit to gh-pages"
#git push origin :gh-pages
git push origin gh-pages
