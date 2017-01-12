import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button } from '@ui/';
import * as TeamActions from '@redux/team/teamActions';
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import FormValidation from 'tcomb-form-native';
import auth from '../../services/auth';

class CreateChannel extends Component {
  static componentName = 'CreateChannel';

  constructor(props) {
    super(props);

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
      form_values: {},
      options: {
        fields: {
          channelName: {
            error: 'Please enter channel name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          teamDescription: {
            error: 'Please enter short channel description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
        },
      },
    };
  }

  componentDidMount = async () => {
    const token = await auth.getToken();
    console.log('token is Launchview is: ' + token);
    if (token !== '') {
      this.props.teamFetch(token);
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

          <View>
            {
            this.props.teams.map((team, i) => (
              <Text>team.deptname</Text>
            ))
          }
          </View>

          <Button
            title={'Create Channel'}
          />

          <Spacer size={10} />

        </Card>
      </View>
    );
  }
}

const mapDispatchToProps = {
  teamFetch: TeamActions.teamFetch,
};

function mapStateToProps(state) {
  const { teams } = state.teams;

  return { teams };
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateChannel);
