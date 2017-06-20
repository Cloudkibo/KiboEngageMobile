import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button } from '@ui/';
import React, { Component } from 'react';
import { View,ListView,ScrollView } from 'react-native';
import { List, ListItem, SocialIcon } from 'react-native-elements';
import FormValidation from 'tcomb-form-native';
import auth from '../../services/auth';
import * as NotificationActions from '@redux/notification/NotificationActions';
import { connect } from 'react-redux';
var _ = require('lodash');

class ResendNotification extends Component {
  static componentName = 'ResendNotification';

  constructor(props) {
    super(props);
    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',
      }};
    this.createDataSource(props.notifications);
}

/*componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    this.createDataSource(this.props.notification);
   
   /* if(nextProps.notifications){
      this.setState({loading:false});
       this.createDataSource(nextProps);
     }*/
  

   createDataSource(notifications) {
    const ds = new ListView.DataSource({

      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(notifications);
  }



componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.notifications){
      this.setState({loading:false});
       this.createDataSource(nextProps.notifications);
     }
  }



    /*const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;

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
*/
    

    /*this.state = {
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
        Title: '',
        Description: '',
      },
      form_values: {
        Title:this.props.notification.title,
        Description: this.props.notification.description,
      
      },
      options: {
        fields: {
          Title: {
            error: 'Please enter the title',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable : false,
          },
          Description: {
            error: 'Please enter short description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            editable : false,
            multiline: true,
            sstylesheet: stylesheet
          },
        },
      },
    };
  }
*/

 renderRow = (notification) => (
    <ListItem
      key={`list-row-${notification._id}`}
      //onPress={this.goToView2.bind(this,notification)}
      title={notification.title}
      subtitle={notification.description || null}

      
    />
    );
 
   resendNotification = async () => {
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

        if(auth.loggedIn() == true && this.props.notification){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
           
            var notification = this.props.notification;
            console.log(notification);
            this.props.resendNotification({notification,token});
     
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
        <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.notificationsuccess}
            error={this.props.notificationerror}
          />

<ScrollView
              automaticallyAdjustContentInsets={false}
              style={[AppStyles.container]}
            >
             <Spacer size={50} />
              <List>
                <ListView
                 dataSource={this.dataSource}
                 renderRow={this.renderRow}
                />
              </List>
              
            </ScrollView>


       

          <Button
            title={'Resend Notification'}
            onPress={this.resendNotification}
          />

          <Spacer size={10} />

        </Card>
      </View>
    );
  }
}

const mapDispatchToProps = {
  resendNotification: NotificationActions.resendNotification,
  
};
function mapStateToProps(state) {
   const { notifications,notificationerror,notificationsuccess} = state.notifications;
  
  return {notifications,notificationerror,notificationsuccess};

}
export default connect(mapStateToProps, mapDispatchToProps)(ResendNotification);


