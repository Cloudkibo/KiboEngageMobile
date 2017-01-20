import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
import * as TeamActions from '@redux/team/teamActions';
import * as UserActions from '@redux/user/actions';
import * as ChannelActions from '@redux/channel/ChannelActions';
import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import FormValidation from 'tcomb-form-native';
import auth from '../../services/auth';
var _ = require('lodash');

class EditChannel extends Component {
  static componentName = 'EditChannel';

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
        channelName: validName,
        channelDescription: validDesc,
      }),
      empty_form_values: {
        channelName: '',
        channelDescription: '',
      },
      form_values: {
        channelName : this.props.channel.msg_channel_name,
        channelDescription : this.props.channel.msg_channel_description
      },
      options: {
        fields: {
          channelName: {
            error: 'Please enter channel name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          channelDescription: {
            error: 'Please enter short channel description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            multiline: true,
            stylesheet,
          },
        },
      },
    };
  }

  

 

  editChannel = async () => {
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
          const channel = {
            '_id' : this.props.channel._id,
            'msg_channel_name': credentials.channelName,
            'msg_channel_description': credentials.channelDescription,
            'companyid': this.props.channel.companyid,
            'groupid': this.props.channel.groupid,
            'createdby': this.props.channel.createdby,
            'activeStatus' : this.props.channel.activeStatus,
          };

          console.log(channel);
    
          this.props.editChannel(channel, token);
        }
      });
    }
  }

  deleteChannel = async () => {
    // Form is valid
        this.setState({ resultMsg: { status: 'Deleting Channel...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.deleteChannel(this.props.channel,token);
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
        <Card title = {'Team : ' + this.props.teamName}>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.channelsuccess}
            error={this.props.channelerror}
          />
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          
          <Spacer size={55} />

          <Button
            title={'Save Changes'}
            onPress={this.editChannel}
          />

          <Button
            title={'Delete Channel'}
            onPress={this.deleteChannel}
          />
          <Spacer size={10} />

         

        </Card>
      </View>
    );
  }
}



const mapDispatchToProps = {
 
  editChannel: ChannelActions.editChannel,
  deleteChannel : ChannelActions.deleteChannel,
};

function mapStateToProps(state) {
  
  const { userdetails } = state.user;
  const { channels, channelerror, channelsuccess } = state.channels;
 
  return { userdetails, channels, channelerror, channelsuccess };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditChannel);
