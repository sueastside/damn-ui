if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  echo -e "Starting to update gh-pages\n"

  #generate and copy data we're interested in to other place
  cd docs/
  make html
  echo "Copying html to " $HOME
  cp -R _build/html $HOME/html_gen
  echo "==============================="
  ls -la $HOME/html_gen
  echo "==============================="
  ls -la .
  echo "==============================="

  #go to home and setup git
  cd $HOME
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis"

  #using token clone gh-pages branch
  git clone --quiet --branch=gh-pages https://${GH_TOKEN}@github.com/sueastside/damn-at.git  gh-pages > /dev/null

  #go into directory and copy data we're interested in to that directory
  cd gh-pages
  cp -Rf $HOME/html_gen/* .
  
  echo "==============================="
  ls -la .
  echo "==============================="

  #add, commit and push files
  git add -f .
  git commit -m "Travis build $TRAVIS_BUILD_NUMBER pushed to gh-pages"
  git push -fq origin gh-pages > /dev/null

  echo -e "Done updating gh-pages\n"
fi
