import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
import * as UserActions from '@redux/user/actions';
import * as AgentActions from '@redux/agents/agentActions';
import React, { Component, PropTypes } from 'react';
import { View , Alert, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import FormValidation from 'tcomb-form-native';
import auth from '../../services/auth';
import { Keyboard , TouchableWithoutFeedback} from 'react-native'
var _ = require('lodash');

class EditAgent extends Component {
  static componentName = 'EditAgent';

  constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
   
   
    var role = FormValidation.enums({
              agent: 'Agent',
              supervisor: 'Supervisor',
              admin : 'Admin',
            });

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
      form_fields: FormValidation.struct({
        agentRole: role,
        
      }),
      empty_form_values: {
        subgroupName: '',
        subgroupDescription: '',
      },
      form_values: {
        agentRole : this.props.agent.role,
      },
      options: {
        fields: {
          agentRole:{
            nullOption:false,
          }
        },
      },
    };
  }

  

 

  editAgent = async () => {
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

        if (auth.loggedIn() === true) {
          console.log('auth.loggedIn() return true');
          const token = await auth.getToken();
          console.log(token);
          const agentbody = {
            '_id' : this.props.agent._id,
            'role': credentials.agentRole[0].toUpperCase() + credentials.agentRole.slice(1),

          
          };

          console.log(agentbody);
    
          this.props.editAgent(agentbody,this.props.userdetails._id,token);
        }
      });
    }
  }

  deleteAgentConfirm = async () => {
    // Form is valid
        this.setState({ resultMsg: { status: 'Deleting Agent...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.deleteAgent(this.props.agent,token);
        }
     
  }
 

  deleteAgent = () => {

    Alert.alert(
            'Delete Agent',
            'Are you sure you want to delete this agent?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Yes', onPress: () => this.deleteAgentConfirm()},
            ]
          )

    
     
  }
  render = () => {
    const Form = FormValidation.form.Form;
    

    return (
      <View
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
        <ScrollView>
       <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
        <View>
        <Spacer size={55} />
        <Card title = {'Agent : ' + this.props.agent.firstname+' ' + this.props.agent.lastname}>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.statuscode == 200?this.props.status:''}
            error={this.props.statuscode == 422?this.props.status:''}
          />
          <Text>Current Role : {this.props.agent.isAgent == "Yes"?"Agent":this.props.agent.isAdmin == "Yes"?"Admin":"Supervisor"}</Text>
          
          <Spacer size={20} />
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          
          <Spacer size={55} />
         {this.props.userdetails.isAdmin == "Yes" &&
          <View>
          <Button
            title={'Save Changes'}
            onPress={this.editAgent}
          />
          <Spacer size={15} />
          <Button
            title={'Delete Agent'}
            onPress={this.deleteAgent}
          />
          </View>
        }
          <Spacer size={10} />

         

        </Card>
                </View>
      </TouchableWithoutFeedback>
        </ScrollView>
      </View>
    );
  }
}



const mapDispatchToProps = {
 
  editAgent: AgentActions.editAgent,
  deleteAgent : AgentActions.deleteAgent,
};

function mapStateToProps(state) {
  
  const { userdetails } = state.user;
  const {status,statuscode} = state.agents;
  return { userdetails,status,statuscode};
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAgent);
