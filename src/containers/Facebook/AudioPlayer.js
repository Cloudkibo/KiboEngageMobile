/**
 * Coming Soon
 *
    <InviteAgent text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { PropTypes, Component } from 'react';
import { View, Slider } from 'react-native';
import axios from 'axios';
// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Text, Spacer, Alerts, } from '@ui/';
import { TextInput, Button } from 'react-native';
import { Icon, Card } from 'react-native-elements';
import auth from '../../services/auth';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as AgentActions from '@redux/agents/agentActions';
var querystring = require('querystring');
var Sound = require('react-native-sound');
import RNFetchBlob from 'react-native-fetch-blob';
var ReactNative = require('react-native');

/* Component ==================================================================== */
styles = {
  cardDescription: {
    fontStyle: 'normal',
    fontSize: 10
  }
}

var reactMixin = require('react-mixin');
import  timer  from 'react-timer-mixin';


class AudioPlayer extends Component {

  constructor(props){
    super(props);
    this.state = {
        error: '',
        length: 0,
        myValue:0,
        isPlaying: false,
        icon: 'play-circle-o'
    };
    this._interval;
    this.whoosh;
  }


  playSoundIOS(){
        this.setState({myValue: 0});
        if(this._interval){
            clearInterval(this._interval);
        }
        console.log(this.props.url);
        let dirs = RNFetchBlob.fs.dirs;
        var namefile = this.props.url.split('?')[0].split('/')
        var name_file = namefile[namefile.length-1]
        console.log('Name of audio file is :' + name_file);
        var fext = name_file.split('.');
        RNFetchBlob.fs.exists(Sound.DOCUMENT + '/' + (name_file))
        .then((exist) => {
            console.log(`file ${exist ? '' : 'not'} exists`)
            if(exist == true){
                               var whoosh = new Sound(Sound.DOCUMENT + '/' + (name_file),'', error => {
                                                  if (error) {
                                                    console.log('failed to load the sound', error);
                                                  } else { // loaded successfully
                                                    console.log('duration in seconds: ' + whoosh.getDuration()); 
                                                        //file.sound.enableInSilenceMode(true);
                                                        console.log("name", whoosh._filename)
                                                        whoosh.play(success => {
                                                            if (success) {
                                                               console.log('success');
                                                            } else {
                                                               console.log('error');
                                                            }
                                                        },
                                                        err => {
                                                            console.log(err)
                                                        })
                                                      }
                                                    });
            
                       
            }
            else{
              RNFetchBlob
                .config({
                      fileCache : true,
                      trusty : true,
                      addAndroidDownloads : {
                          useDownloadManager : true, // <-- this is the only thing required
                          // Optional, but recommended since android DownloadManager will fail when
                          // the url does not contains a file extension, by default the mime type will be text/plain
                          description : 'File downloaded by download manager.',
                          mediaScannable : true,
                          mime : 'application/octet-stream',
                      },
                       appendExt: fext[fext.length-1], // only append an extension if the res.path() does not return one
                       path : Sound.DOCUMENT + '/' + (name_file)
                  })
                .fetch('GET', this.props.url, {
                  //some headers 
                })
                // listen to download progress event
                  .progress((received, total) => {
                      console.log('progress', received / total)
                  })
                .then((res) => {
                              console.log(res.path());
                              if(ReactNative.Platform.OS == 'ios'){
                                  console.log(Sound.DOCUMENT);

                                   var whoosh = new Sound(res.path(),'',error => {
                                                  if (error) {
                                                    console.log('failed to load the sound', error);
                                                  } else { // loaded successfully
                                                    console.log('duration in seconds: ' + whoosh.getDuration()); 
                                                        //file.sound.enableInSilenceMode(true);
                                                        console.log("name", whoosh._filename)
                                                        whoosh.play(success => {
                                                            if (success) {
                                                               console.log('success');
                                                            } else {
                                                               console.log('error');
                                                            }
                                                        },
                                                        err => {
                                                            console.log(err)
                                                        })
                                                      }
                                                    });
                      
                              }
                           
                            
                })
           }
        })







  }

  playSound(){
        
        // else if(this.whoosh){
        //   this.whoosh.play();
        // }
        // this.setState({myValue: 0});
        // if(this._interval){
        //     clearInterval(this._interval);
        // }
        console.log(this.props.url);
        if(this.whoosh){
          console.log("IS Playing:", this.state.isPlaying);
            if(this.state.isPlaying){
              this.setState({isPlaying: false, icon: 'play-circle-o'});
              this.whoosh.pause();
              return;
            }else{
              this.setState({isPlaying: true, icon: 'pause-circle'});
            this.whoosh.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
            this.setState({isPlaying: false, icon: 'play-circle-o', myValue: 0});
            this.whoosh.stop();
            this.whoosh.setCurrentTime(0);
            });
              return;
            }
        }
        this.whoosh = new Sound(this.props.url, Sound.MAIN_BUNDLE, (error) => {

        if (error) {
            console.log('failed to load the sound', error);
            return;
        } 
            // loaded successfully 
            console.log('duration in seconds: ' + this.whoosh.getDuration() + 'number of channels: ' + this.whoosh.getNumberOfChannels());
            this.setState({length: this.whoosh.getDuration()});
            this.setState({isPlaying: true, icon: 'pause-circle'});
            this.whoosh.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
            this.setState({isPlaying: false, icon: 'play-circle-o', myValue: 0});
            this.whoosh.stop();
            this.whoosh.setCurrentTime(0);
            }); 
            this._interval =  this.setInterval(
                () => { this.whoosh.getCurrentTime((seconds) => {this.setState({myValue: seconds}); console.log("Current Seconds", seconds)}); },
                500
                );
            
        });

        // this.whoosh.play();

  }


  render() {
    if(ReactNative.Platform.OS == 'ios'){
        return (
                   <Card style={{borderRadius: 10}}>
      <Icon
          name={this.state.icon}
          type='font-awesome'
          color='#444d56'
          size={26}
          onPress={()=>{this.playSoundIOS()}}
        />
    <View style={ {width: 180,
    height: 25,
    backgroundColor: "#2E8DFE",
    borderRadius: 10,
    marginTop:5}}>
          <Slider
          style={{marginTop:5}}
          value={this.state.myValue}
          maximumValue={this.state.length}
          minimumValue={0}
          onValueChange={(value) => this.setState({value: this.state.myValue})} />
    </View>
    </Card>

    );
    }

    else{
          return (
                   <Card style={{borderRadius: 10}}>
      <Icon
          name={this.state.icon}
          type='font-awesome'
          color='#444d56'
          size={26}
          onPress={()=>{this.playSound()}}
        />
    <View style={ {width: 180,
    height: 25,
    backgroundColor: "#2E8DFE",
    borderRadius: 10,
    marginTop:5}}>
          <Slider
          style={{marginTop:5}}
          value={this.state.myValue}
          maximumValue={this.state.length}
          minimumValue={0}
          onValueChange={(value) => this.setState({value: this.state.myValue})} />
    </View>
    </Card>

    );
    }
    

  }
}

reactMixin(AudioPlayer.prototype, timer)

export default AudioPlayer;