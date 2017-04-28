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
import { Text, Card, Spacer, Alerts, } from '@ui/';
import { TextInput, Button } from 'react-native';
import { Icon } from 'react-native-elements';
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
    };
    this._interval;
  }


  playSound(){
        this.setState({myValue: 0});
        if(this._interval){
            clearInterval(this._interval);
        }
        console.log(this.props.url);
        var whoosh = new Sound(this.props.url, Sound.MAIN_BUNDLE, (error) => {

        if (error) {
            console.log('failed to load the sound', error);
            return;
        } 
            // loaded successfully 
            console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());
            this.setState({length: whoosh.getDuration()});
            whoosh.play();
            this._interval =  this.setInterval(
                () => { whoosh.getCurrentTime((seconds) => {this.setState({myValue: seconds}); console.log("Current Seconds", seconds)}); },
                500
                );
            
        });
        whoosh.play((success) => {
        if (success) {
            console.log('successfully finished playing');
        } else {
            console.log('playback failed due to audio decoding errors');
        }
        }); 
  }

  render() {
    return (
    <View style={{width:250,padding:5, backgroundColor: "#2E8DFE"}}>
          <View>
        <Icon
          name='play'
          type='font-awesome'
          color='#444d56'
          size={26}
          onPress={()=>{this.playSound()}}
        />
          <Slider
          value={this.state.myValue}
          maximumValue={this.state.length}
          minimumValue={0}
          onValueChange={(value) => this.setState({value: this.state.myValue})} />
          </View>
    </View>
    );
  }
}

reactMixin(AudioPlayer.prototype, timer)

export default AudioPlayer;