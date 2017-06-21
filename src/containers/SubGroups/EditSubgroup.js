import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
import * as GroupActions from '@redux/group/groupActions';
import * as UserActions from '@redux/user/actions';
import * as SubgroupActions from '@redux/subgroup/SubgroupActions';
import React, { Component, PropTypes } from 'react';
import { View , Alert} from 'react-native';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import FormValidation from 'tcomb-form-native';
import auth from '../../services/auth';
import { Keyboard , TouchableWithoutFeedback, ScrollView} from 'react-native'
var _ = require('lodash');

class EditSubgroup extends Component {
  static componentName = 'EditSubgroup';

  constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
   
    const validName = FormValidation.refinement(
      FormValidation.String, (channelname) => {
        if (channelname.length < 1) return false;
        return true;
      },
    );

    const validDesc = FormValidation.refinement(
      FormValidation.String, (channeldesc) => {
        if (channeldesc.length < 1) return false;
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
        subgroupName: validName,
        subgroupDescription: validDesc,
      }),
      empty_form_values: {
        subgroupName: '',
        subgroupDescription: '',
      },
      form_values: {
        subgroupName : this.props.subgroup.msg_channel_name,
        subgroupDescription : this.props.subgroup.msg_channel_description
      },
      options: {
        fields: {
          subgroupName: {
            error: 'Please enter subgroup name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          subgroupDescription: {
            error: 'Please enter short subgroup description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            multiline: true,
            stylesheet,
          },
        },
      },
    };
  }

  

 

  editSubgroup = async () => {
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
          const subgroup = {
            '_id' : this.props.subgroup._id,
            'msg_channel_name': credentials.subgroupName,
            'msg_channel_description': credentials.subgroupDescription,
            'companyid': this.props.subgroup.companyid,
            'groupid': this.props.subgroup.groupid,
            'createdby': this.props.subgroup.createdby,
            'activeStatus' : this.props.subgroup.activeStatus,
          };

          console.log(subgroup);
    
          this.props.editSubgroup(subgroup, token);
        }
      });
    }
  }

  deleteSubgroupConfirm = async () => {
    // Form is valid
        this.setState({ resultMsg: { status: 'Deleting subgroup...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.deleteSubgroup(this.props.subgroup,token);
        }
     
  }
 

  deleteSubgroup = () => {

    Alert.alert(
            'Delete Subgroup',
            'Are you sure you want to delete this subgroup?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Yes', onPress: () => this.deleteSubgroupConfirm()},
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
       <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
        <View>
        <Spacer size={55} />
        <ScrollView>
        <Card title = {'Team : ' + this.props.groupName}>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.subgroupsuccess}
            error={this.props.channelerror}
          />
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          
          
         {this.props.userdetails.isAgent == "No" &&
          <View>
          <Button
            title={'Save Changes'}
            onPress={this.editSubgroup}
          />
          <Spacer size={15} />
          <Button
            title={'Delete Subgroup'}
            onPress={this.deleteSubgroup}
          />
          </View>
        }
          <Spacer size={10} />

         

        </Card>
        </ScrollView>
                </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }
}



const mapDispatchToProps = {
 
  editSubgroup: SubgroupActions.editSubgroup,
  deleteSubgroup : SubgroupActions.deleteSubgroup,
};

function mapStateToProps(state) {
  
  const { userdetails } = state.user;
  const { subgroups, channelerror, subgroupsuccess } = state.subgroups;
 
  return { userdetails, subgroups, channelerror, subgroupsuccess };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSubgroup);
