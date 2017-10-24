const ReactNative = require('react-native');
const RNPush = require('react-native').NativeModules.RNPush;

const pushNotificationReceivedEvent = 'MobileCenterPushNotificationReceived';


const Push = {
    // async - returns a Promise
    setEnabled(enabled) {
        return RNPush.setEnabled(enabled);
    },

    // async - returns a Promise
    isEnabled() {
        return RNPush.isEnabled();
    },

    // async - returns a Promise
    setListener(listenerMap) {
        ReactNative.DeviceEventEmitter.removeAllListeners(pushNotificationReceivedEvent);
        if (listenerMap && listenerMap.onPushNotificationReceived) {
            ReactNative.DeviceEventEmitter.addListener(pushNotificationReceivedEvent, listenerMap.onPushNotificationReceived);

            return RNPush.sendAndClearInitialNotification();
        }
        return Promise.resolve();
    }
};

module.exports = Push;
