import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import CameraRollPicker from 'react-native-camera-roll-picker';
import ImagePicker from 'react-native-image-picker';
const DocumentPicker = require('react-native').NativeModules.RNDocumentPicker;
import NavBar, { NavButton, NavButtonText, NavTitle } from 'react-native-nav';

import * as FbActions from '@redux/facebook/FbActions';
import { List, ListItem, SocialIcon, Card, Button, Icon } from 'react-native-elements';
var ReactNative = require('react-native');

class CustomActions extends React.Component {
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
              data:response.data,
            })
         
         
        setTimeout( () => {
                console.log('setTimeout called');
                if(response.uri!= ''){
                     this.props.onSend(images,response.fileSize);
              }
        },5000);
      }
    });
  }


   selectFileTapped() {
    console.log('selectFileTapped called');
    
    if(ReactNative.Platform.OS == "android"){

      const FilePickerManager = require('NativeModules').FilePickerManager;

      FilePickerManager.showFilePicker(null, (response) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled file picker');
  }
  else if (response.error) {
    console.log('FilePickerManager Error: ', response.error);
  }
  else {
      // console.log("Success", response);
           var files = [];
           var fileName = response.path.split("/");
           fileName = fileName[fileName.length - 1];
         files.push({
              file: {
                filename:fileName,
                uri:response.path.split("/").slice(0,-1).join("/")
            }});
             console.log(files);
         this.props.onSend(files);
  }
});


    //    DocumentPicker.show({
    //   filetype:['*/*']
    // },(error,url) => {
    //  // Alert(url);
    //   console.log(url);

    //    var files = [];
    //      files.push({
    //           file: {
    //             filename:url.fileName,
    //             uri:url.uri
    //         }})

    //       setTimeout( () => {
    //             console.log('setTimeout called');
    //             if(url!= ''){
    //                  this.props.onSend(files);
    //           }
    //     },5000);
    // }); 
    }
    else if(ReactNative.Platform.OS == "ios")
    DocumentPicker.show({
         filetype: ['public.image','com.adobe.pdf','com.microsoft.word.doc','com.microsoft.excel.xls','com.microsoft.powerpoint.​ppt'],
    },(error,url) => {
     // Alert(url);
      console.log(url);
       var files = [];
         files.push({
              file: url.uri,
            })
          setTimeout( () => {
                console.log('setTimeout called');
                if(url!= ''){
                     this.props.onSend(files);
              }
        },5000);
         
       
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
       
        <Icon name='photo' color="#444d56" size={26} />
      </TouchableOpacity>



     <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={this.selectFileTapped}
      >
       
         <Icon
          name='paperclip'
          type='font-awesome'
          color='#444d56;'
          size={26}
        />
      </TouchableOpacity>
     
      <TouchableOpacity
        style={{paddingLeft:3}}
        onPress={() => { this.props.toggleEmoji(!this.props.emojiVisible)}}
      >
       
        <Icon
          name='smile-o'
          type='font-awesome'
          color='#444d56'
          size={26}
        />
      </TouchableOpacity>
       <TouchableOpacity
        style={{paddingLeft:3}}
    onPress={() => { this.props.toggleGif(!this.props.gifVisible); this.props.gifFetch()}}
      >
       
        <Icon
          name='gif'
         
          color='#444d56'
          size={26}
        />
      </TouchableOpacity>

       <TouchableOpacity
        style={{paddingLeft:3}}
    onPress={() => { this.props.toggleSticker(!this.props.stickerVisible); this.props.stickerFetch()}}
      >
       
        <Icon
          name='certificate'
          type='font-awesome'
          color='#d35400'
          size={26}
        />
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


const mapDispatchToProps = {

  toggleEmoji:FbActions.emojiToggle,
  toggleGif:FbActions.gifToggle,
  gifFetch:FbActions.fetchGif,
  toggleSticker:FbActions.stickerToggle,
  stickerFetch:FbActions.fetchSticker,
};
function mapStateToProps(state) {
  const { emojiVisible, gifVisible, stickerVisible } = state.fbpages;
  return { emojiVisible, gifVisible, stickerVisible };
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomActions);
