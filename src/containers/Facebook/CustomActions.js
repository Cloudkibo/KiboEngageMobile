import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert
} from 'react-native';

import CameraRollPicker from 'react-native-camera-roll-picker';
import ImagePicker from 'react-native-image-picker';
const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';
var ReactNative = require('react-native');

export default class CustomActions extends React.Component {
  constructor(props) {
    super(props);
   
    
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.selectFileTapped = this.selectFileTapped.bind(this);
  }

  
   selectPhotoTapped() {
    console.log('selectPhotoTapped called');
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

         var images = [];
         images.push({
              image: response.uri,
            })
         
         
        setTimeout( () => {
                this.props.onSend(images,response.fileSize);
        },1000);
      }
    });
  }


   selectFileTapped() {
    console.log('selectFileTapped called');
    
    if(ReactNative.Platform.OS == "android"){
       DocumentPicker.show({
      filetype:['*/*']
    },(error,url) => {
     // Alert(url);
      console.log(url);
    }); 
    }
    else if(ReactNative.Platform.OS == "ios")
    DocumentPicker.show({
         filetype: ['public.image','com.adobe.pdf','com.microsoft.word.doc','com.microsoft.excel.xls','com.microsoft.powerpoint.​ppt'],
    },(error,url) => {
     // Alert(url);
      console.log(url);
    });
  }

  
  renderIcon() {
    if (this.props.icon) {
      return this.props.icon();
    }
    return (
      <View
        style={[styles.wrapper, this.props.wrapperStyle]}
      >
        <Text
          style={[styles.iconText, this.props.iconTextStyle]}
        >
          +
        </Text>

      </View>
    );
  }

  render() {
    return (
      <View style={{flexDirection:'row',flex:1}}>
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.selectPhotoTapped}
      >
       
        {this.renderIcon()}
      </TouchableOpacity>



     <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.selectFileTapped}
      >
       
        {this.renderIcon()}
      </TouchableOpacity>
     <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.selectPhotoTapped}
      >
       
        {this.renderIcon()}
      </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: React.PropTypes.func,
};

CustomActions.defaultProps = {
  onSend: () => {},
  options: {},
  icon: null,
  containerStyle: {},
  wrapperStyle: {},
  iconTextStyle: {},
};

CustomActions.propTypes = {
  onSend: React.PropTypes.func,
  options: React.PropTypes.object,
  icon: React.PropTypes.func,
  containerStyle: View.propTypes.style,
  wrapperStyle: View.propTypes.style,
  iconTextStyle: Text.propTypes.style,
};
