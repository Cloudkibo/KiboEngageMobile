/**
 * Coming Soon
 *
    <InviteAgent text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { PropTypes, Component } from 'react';
import { View } from 'react-native';
import axios from 'axios';
// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Text, Card, Spacer, Alerts, } from '@ui/';
import { TextInput, Button, Picker, ScrollView } from 'react-native';
import auth from '../../services/auth';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import * as AgentActions from '@redux/agents/agentActions';
var querystring = require('querystring');
/* Component ==================================================================== */
styles = {
  cardDescription: {
    fontStyle: 'normal',
    fontSize: 10
  }
}




class ChatSettings extends Component {

  constructor(props){
    super(props);
    this.state = {
        error: '',
    };
  }



  sendInvite = async () => {
    this.setState({error: ''});
    var token =  await auth.getToken();
    console.log(this.state.text);
    console.log(token);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(this.state.text)){
        this.setState({error: 'Invalid Email'});
        return;
    }

    this.props.agentInvite(token, this.state.text);
  }

  render() {
    return (

    <ScrollView>
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    
    <Card>
      <Text>Status</Text>
      <Text style={styles.cardDescription}>
        Current Status - Assigned 
      </Text>
      <Text style={styles.cardDescription}>
        Finance - Payment
      </Text>
      
    </Card>
    <Card>
    <Text>Assign To Agent</Text>
    <Spacer size={10} />
       <Picker
  selectedValue={this.state.language}
  onValueChange={(lang) => this.setState({language: lang})}>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
</Picker>
     <Spacer size={10} />
     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Send Invite to Agent"
        onPress={this.sendInvite}
      />
    </Card>

     <Card>
    <Text>Assign To Group</Text>
    <Spacer size={10} />
      <Picker
  selectedValue={this.state.language}
  onValueChange={(lang) => this.setState({language: lang})}>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
</Picker>
     <Spacer size={10} />
     <Button
        title="Assign"
        color="#841584"
        accessibilityLabel="Send Invite to Agent"
        onPress={this.sendInvite}
      />
    </Card>

     <Card>
    <Text>Move To Other Channel</Text>
    <Spacer size={10} />
      <Picker
  selectedValue={this.state.language}
  onValueChange={(lang) => this.setState({language: lang})}>
  <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
</Picker>
     <Spacer size={10} />
     <Button
        title="Move"
        color="#841584"
        accessibilityLabel="Send Invite to Agent"
        onPress={this.sendInvite}
      />
    </Card>

  </View>
  </ScrollView>
    );
  }
}


/* Export Component ==================================================================== */
const mapDispatchToProps = {
  agentInvite: AgentActions.agentInvite,
};
function mapStateToProps(state) {
   const   {invite}    = state.agents;
  return  {invite};
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatSettings);

