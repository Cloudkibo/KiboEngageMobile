import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button } from '@ui/';
import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import FormValidation from 'tcomb-form-native';

var _ = require('lodash');

class SendEmail extends Component {
  static componentName = 'CreateChannel';

  constructor(props) {
    super(props);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;

    const validName = FormValidation.refinement(
      FormValidation.String, (customerName) => {
        if (customerName.length < 1) return false;
        return true;
      },
    );

    const validEmail = FormValidation.refinement(
      FormValidation.String, (customerEmail) => {
        if (customerEmail.indexOf('@') < 1 || customerEmail.lastIndexOf('.') < (customerEmail.indexOf('@') + 2) || (customerEmail.lastIndexOf('.') + 2) < customerEmail.length) return false;
        return true;
      },
    );

    const validSubject = FormValidation.refinement(
      FormValidation.String, (subject) => {
        if (subject.length < 1) return false;
        return true;
      },
    );

    const validBody = FormValidation.refinement(
      FormValidation.String, (body) => {
        if (body.length < 1) return false;
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
        To: validName,
        Email: validEmail,
        Subject: validSubject,
        Body: validBody,
      }),
      empty_form_values: {
        To: '',
        Email: '',
        Subject: '',
        Body: '',
      },
      form_values: {
        To: this.props.name,
        Email: this.props.email,
      },
      options: {
        fields: {
          To: {
            error: 'Please enter customer name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Email: {
            error: 'Please enter valid email id of customer',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Subject: {
            error: 'Please enter subject of the email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Body: {
            error: 'Please enter body of the email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            placeholder: 'Write email here...',
            multiline: true,
            stylesheet,
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
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={[AppStyles.container]}
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
              title={'Submit'}
            />

            <Spacer size={10} />

          </Card>
        </ScrollView>
      </View>
    );
  }
}

export default SendEmail;
