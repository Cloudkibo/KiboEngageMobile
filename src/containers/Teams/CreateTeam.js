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
  View,
  ListView,
  
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../../services/auth';
import { List, ListItem, SocialIcon } from 'react-native-elements';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes} from '@theme/';
import * as TeamActions from '@redux/team/TeamActions';
import { connect } from 'react-redux';
var _ = require('lodash');

// Components
import { Alerts, Card, Spacer, Text, Button } from '@components/ui/';

/* Component ==================================================================== */
class CreateTeam extends Component {
  static componentName = 'CreateTeam';

  constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);

    // overriding the text color
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;

   
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

    var Status = FormValidation.enums({
              public: 'Public',
              private: 'Private'
            });

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',

      },
      
      
      form_fields: FormValidation.struct({
        teamName:validName,
        teamDescription: validDesc,
        status:Status,
      }),
      empty_form_values: {
        teamName:'',
        teamDescription: '',
      
      },
      form_values: {
        status:'public',
        
      },
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
            multiline: true,
            stylesheet: stylesheet 
          },
          status:{
            nullOption:false,
          }
          
        },
      },
    };



    

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
        this.setState({ resultMsg: { status: 'Creating team...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
    
            console.log(credentials.status);
           this.props.createteam({
                          groupname: credentials.teamName,
                          groupdescription: credentials.teamDescription,
                          status : credentials.status,
                          token:token,
            });
        }
      });
    }
  }
  
  
  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView style={[AppStyles.container]}>
      <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.teamsuccess}
            error={this.props.teamerror}
          />

  
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />


           <Spacer size={20} />
          
          <Button
            title={'Create Team'}
            onPress={this.createTeam}
          />
       
         
        </Card>
       </ScrollView>
    );
  }
}


function mapStateToProps(state) {
   const {teams,teamerror,teamsuccess} =  state.teams;
  
  return {teams,teamerror,teamsuccess};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  createteam: TeamActions.createteam,
 
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTeam);

