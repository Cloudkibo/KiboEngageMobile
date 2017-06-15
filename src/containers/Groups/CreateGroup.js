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
var _ = require('lodash');
// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';
import * as GroupActions from '@redux/group/groupActions';
import { connect } from 'react-redux';

// Components
import { Alerts, Card, Spacer, Text, Button } from '@ui/';

/* Component ==================================================================== */
class CreateGroup extends Component {
  static componentName = 'CreateGroup';

  
  constructor(props) {
    super(props);
    // clone the default stylesheet
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);

    // overriding the text color
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
    const validName= FormValidation.refinement(
      FormValidation.String, (groupname) => {
        if (groupname.length < 1) return false;
        return true;
      },
    );

    const validDesc= FormValidation.refinement(
      FormValidation.String, (groupdesc) => {
        if (groupdesc.length < 1) return false;
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
        groupName:validName,
        groupDescription: validDesc,
      }),
      empty_form_values: {
        groupName:'',
        groupDescription: '',
      
      },
      form_values: {},
      options: {
        fields: {
          groupName: {
            error: 'Please enter group name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          groupDescription: {
            error: 'Please enter short group description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            multiline: true,
            stylesheet: stylesheet // overriding the style of the textbox
                      
        },
      },
    }
  }
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
  createGroup = async () => {
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
   
            this.props.creategroup({
              groupname: credentials.groupName,
              description: credentials.groupDescription,
            
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
      <ScrollView>
        <Card>
          <Alerts
             status={this.state.resultMsg.status}
            success={this.props.groupsuccess}
            error={this.props.grouperror}
          />
       

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Button
            title={'Create Group'}
            onPress={this.createGroup}
          />

          
        </Card>
        </ScrollView>
      </View>
    );
  }
}


function mapStateToProps(state) {
   const {groups,grouperror,groupsuccess} =  state.groups;
  
  return {groups,grouperror,groupsuccess };
}


// Any actions to map to the component?
const mapDispatchToProps = {
  creategroup: GroupActions.creategroup,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateGroup);
