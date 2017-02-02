/**
 * Coming Soon
 *
    <InviteAgent text={"Hello World"} />
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { PropTypes } from 'react';
import { View } from 'react-native';

// Consts and Libs
import { AppStyles } from '@theme/';

// Components
import { Text, Card, Spacer } from '@ui/';
import { TextInput, Button } from 'react-native';

/* Component ==================================================================== */
styles = {
  cardDescription: {
    fontStyle: 'normal',
    fontSize: 10
  }
}
const InviteAgent = ({ text }) => (
  <View style={[AppStyles.container]}>
    <Spacer size={50} />
    <Card>
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
      />
    </Card>

  </View>
);

InviteAgent.propTypes = { text: PropTypes.string };
InviteAgent.defaultProps = { text: 'Coming soon...' };
InviteAgent.componentName = 'InviteAgent';

/* Export Component ==================================================================== */
export default InviteAgent;
