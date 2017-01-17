import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button } from '@ui/';
import React, { Component } from 'react';
import { View } from 'react-native';
import FormValidation from 'tcomb-form-native';
import auth from '../../services/auth';
import * as NotificationActions from '@redux/notification/NotificationActions';
import * as CustomerActions from '@redux/customer/CustomerActions';
import Loading from '@components/general/Loading';
import { connect } from 'react-redux';

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
      loading : true,
      form_fields: FormValidation.struct({
        Title: validName,
        Description: validDesc,
      }),
      empty_form_values: {
        Title: '',
        Description: '',
      },
      form_values: {},
      options: {
        fields: {
          Title: {
            error: 'Please enter the title',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          Description: {
            error: 'Please enter short description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
        },
      },
    };
  }


  componentDidMount = async() => {
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
      if(token != ''){
     
            this.props.customerFetch(token);
         
            
          }
  
  }
  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.customers){
      this.setState({loading:false});
      
     }
  }

   addNotification = async () => {
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

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
            
            var today = new Date();
            var uid = Math.random().toString(36).substring(7);
            var unique_id = 'h' + uid + '' + today.getFullYear() + '' + (today.getMonth()+1) + '' + today.getDate() + '' + today.getHours() + '' + today.getMinutes() + '' + today.getSeconds();

            var notification = {'uniqueid' : unique_id,'title' : credentials.Title,'description':credentials.Description,'companyid' : this.props.userdetails.uniqueid,'agent_id' : this.props.userdetails._id,'hasImage' : 'false'};
            var customers = this.props.customers;
            console.log(notification);
            this.props.createNotification({notification,token,customers});
     
        }
      });
    }
  }
  render = () => {
    const Form = FormValidation.form.Form;
    if (this.state.loading) return <Loading />;
    
    return (
      <View
        style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}
      >
        <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.notificationsuccess}
            error={this.props.notificationerror}
          />

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />

          <Button
            title={'Add Notification'}
            onPress={this.addNotification}
          />

          <Spacer size={10} />

        </Card>
      </View>
    );
  }
}

const mapDispatchToProps = {
  customerFetch: CustomerActions.customerFetch,
  createNotification : NotificationActions.createNotification,
 
};
function mapStateToProps(state) {
   const { notifications,notificationerror,notificationsuccess} = state.notifications;
   const {customers} = state.customers;
    const { userdetails} = state.user;
  
  return {notifications,userdetails,notificationerror,notificationsuccess,customers};

}
export default connect(mapStateToProps, mapDispatchToProps)(AddNotification);


