#!/bin/bash

# 変数
SYMBOLIC_LINK=/home/node_package/gulp-boiler/node_modules
LOCAL_PATH=${WORKSPACE}/dist/
SRC_PATH=${WORKSPACE}/src/
DEPLOY_BRANCH_NAME=delivery

# commit message
COMMIT_ID="$(git rev-parse HEAD)"
COMMIT_MSG="$(git log -1 --pretty=%B --oneline)"

echo $COMMIT_MSG

# build
if test -d $SRC_PATH ; then
  # 指定領域のnode_modulesにシンボリックリンクを張る
  if test -d node_modules ; then
    echo -e "\n\n*** node_module is exist ***"
  else
    ln -s $SYMBOLIC_LINK
  fi

  source ~/.nvm/nvm.sh
  nvm use v4.2

  # build
  echo -e "\n\n*** build ***"
  gulp build
  echo -e "*** build done ***\n\n"
else
  # error
  echo -e "\n\n*** build 対象が存在しません ***\n\n"
  break
fi

# checkout
git checkout $DEPLOY_BRANCH_NAME
git pull --rebase origin

# WSから dist/ と .git/ 以外を削除
if test -d ${WORKSPACE} ; then
ls -A | grep -v "dist" | grep -v ".git" | xargs rm -rf | rm -rf .gitignore | rm -rf bin
fi

# distディレクトリをroot展開
cp -r dist/* .
rm -rf dist

if [ -z "$(git status --porcelain)" ]; then
  echo -e "\n*** commitすべき差分が存在しません ***\n\n"
else
  git add -A
  git commit -m "delivery branch : $COMMIT_ID"
  git push origin $DEPLOY_BRANCH_NAME
fi