import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Text, Button } from '@ui/';
import * as GroupActions from '@redux/group/groupActions';
import * as UserActions from '@redux/user/actions';
import * as SubgroupActions from '@redux/subgroup/SubgroupActions';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Keyboard, View, ScrollView, TouchableWithoutFeedback } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import FormValidation from 'tcomb-form-native';
import auth from '../../services/auth';

const _ = require('lodash');

class CreateSubGroup extends Component {
  static componentName = 'CreateSubGroup';

  constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
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
        subgroupName: validName,
        subgroupDescription: validDesc,
      }),
      empty_form_values: {
        subgroupName: '',
        subgroupDescription: '',
      },
      form_values: {},
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

  componentDidMount = async () => {
    const token = await auth.getToken();
    console.log(`token is Launchview is: ${token}`);
    if (token !== '') {
      this.props.groupFetch(token);
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
          const subgroup = {
            'msg_channel_name': credentials.subgroupName,
            'msg_channel_description': credentials.subgroupDescription,
            'companyid': this.props.userdetails.uniqueid,
            'groupid': this.state.groupid,
            'createdby': this.props.userdetails._id,
          };

          console.log(subgroup);

          this.props.createChannel(subgroup, token);
        }
      });
    }
  }

  dropDownOnSelect(idx, value) {
    for (var i = 0; i< this.props.groups.length; i++) {
      if (this.props.groups[i].deptname === value) {
        this.setState({
          groupid: this.props.groups[i]._id,
        });
        break;
      }
    }
  }

  render = () => {
    const Form = FormValidation.form.Form;
    const optionList = [];

    for (var i = 0; i < this.props.groups.length; i++){
      optionList[i] = this.props.groups[i].deptname;
    }

    return (
      <View
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
          <View>
            <Spacer size={55} />
            <ScrollView>
            <Card>
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
                title={'Create Subgroup'}
                onPress={this.createChannel}
              />

              <Spacer size={10} />

            </Card>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

CreateSubGroup.propTypes = {
  groupFetch: PropTypes.func,
  getuser: PropTypes.func,
  groups: PropTypes.array,
};

const mapDispatchToProps = {
  groupFetch: GroupActions.groupFetch,
  getuser: UserActions.getuser,
  createChannel: SubgroupActions.createChannel,
};

function mapStateToProps(state) {
  const { subgroups, channelerror, subgroupsuccess } = state.subgroups;
  const { groups } = state.groups;
  const { userdetails } = state.user;

  return { groups, userdetails, subgroups, channelerror, subgroupsuccess };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubGroup);
