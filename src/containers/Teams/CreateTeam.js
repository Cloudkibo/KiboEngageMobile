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
import auth from '../../services/auth';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';
import * as TeamActions from '@redux/team/teamActions';
import { connect } from 'react-redux';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
class CreateTeam extends Component {
  static componentName = 'CreateTeam';

 
  constructor(props) {
    super(props);

    const validName= FormValidation.refinement(
      FormValidation.String, (teamname) => {
        if (teamname.length < 1) return false;
        return true;
      },
    );

    const validDesc= FormValidation.refinement(
      FormValidation.String, (teamdesc) => {
        if (teamdesc.length < 1) return false;
        return true;
      },
    );

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      form_fields: FormValidation.struct({
        teamName:validName,
        teamDescription: validDesc,
      }),
      empty_form_values: {
        teamName:'',
        teamDescription: '',
      
      },
      form_values: {},
      options: {
        fields: {
          teamName: {
            error: 'Please enter team name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          teamDescription: {
            error: 'Please enter short team description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          
        },
      },
    };
  }

  componentDidMount = async () => {
    // Get user data from AsyncStorage to populate fields
  /*  const values = await AsyncStorage.getItem('api/credentials');
    const jsonValues = JSON.parse(values);

    if (values !== null) {
      this.setState({
        form_values: {
          Domain: jsonValues.domain,
          Email: jsonValues.username,
          Password: jsonValues.password,

        },
      });
    }*/
  }

  /**
    * Create Team
    */
  createTeam = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, async () => {
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.createteam({
              teamname: credentials.teamname,
              description: credentials.teamdesc,
              token:token,
            })
        }
      });
    }
  }
  
  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <View
        
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
      <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.state.resultMsg.success}
            error={this.state.resultMsg.error}
          />

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Button
            title={'Create Team'}
            onPress={this.createTeam}
          />

          <Spacer size={10} />

           <Alerts
           
            success={this.props.teamsuccess}
            error={this.props.teamerror}
          />
        </Card>
      </View>
    );
  }
}


function mapStateToProps(state) {
   const {teams,teamerror,teamsuccess} =  state.teams;
  
  return {teams,teamerror,teamsuccess };
}


// Any actions to map to the component?
const mapDispatchToProps = {
  createteam: TeamActions.createteam,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);
