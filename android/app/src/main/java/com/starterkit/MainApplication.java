package com.starterkit;

import android.app.Application;

import com.azure.reactnative.notificationhub.ReactNativeNotificationHubPackage;
import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
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
            new ImagePickerPackage(),
            // new VectorIconsPackage(),
            // new GoogleAnalyticsBridgePackage(),
            // new RNDeviceInfo(),

            new ReactNativeDocumentPicker(),

          //  new VectorIconsPackage(),
         //   new GoogleAnalyticsBridgePackage(),
        ///    new RNDeviceInfo(),
          //  new RNDeviceInfo(),
         // new GoogleAnalyticsBridgePackage(),
            new ReactNativeNotificationHubPackage(),
            new SQLitePluginPackage()
          
        
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
