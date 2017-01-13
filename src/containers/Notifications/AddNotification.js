import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button } from '@ui/';
import React, { Component } from 'react';
import { View } from 'react-native';
import FormValidation from 'tcomb-form-native';

class AddNotification extends Component {
  static componentName = 'AddNotification';

  constructor(props) {
    super(props);

    const validName = FormValidation.refinement(
      FormValidation.String, (notificationtitle) => {
        if (notificationtitle.length < 1) return false;
        return true;
      },
    );

    const validDesc = FormValidation.refinement(
      FormValidation.String, (notificationdesc) => {
        if (notificationdesc.length < 1) return false;
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
        Title: validName,
        Description: validDesc,
      }),
      empty_form_values: {
        notificationTitle: '',
        notificationDescription: '',
      },
      form_values: {},
      options: {
        fields: {
          notificationTitle: {
            error: 'Please enter the title',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          notificationDescription: {
            error: 'Please enter short description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
        },
      },
    };
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
            title={'Add Notification'}
          />

          <Spacer size={10} />

        </Card>
      </View>
    );
  }
}

export default AddNotification;
