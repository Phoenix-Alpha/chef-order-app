# README #

Ionic Cordova Keyboard Plugin

Black bar issue
```
private int computeUsableHeight() {
    Rect r = new Rect();
    mChildOfContent.getWindowVisibleDisplayFrame(r);
    // return (r.bottom - r.top);
    if ( checkStatusBarTransparent() ) return r.bottom;
    return r.height();
}

private boolean checkStatusBarTransparent() {
    final Window window = cordova.getActivity().getWindow();
    return ( window.getStatusBarColor() == Color.TRANSPARENT
            || window.getDecorView().getSystemUiVisibility() == View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN );
}
```

Navigation bar issue

```
<preference name="resizeOnFullScreen" value="true" />
```

```
private void possiblyResizeChildOfContent() {
    int usableHeightNow = computeUsableHeight();
    if (usableHeightNow != usableHeightPrevious) {
        // int usableHeightSansKeyboard = mChildOfContent.getRootView().getHeight();
        // int heightDifference = usableHeightSansKeyboard - usableHeightNow;
        // if (heightDifference > (usableHeightSansKeyboard/4)) {
        //     frameLayoutParams.height = usableHeightSansKeyboard - heightDifference;
        // } else {
        //     frameLayoutParams.height = usableHeightSansKeyboard;
        // }
        frameLayoutParams.height = usableHeightNow;
        mChildOfContent.requestLayout();
        usableHeightPrevious = usableHeightNow;
    }
}
```

Generate resources
```
cordova-res ios --skip-config --copy
cordova-res android --skip-config --copy

cordova-res android --type=adaptive-icon

```

Deeplink plugin install

Cordova
```
$ ionic cordova plugin add ionic-plugin-deeplinks@1.0.20 --variable URL_SCHEME=com.halalhomemade.app --variable DEEPLINK_HOST=google.com --variable DEEPLINK_2_HOST=facebook.com --variable DEEPLINK_3_HOST=stripe.com
```

Capacitor
```
npm install ionic-plugin-deeplinks@1.0.20
```

AndroidManifest.xml
```
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="com.halalhomemade.app" />
</intent-filter>
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:host="google.com" android:scheme="https" android:pathPrefix="/"/>
    <data android:host="facebook.com" android:scheme="https" android:pathPrefix="/"/>
    <data android:host="stripe.com" android:scheme="https" android:pathPrefix="/"/>
</intent-filter>
```

Run the project
```
ionic build && npx cap sync android && ionic cap run android -l --external --target=Pixel_4_API_30 --public-host=192.168.107.225
```

android:usesCleartextTraffic="true"


Capacitor Stripe plugin

Android
```
package com.halalhomemade.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(com.getcapacitor.community.stripe.StripePlugin.class);        
    }
}
```

```
<?xml version='1.0' encoding='utf-8'?>
<manifest package="com.halalhomemade.app" xmlns:android="http://schemas.android.com/apk/res/android">
    <application android:allowBackup="true" android:icon="@mipmap/ic_launcher" android:label="@string/app_name" android:roundIcon="@mipmap/ic_launcher_round" android:supportsRtl="true" android:theme="@style/AppTheme" android:usesCleartextTraffic="true">
        <activity android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode" android:label="@string/title_activity_main" android:launchMode="singleTask" android:name="com.halalhomemade.app.MainActivity" android:theme="@style/AppTheme.NoActionBarLaunch">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="com.halalhomemade.app" />
            </intent-filter>
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:host="google.com" android:pathPrefix="/" android:scheme="https" />
                <data android:host="facebook.com" android:pathPrefix="/" android:scheme="https" />
                <data android:host="stripe.com" android:pathPrefix="/" android:scheme="https" />
            </intent-filter>
        </activity>
        <provider android:authorities="${applicationId}.fileprovider" android:exported="false" android:grantUriPermissions="true" android:name="androidx.core.content.FileProvider">
            <meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/file_paths" />
        </provider>
    </application>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-feature android:name="android.hardware.camera" android:required="true" />
</manifest>
```

android\app\build.gradle
```
try {
    def servicesJSON = file('google-services.json')
    if (servicesJSON.text) {
        apply plugin: 'com.google.gms.google-services'
    }
} catch(Exception e) {
    logger.warn("google-services.json not found, google-services plugin not applied. Push Notifications won't work")
}
```

```
ext {
    minSdkVersion = 21
    compileSdkVersion = 31
    targetSdkVersion = 30
    androidxActivityVersion = '1.2.0'
    androidxAppCompatVersion = '1.2.0'
    androidxCoordinatorLayoutVersion = '1.1.0'
    androidxCoreVersion = '1.3.2'
    androidxFragmentVersion = '1.3.0'
    junitVersion = '4.13.1'
    androidxJunitVersion = '1.1.2'
    androidxEspressoCoreVersion = '3.3.0'
    cordovaAndroidVersion = '7.0.0'
}
```