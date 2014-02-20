if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo -e "Starting to update gh-pages\n"
  
  echo "==============================="
  ls -la
  echo "==============================="
  
  #clean and build
  rm -rf dist/
  mkdir dist/
  grunt build
  
  cd dist/
  git init

  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis"
  
  touch .nojekyll
  cp ../README.md README.md
  git add .
  git commit -m "Deployed to Github Pages"
  git push --force --quiet "https://${GH_TOKEN}@github.com/sueastside/damn.git" master:gh-pages > /dev/null 2>&1
  
  echo "==============================="
  ls -la
  echo "==============================="
  
  echo -e "Done updating gh-pages\n"
fi
