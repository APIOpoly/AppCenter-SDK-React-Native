#!/bin/bash
echo 'Copy Java/JS changes made inside node_modules to git...'
cd `dirname $0`
for i in '' '-analytics' '-crashes' '-push'
do
    for j in '*.js' 'android' 'ios'
    do
        rsync -r node_modules/mobile-center$i/$j ../mobile-center$i  
    done
done