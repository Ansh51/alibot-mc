@echo off
title alibot-mc
cls
echo Updating...
echo Update Log > update.log
echo NPM Log > npm.log
git pull >> update.log
npm i >> npm.log
cls
node "%~dp0"