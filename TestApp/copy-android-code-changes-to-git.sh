#!/bin/bash
echo 'Copy Java changes made inside node_modules to git...'
for i in '' '-analytics' '-crashes' '-push'
do
   rsync -r node_modules/mobile-center$i/android ../mobile-center$i
done
