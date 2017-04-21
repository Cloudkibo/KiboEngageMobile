import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button } from '@ui/';
import React, { Component, PropTypes } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import FormValidation from 'tcomb-form-native';
import * as UserActions from '@redux/user/actions';
import * as CustomerActions from '@redux/Customers/CustomerActions';
import auth from '../../services/auth';

var _ = require('lodash');

class SendEmail extends Component {
  static componentName = 'SendEmail';

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
        if (customerEmail.indexOf('@') < 1 || customerEmail.lastIndexOf('.') < (customerEmail.indexOf('@') + 2) || (customerEmail.lastIndexOf('.') + 2) >= customerEmail.length) return false;
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

  componentDidMount = async () => {
    const token = await auth.getToken();

    if (token !== '') {
      this.props.getuser(token);
    }
  }

  emailCustomer = async () => {
    const credentials = this.form.getValue();

    if (credentials) {
      this.setState({ form_values: credentials }, async () => {
        this.setState({ resultMsg: { status: 'One moment...' } });

        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if (auth.loggedIn() === true) {
          console.log('auth.loggedIn() return true');

          const emailMsg = {
            'to': credentials.To,
            'emailAdd': credentials.Email,
            'subject': credentials.Subject,
            'body': credentials.Body,
            'from': this.props.userdetails.firstname + ' ' + this.props.userdetails.lastname,
          };
          console.log(emailMsg);
          const token = await auth.getToken();

          this.props.emailCustomer(emailMsg, token );
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
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={[AppStyles.container]}
        >
          <Spacer size={55} />
          <Card>
            <Alerts
              status={this.state.resultMsg.status}
              success={this.props.sendEmailSuccess}
              error={this.props.sendEmailError}
            />

            <Form
              ref={(b) => { this.form = b; }}
              type={this.state.form_fields}
              value={this.state.form_values}
              options={this.state.options}
            />

            <Button
              title={'Submit'}
              onPress={this.emailCustomer}
            />

            <Spacer size={10} />

          </Card>
        </ScrollView>
      </View>
    );
  }
}

SendEmail.propTypes = {
  getuser: PropTypes.func,
  emailCustomer: PropTypes.func,
};

const mapDispatchToProps = {
  getuser: UserActions.getuser,
  emailCustomer: CustomerActions.emailCustomer,
};

function mapStateToProps(state) {
  const { userdetails } = state.user;
  const { customers, sendEmailSuccess, sendEmailError } = state.customers;

  return { userdetails, customers, sendEmailError, sendEmailSuccess };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendEmail);
