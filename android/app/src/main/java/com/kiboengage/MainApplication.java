package com.kiboengage;

import android.app.Application;

import com.azure.reactnative.notificationhub.ReactNativeNotificationHubPackage;
import com.facebook.react.ReactApplication;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.bugsnag.BugsnagReactNative;
import com.microsoft.codepush.react.CodePush;
import com.zmxv.RNSound.RNSoundPackage;
import com.imagepicker.ImagePickerPackage;
//import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
//import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.microsoft.codepush.react.CodePush;
//import cl.json.RNSharePackage;
//import com.BV.LinearGradient.LinearGradientPackage;
//import com.oblador.vectoricons.VectorIconsPackage;
//import com.reactnative.photoview.PhotoViewPackage;
//import cl.json.RNSharePackage;
//import com.BV.LinearGradient.LinearGradientPackage;
//import com.oblador.vectoricons.VectorIconsPackage;
//import com.brentvatne.react.ReactVideoPackage;
//import com.microsoft.codepush.react.CodePush;
//import com.zmxv.RNSound.RNSoundPackage;
//import com.reactnativeandroidmediaplayer.mediaplayer.MediaPlayerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
//import com.imagepicker.ImagePickerPackage;
//import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
//import com.oblador.vectoricons.VectorIconsPackage;
//import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
//import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
//import com.learnium.RNDeviceInfo.RNDeviceInfo;
import java.util.Arrays;
import java.util.List;

import org.pgsqlite.SQLitePluginPackage;

//import com.rngrp.RNGRPPackage; // <------- add package
import com.filepicker.FilePickerPackage; // import package
///import com.audioStreaming.ReactNativeAudioStreamingPackage;

//import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new GoogleAnalyticsBridgePackage(),
            new RNDeviceInfo(),
            BugsnagReactNative.getPackage(),
           // new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
            new RNSoundPackage(),
            new ImagePickerPackage(),
            //new GoogleAnalyticsBridgePackage(),
            new RNFetchBlobPackage(),
            new ReactNativeDocumentPicker(),
            //new RNDeviceInfo(),
           // new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
           // new RNSharePackage(),
           // new LinearGradientPackage(),
           // new VectorIconsPackage(),
           // new PhotoViewPackage(),
           // new RNSharePackage(),
           // new LinearGradientPackage(),
           // new VectorIconsPackage(),
           // new ReactVideoPackage(),
            new CodePush("wjqmL8L7u3UrsmpIQPYm--N74H5I4klroPZkQ", MainApplication.this, BuildConfig.DEBUG),
          //  new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
           // new RNSoundPackage(),
           // new MediaPlayerPackage(),
            //new RNFetchBlobPackage(),
            //new ImagePickerPackage(),
            //new ReactNativeDocumentPicker(),
            new ReactNativeNotificationHubPackage(),
            new SQLitePluginPackage(),
            new FilePickerPackage()

            //new RNGRPPackage(),
           // new ReactNativeAudioStreamingPackage()
  
          
        
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
