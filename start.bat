@echo off
title alibot-mc
cls
echo Updating...
echo Update Log > update.log
git pull >> update.log
cls
node "%~dp0"