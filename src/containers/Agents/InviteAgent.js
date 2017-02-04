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
import { TextInput, Button } from 'react-native';
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




class InviteAgent extends Component {

  constructor(props){
    super(props);
  }



  sendInvite = async () => {
    var token =  await auth.getToken();
    console.log(this.state.text);
    console.log(token);
    this.props.agentInvite(token, this.state.text);
  }

  render() {
    return (
      <View style={[AppStyles.container]}>
    <Spacer size={50} />
    <Card>
      <Alerts
            status={ this.props.invite }
            success=''
            error=''
          />
      <Text>Invite Agent</Text>
      <Text style={styles.cardDescription}>You can also invite the agent by sharing the following link with them.https://kiboengage.cloudapp.net/joincompany
      They will have to register with us to join your company.DON'T FORGET to give them your company's unique
      cd89f71715f2014725163952</Text>
      <Spacer size={10} />
      <TextInput
     style={{height: 40, borderColor: 'gray', borderWidth: 1}}
     onChangeText={(text) => this.setState({text})}
     placeholder="Email Address"
     />
     <Spacer size={10} />
     <Button
        title="Send Invite"
        color="#841584"
        accessibilityLabel="Send Invite to Agent"
        onPress={this.sendInvite}
      />
    </Card>

  </View>
    );
  }
}

InviteAgent.propTypes = { text: PropTypes.string };
InviteAgent.defaultProps = { text: 'Coming soon...' };
InviteAgent.componentName = 'InviteAgent';

/* Export Component ==================================================================== */
const mapDispatchToProps = {
  agentInvite: AgentActions.agentInvite,
};
function mapStateToProps(state) {
   const   {invite}    = state.agents;
  return  {invite};
}
export default connect(mapStateToProps, mapDispatchToProps)(InviteAgent);

