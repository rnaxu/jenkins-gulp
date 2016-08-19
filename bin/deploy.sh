#!/bin/bash

# 変数
SYMBOLIC_LINK=/home/node_package/gulp-boiler/node_modules
LOCAL_PATH=${WORKSPACE}/dist/
SRC_PATH=${WORKSPACE}/src/
DEPLOY_BRANCH_NAME=delivery

# commit message
COMMIT_ID="$(git rev-parse HEAD)"
COMMIT_MSG="$(git log -1 --pretty=%B --oneline)"

# PATTERN="#([0-9]+)"

echo $COMMIT_MSG

# issueとcommitを紐づけるため、commitメッセージにissue番号が含まれているか確認
# if [[ "$COMMIT_MSG" =~ $PATTERN ]]; then
#   echo "$COMMIT_MSG"
#   NUM="$(echo $COMMIT_MSG | cut -d"'" -f2 | cut -d"'" -f1 | cut -d"-" -f2)"
#   echo "$NUM NUM"
# else
#   echo "$COMMIT_MSG is invalid!"
#   exit 1
# fi
#
# ISSUE_NUM="#$NUM"

# build
if test -d $SRC_PATH ; then
  # 指定領域のnode_modulesにシンボリックリンクを張る
  if test -d node_modules ; then
    echo -e "\n\n*** node_module is exist ***"
  else
    ln -s $SYMBOLIC_LINK
  fi

  # build
  echo -e "\n\n*** build ***"
  gulp
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
# if test -d ${WORKSPACE} ; then
ls -A | grep -v "dist" | grep -v ".git" | xargs rm -rf | rm -rf .gitignore | rm -rf bin
# fi

# distディレクトリをroot展開
cp -r dist/* .
rm -rf dist

if [ -z "$(git status --porcelain)" ]; then
  echo -e "\n*** commitすべき差分が存在しません ***\n\n"
else
  git add -A
  git commit -m "build from : $COMMIT_MSG"
  git push origin $DEPLOY_BRANCH_NAME
fi