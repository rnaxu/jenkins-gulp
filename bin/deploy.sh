#!/bin/bash


# 変数
SYMBOLIC_LINK=/home/node_package/gulp-boiler/node_modules
LOCAL_PATH=${WORKSPACE}/dist/
SRC_PATH=${WORKSPACE}/src/
BRANCH_PATH=delivery


# 指定領域のnode_modulesにシンボリックリンクを張る
if test -d node_modules ; then
  echo "node_module is exist."
else
  ln -s $SYMBOLIC_LINK
fi


# build
if test -d $SRC_PATH ; then
  echo -e "\n\n*** content build ***"
  gulp
  echo -e "*** content build done ***\n\n"
else
  echo -e "\n\n*** content buildが実行できませんでした ***\n\n"
  exit
fi


# .gitとdist以外削除
ls -A | grep -v ".git" | grep -v "dist" | xargs rm -rf | rm -rf .gitignore


# checkout
git checkout $BRANCH_PATH
git branch


# distの中身を展開
cp -r dist/* .
rm -rf dist

# git push
git add -A
git commit -m "build dist for delivery"
git push origin $BRANCH_PATH