package com.microsoft.sonoma.react.analytics;

import android.app.Application;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

import com.microsoft.sonoma.react.core.RNSonomaCore;
import com.microsoft.sonoma.core.Sonoma;
import com.microsoft.sonoma.analytics.Analytics;

import org.json.JSONException;

public class RNSonomaAnalyticsModule extends ReactContextBaseJavaModule {
    public RNSonomaAnalyticsModule(Application application, ReactApplicationContext reactContext, boolean startEnabled) {
        super(reactContext);

        RNSonomaCore.initializeSonoma(application);
        Analytics.setEnabled(startEnabled);
        //Analytics.setAutoPageTrackingEnabled(false); // TODO: once the underlying SDK supports this, make sure to call this
        Sonoma.start(Analytics.class);
    }

    @Override
    public String getName() {
        return "RNSonomaAnalytics";
    }

    @ReactMethod
    public void setEnabled(boolean shouldEnable) {
        Analytics.setEnabled(shouldEnable);
    }

    @ReactMethod
    public void isEnabled(Promise promise) {
        promise.resolve(Analytics.isEnabled());
    }

    @ReactMethod
    public void trackEvent(String eventName, ReadableMap properties, Promise promise) {
        try {
            Analytics.trackEvent(eventName, RNSonomaUtils.convertReadableMapToStringMap(properties));
            promise.resolve("");
        } catch (JSONException e) {
            promise.reject(e);
        }
    }

    /*
    // TODO: once the underlying SDK supports this
    @ReactMethod
    public void trackPage(String pageName, ReadableMap properties, Promise promise) {
        try {
            Analytics.trackPage(pageName, RNSonomaUtils.convertReadableMapToStringMap(properties));
            promise.resolve("");
        } catch (JSONException e) {
            promise.reject(e);
        }
    }
    */
}