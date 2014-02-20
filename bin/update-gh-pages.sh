if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo -e "Starting to update gh-pages\n"

  #clean and build
  rm -rf dist/
  mkdir dist/
  grunt build
  
  cd build/
  git init
  git config user.name "Travis"
  git config user.email "travis@travis-ci.org"
  
  touch .nojekyll
  git add .
  git commit -m "Deployed to Github Pages"
  git push --force --quiet "https://${GH_TOKEN}@github.com/sueastside/damn.git" master:gh-pages > /dev/null 2>&1
fi
