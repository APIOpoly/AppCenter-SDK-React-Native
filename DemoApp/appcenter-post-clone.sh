#!/usr/bin/env bash
echo "Executing post clone script in `pwd`"
echo $NPM_RC | base64 --decode > $APPCENTER_SOURCE_DIRECTORY/.npmrc
echo $GOOGLE_SERVICES_JSON | base64 --decode > $APPCENTER_SOURCE_DIRECTORY/DemoApp/android/app/google-services.json
