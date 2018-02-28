const rnpmlink = require('appcenter-link-scripts');
const inquirer = require('inquirer');

return rnpmlink.ios.checkIfAppDelegateExists()
    .then(() => rnpmlink.ios.initAppCenterConfig().catch((e) => {
        console.log(`Could not create or update AppCenter config file (AppCenter-Config.plist). Error Reason - ${e.message}`);
        return Promise.reject();
    }))
    .then(() => {
        return inquirer.prompt([{
            type: 'list',
            name: 'whenToSendCrashes',
            message: 'For the Android app, should crashes be sent automatically or processed in JavaScript before being sent?',
            choices: [
                {
                    name: 'Automatically',
                    value: 'ALWAYS_SEND'
                },
                {
                    name: 'Processed in JavaScript by user',
                    value: 'ASK_JAVASCRIPT'
                }]
        }]).catch((e) => {
            console.log(`Could not determine when to enable AppCenter crashes. Error Reason - ${e.message}`);
            return Promise.reject();
        });
    })
    .then((androidAnswer) => {
        rnpmlink.android.patchStrings('appCenterCrashes_whenToSendCrashes',
            androidAnswer.whenToSendCrashes);
        return inquirer.prompt([{
            type: 'list',
            name: 'whenToSendCrashes',
            message: 'For the iOS app, should crashes be sent automatically or processed in JavaScript before being sent?',
            choices: [
                {
                    name: 'Automatically',
                    value: 'ALWAYS_SEND'
                },
                {
                    name: 'Processed in JavaScript by user',
                    value: 'ASK_JAVASCRIPT'
                }]
        }]).catch((e) => {
            console.log(`Could not determine when to enable AppCenter crashes. Error Reason - ${e.message}`);
            return Promise.reject();
        });
    })
    .then((iosAnswer) => {
        const code = iosAnswer.whenToSendCrashes === 'ALWAYS_SEND' ?
            '  [AppCenterReactNativeCrashes registerWithAutomaticProcessing];  // Initialize AppCenter crashes' :
            '  [AppCenterReactNativeCrashes register];  // Initialize AppCenter crashes';
        return rnpmlink.ios.initInAppDelegate('#import <AppCenterReactNativeCrashes/AppCenterReactNativeCrashes.h>', code, /.*\[AppCenterReactNativeCrashes register.*/g)
            .catch((e) => {
                console.log(`Could not initialize AppCenter crashes in AppDelegate. Error Reason - ${e.message}`);
                return Promise.reject();
            });
    })
    .then((file) => {
        console.log(`Added code to initialize iOS Crashes SDK in ${file}`);
        return rnpmlink.ios.addPodDeps(
            [
                { pod: 'AppCenter/Crashes', version: '1.4.0' },
                { pod: 'AppCenterReactNativeShared', version: '1.3.0' } // in case people don't link appcenter (core)
            ],
            { platform: 'ios', version: '9.0' }
        ).catch((e) => {
            console.log(`
            Could not install dependencies using CocoaPods.
            Please refer to the documentation to install dependencies manually.

            Error Reason - ${e.message}
        `);
            return Promise.reject();
        });
    })
    .catch(() => Promise.resolve());
