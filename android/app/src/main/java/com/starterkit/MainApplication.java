package com.starterkit;

import android.app.Application;

import com.azure.reactnative.notificationhub.ReactNativeNotificationHubPackage;
import com.facebook.react.ReactApplication;
import com.zmxv.RNSound.RNSoundPackage;
import com.reactnativeandroidmediaplayer.mediaplayer.MediaPlayerPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.brentvatne.react.ReactVideoPackage;
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

import com.rngrp.RNGRPPackage; // <------- add package
import com.filepicker.FilePickerPackage; // import package
import com.audioStreaming.ReactNativeAudioStreamingPackage;

//import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSoundPackage(),
            new MediaPlayerPackage(),
            new RNFetchBlobPackage(),
            new ImagePickerPackage(),
            new ReactNativeDocumentPicker(),
            new ReactNativeNotificationHubPackage(),
            new SQLitePluginPackage(),

            new RNGRPPackage() ,
            new FilePickerPackage(),
            new ReactVideoPackage(),
            new ReactNativeAudioStreamingPackage()
  
          
        
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
