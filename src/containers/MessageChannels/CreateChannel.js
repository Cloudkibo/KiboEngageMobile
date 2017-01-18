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

class CreateChannel extends Component {
  static componentName = 'CreateChannel';

  constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);
    stylesheet.textbox.normal.height = 80;

    this.dropdownRenderRow = this.dropdownRenderRow.bind(this);

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
      groupid: '',
      form_fields: FormValidation.struct({
        channelName: validName,
        channelDescription: validDesc,
      }),
      empty_form_values: {
        channelName: '',
        channelDescription: '',
      },
      form_values: {},
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

  componentDidMount = async () => {
    const token = await auth.getToken();
    console.log(`token is Launchview is: ${token}`);
    if (token !== '') {
      this.props.teamFetch(token);
      this.props.getuser(token);
    }
  }

  dropdownRenderRow(rowData, rowID, highlighted) {
    return (
      <View style={{ flexDirection: 'row', height: 40, alignItems: 'center' }}>
        <Text style={{ marginHorizontal: 4, fontSize: 16, color: 'black', textAlignVertical: 'center' }}>
          {`   ${rowData}`}
        </Text>
      </View>
    );
  }

  createChannel = async () => {
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
            'msg_channel_name': credentials.channelName,
            'msg_channel_description': credentials.channelDescription,
            'companyid': this.props.userdetails.uniqueid,
            'groupid': this.state.groupid,
            'createdby': this.props.userdetails._id,
          };

          console.log(channel);

          this.props.createChannel(channel, token);
        }
      });
    }
  }

  dropDownOnSelect(idx, value) {
    for (var i = 0; i< this.props.teams.length; i++) {
       if (this.props.teams[i].deptname === value) {
         this.setState({
           groupid: this.props.teams[i]._id,
         });
         break;
       }
    }
  }

  render = () => {
    const Form = FormValidation.form.Form;
    var optionList = [];

    for (var i = 0; i < this.props.teams.length; i++){
      optionList[i] = this.props.teams[i].deptname;
    }

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

          <ModalDropdown
            style={{ alignSelf: 'center', width: 150, top: 16, right: 8, borderWidth: 1, borderRadius: 2, borderColor: 'black' }}
            textStyle={{ marginVertical: 10, marginHorizontal: 6, fontSize: 18, color: 'black', textAlign: 'center', textAlignVertical: 'center' }}
            dropdownStyle={{ width: 150, height: 150, borderColor: 'black', borderWidth: 1, borderRadius: 2 }}
            defaultValue="Choose Team"
            options={optionList}
            onSelect={(idx, value) => this.dropDownOnSelect(idx, value)}
            renderRow={this.dropdownRenderRow}
          />

          <Spacer size={55} />

          <Button
            title={'Create Channel'}
            onPress={this.createChannel}
          />

          <Spacer size={10} />

          <Alerts
            success={this.props.channelsuccess}
            error={this.props.channelerror}
          />

        </Card>
      </View>
    );
  }
}

CreateChannel.propTypes = {
  teamFetch: PropTypes.func,
  getuser: PropTypes.func,
  teams: PropTypes.array,
};

const mapDispatchToProps = {
  teamFetch: TeamActions.teamFetch,
  getuser: UserActions.getuser,
  createChannel: ChannelActions.createChannel,
};

function mapStateToProps(state) {
  const { teams } = state.teams;
  const { userdetails } = state.user;
  const { channels, channelerror, channelsuccess } = state.channels;
  console.log(channelsuccess);

  return { teams, userdetails, channels, channelerror, channelsuccess };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChannel);
