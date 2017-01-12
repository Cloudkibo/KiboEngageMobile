/**
 * Login Screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  View
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../services/auth';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';
import { connect } from 'react-redux';
import * as UserActions from '@redux/user/actions';
// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
class Dashboard extends Component {
  static componentName = 'Dashboard';

 
  constructor(props) {
    super(props);
    
    this.state = {'userdetails' : null};
  }
 

  componentWillRecieveProps(props){
    if(props.userdetails){
      this.setState({
          userdetails: props.userdetails,
        });
    }
  }
  componentDidMount = async() => {
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
           this.props.getuser(token);
       
            
          }
  
  }
  
  rendername(){
   return (
     <View style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Text> Hello {this.state.userdetails.firstname}</Text>
        </Card>
      </View>
    
    );
  }

renderLoadingView(){
   return (
     <View style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Text> Loading User data ...</Text>
        </Card>
      </View>
    
    );
  }
  render = () => {
      if (!this.state.userdetails) {
      return this.renderLoadingView();
    }

    else
    return this.renderName();
  }
  }


const mapDispatchToProps = {
  getuser: UserActions.getuser,
 };

function mapStateToProps(state) {
   const { userdetails} = state.user;
  
  return {userdetails};

}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

