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

reactMixin(AudioPlayer.prototype, timer)

export default AudioPlayer;