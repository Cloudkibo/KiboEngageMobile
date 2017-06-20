import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button } from '@ui/';
import * as FbActions from '@redux/facebook/FbActions';
import Loading from '@components/general/Loading';
import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import FormValidation from 'tcomb-form-native';
var _ = require('lodash');
import auth from '../../services/auth';

class EditFbPage extends Component {
  static componentName = 'AddFacebookPage';

  constructor(props) {
    super(props);

    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;

    const validName = FormValidation.refinement(
      FormValidation.String, (textval) => {
        if (textval.length < 1) return false;
        return true;
      },
    );

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      },
     // loading: true,
      form_fields: FormValidation.struct({
        pageId: validName,
        pageTitle: validName,
        pageDescription:validName,
        appId:validName,
        pageToken:validName
      }),
      empty_form_values: {
        pageId: '',
        pageTitle: '',
        pageDescription:'',
        appId:'',
        pageToken:'',
      },
      form_values: {
        pageId:this.props.fbpage.pageid,
        pageTitle: this.props.fbpage.pageTitle,
        pageDescription:this.props.fbpage.pageDescription,
        appId:this.props.fbpage.appid,
        pageToken:this.props.fbpage.pageToken,
      },
      options: {
        fields: {
          pageId: {
            error: 'Please enter the page id',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            placeholder: 'Enter Page ID',
            editable: false,

          },
          pageTitle: {
            error: 'Please enter page title',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            placeholder: 'Enter Page Title'

          },
           pageDescription: {
            error: 'Please enter short page description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            placeholder: 'Enter Page Description',
            multiline: true,
            stylesheet,
          },
          appId: {
            error: 'Please enter the app id',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            placeholder: 'Enter APP ID'
          },

          pageToken: {
            error: 'Please enter page token',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
             placeholder: 'Enter Page Token'
          },
        },
      },
    };
  }

  componentDidMount = async () => {
    console.log("Component Did Mount in FB EDIT PAGES called");
    this.props.resetFbStatus();
    console.log("Component Did Mount in FB EDIT PAGES Status was reset");
    const token = await auth.getToken();
    console.log(`token is Launchview is ${token}`);
    if (token !== '') {
      this.props.getfbpages(token);
    }
  }

  deletePage = () => {

    Alert.alert(
            'Delete Page',
            'Are you sure you want to delete this page?',
      [
          { text: 'No', onPress: () => console.log('Cancel Pressed!') },
          { text: 'Yes', onPress: () => this.deletePageConfirm() },
      ],
    );
  };

  deletePageConfirm = async () => {
    // Form is valid
    this.setState({ resultMsg: { status: 'One moment...' } });

    // Scroll to top, to show message
    if (this.scrollView) {
      this.scrollView.scrollTo({ y: 0 });
    }

    if (auth.loggedIn() === true) {
      console.log('auth.loggedIn() return true');
      const token = await auth.getToken();
      console.log(this.props.fbpage);
      this.props.deletefbpage({
        id: this.props.fbpage.pageid,
        token,
      });
    }
  };

  addFbPage = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, async () => {
        this.setState({ resultMsg: { status: 'Updating facebook page details...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if (auth.loggedIn() === true) {
          console.log('auth.loggedIn() return true');
          const token = await auth.getToken();
          console.log(token);
          const usertoken = auth.getToken();
          const pageTitle = credentials.pageTitle;
          const pageDescription = credentials.pageDescription;
          const pageToken = credentials.pageToken;
          const appid = credentials.appId;
          var companyid = this.props.userdetails.uniqueid;
          const pageid = credentials.pageId;
          if (pageToken && pageid)
           {
             this.props.editPage({pageid,appid,pageToken,pageTitle,pageDescription,companyid},token);

          }

        }
      });
    }
  }

  render = () => {
    const Form = FormValidation.form.Form;
    return (
      <ScrollView style={[AppStyles.container]}
        ref={(b) => { this.scrollView = b; }}
      >

        <Spacer size={55} />

        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.fbpagesuccess}
            error={this.props.fbpageerror}
          />

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          {this.props.userdetails.isAgent=="No" &&
          <View>
          <Button
            title={'Save'}
            onPress={this.addFbPage}
          />


          <Spacer size={10} />

          <Button
            title={'Delete Page'}
            onPress={this.deletePage}
          />
          </View>
        }

          <Spacer size={10} />

        </Card>
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
   const {fbpageerror,fbpagesuccess} =  state.fbpages;
   const { userdetails} = state.user;
  return {fbpageerror,fbpagesuccess,userdetails};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  editPage: FbActions.editPage,
  resetFbStatus: FbActions.resetFbStatus,
  getfbpages: FbActions.getfbpages,
  deletefbpage: FbActions.deletefbpage,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditFbPage);
