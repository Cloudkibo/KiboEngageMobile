import { AppStyles } from '@theme/';
import { Actions } from 'react-native-router-flux';
import { Alerts, Card, Spacer, Button } from '@ui/';
import React, { Component, PropTypes } from 'react';
import { View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import FormValidation from 'tcomb-form-native';
import * as UserActions from '@redux/user/actions';
import auth from '../../services/auth';

class MyProfile extends Component {
  static componentName = 'MyProfile';

  constructor(props) {
    super(props);

    const validFName = FormValidation.refinement(
      FormValidation.String, (FName) => {
        if (FName.length < 1) return false;
        return true;
      },
    );

    const validLName = FormValidation.refinement(
      FormValidation.String, (LName) => {
        if (LName.length < 1) return false;
        return true;
      },
    );

    const validEmail = FormValidation.refinement(
      FormValidation.String, (Email) => {
        if (Email.indexOf('@') < 1 || Email.lastIndexOf('.') < (Email.indexOf('@') + 2) || (Email.lastIndexOf('.') + 2) >= Email.length) return false;
        return true;
      },
    );

    const validRole = FormValidation.refinement(
      FormValidation.String, (role) => {
        if (role.length < 1) return false;
        return true;
      },
    );

    const validPhone = FormValidation.refinement(
      FormValidation.String, (phone) => {
        const regularExpression = /[0-9]/;
        return regularExpression.test(phone);
      },
    );

    const validCity = FormValidation.refinement(
      FormValidation.String, (city) => {
        if (city.length < 1) return false;
        return true;
      },
    );

    const validState = FormValidation.refinement(
      FormValidation.String, (state) => {
        if (state.length < 1) return false;
        return true;
      },
    );

    const validCountry = FormValidation.refinement(
      FormValidation.String, (country) => {
        if (country.length < 1) return false;
        return true;
      },
    );

    const validDomain = FormValidation.refinement(
      FormValidation.String, (domain) => {
        if (domain.length < 1) return false;
        return true;
      },
    );

    const validCompany = FormValidation.refinement(
      FormValidation.String, (company) => {
        if (company.length < 1) return false;
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
        FirstName: validFName,
        LastName: validLName,
        Email: validEmail,
        Role: validRole,
        Phone: validPhone,
        City: validCity,
        State: validState,
        Country: validCountry,
        DomainName: validDomain,
        CompanyName: validCompany,
      }),
      empty_form_values: {
        FirstName: '',
        LastName: '',
        Email: '',
        Role: '',
        Phone: '',
        City: '',
        State: '',
        Country: '',
        DomainName: '',
        CompanyName: '',
      },
      options: {
        fields: {
          FirstName: {
            error: 'Please enter a valid name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          LastName: {
            error: 'Please enter a valid name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Email: {
            error: 'Please enter valid email',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable: false,
          },
          Role: {
            error: 'Please enter valid role',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable: false,
          },
          Phone: {
            error: 'Please enter valid phone number',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          City: {
            error: 'Please enter valid city',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          State: {
            error: 'Please enter valid State',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Country: {
            error: 'Please enter valid country',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          DomainName: {
            error: 'Please enter valid domain name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable: false,
          },
          CompanyName: {
            error: 'Please enter valid company name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable: false,
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

  updateProfile = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
      if (this.scrollView) {
        this.scrollView.scrollTo({ y: 0 });
      }

      if (auth.loggedIn() === true) {
        const token = await auth.getToken();

        const user = {
          'firstname': credentials.FirstName,
          'lastname': credentials.LastName,
          'phone': credentials.Phone,
          'city': credentials.City,
          'state': credentials.State,
          'country': credentials.Country,
        };

        this.props.updateprofile(user, token);
      }
    }
  }

  render = () => {
    const Form = FormValidation.form.Form;
    const formValues = {
      FirstName: this.props.userdetails.firstname,
      LastName: this.props.userdetails.lastname,
      Email: this.props.userdetails.email,
      Role: (this.props.userdetails.isAdmin == "Yes") ? "admin" : (this.props.userdetails.isAgent == "Yes") ? "agent" : (this.props.userdetails.isSupervisor == "Yes") ? "supervisor" : "owner",
      Phone: this.props.userdetails.phone,
      City: this.props.userdetails.city,
      State: this.props.userdetails.state,
      Country: this.props.userdetails.country,
      DomainName: this.props.userdetails.website,
      CompanyName: this.props.userdetails.companyName,
    };
    return (
      <View
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
        <ScrollView
          automaticallyAdjustContentInsets={false}
          style={[AppStyles.container]}
          ref={(b) => { this.scrollView = b; }}
        >
          <Spacer size={55} />
          <Card>
            <Alerts
              status={this.state.resultMsg.status}
              success={this.props.profileSuccess}
              error={this.props.profileError}
            />

            <Form
              ref={(b) => { this.form = b; }}
              type={this.state.form_fields}
              value={formValues}
              options={this.state.options}
            />

            <Button
              title={'Save'}
              onPress={this.updateProfile}
            />

            <Spacer size={10} />

            <Button
              title={'Cancel'}
              onPress={() => {console.log("Caneclling");Actions.dashboard(); console.log("Caneclled");}}
            />

            <Spacer size={10} />

          </Card>
        </ScrollView>
      </View>
    );
  }
}

MyProfile.propTypes = {
  getuser: PropTypes.func,
};

const mapDispatchToProps = {
  getuser: UserActions.getuser,
  updateprofile: UserActions.updateprofile,
};

function mapStateToProps(state) {
  const { userdetails, profileSuccess, profileError } = state.user;

  return { userdetails, profileError, profileSuccess };
}

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);
