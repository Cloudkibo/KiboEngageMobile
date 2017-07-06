import { AppStyles } from '@theme/';
import { Alerts, Card, Spacer, Button, Text } from '@ui/';
import * as FbActions from '@redux/facebook/FbActions';
import Loading from '@components/general/Loading';
import React, { Component } from 'react';
import { View,ScrollView, ListView } from 'react-native';
import { connect } from 'react-redux';
import FormValidation from 'tcomb-form-native';
var _ = require('lodash');
import auth from '../../services/auth';
import * as TeamActions from '@redux/team/TeamActions';
import * as AgentActions from '@redux/agents/agentActions';
import { ListItem } from 'react-native-elements';
class AddFbPage extends Component {
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
      newteams: [],
      dataSourceAllTeams: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true
      }),
      dataSourceFellowTeams: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true
      }),
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
        appID:'',
        pageToken:'',
      },
      form_values: {},
      options: {
        fields: {
          pageId: {
            error: 'Please enter the page id',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            placeholder: 'Enter Page ID'
           
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

     this.renderRow = this.renderRow.bind(this);
    this.renderRowFellowTeams = this.renderRowFellowTeams.bind(this);
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.teams) {
      console.log("Fb teams", this.props.fbteams);
      console.log("New Teams", this.state.newteams);
      const ds = this.state.dataSourceAllTeams.cloneWithRows(nextProps.teams);
      const ds2 = this.state.dataSourceFellowTeams.cloneWithRows(this.state.newteams);
      this.setState({
        dataSourceAllTeams: ds,
        dataSourceFellowTeams: ds2,
      });
    }
  }

   componentDidMount = async() => {
    console.log('team component did mount called');
     var token =  await auth.getToken();
      console.log('token is Launchview is: ' + token);
       const fbpageTeams = this.props.fbteams.filter((c) => c.pageid._id == this.props.fbpage._id);
    console.log()
    for (let i = 0; i < fbpageTeams.length; i++) {
      if (fbpageTeams[i].teamid) {
        this.state.newteams.push(fbpageTeams[i].teamid);
      }
    }
      if(token !== ''){
          this.props.getfbpages(token);
            this.props.teamFetch(token);
          }

  }
 
    renderRow = team => (
    <ListItem
      key={`list-row-${team._id}`}
      onPress={this.appendTeam.bind(this, team)}
      title={team.groupname}
      leftIcon={{ name: 'add-circle' }}
    />
  )

  renderRowFellowTeams = team => (
    <ListItem
      key={`list-row-${team._id}`}
      title={team.groupname}
      leftIcon={{ name: 'remove-circle' }}
      onPress={this.removeTeam.bind(this, team)}
    />
  )


   appendTeam(team) {
    let flag = 0;
    for (let i = 0; i < this.state.newteams.length; i++) {
      if (this.state.newteams[i]._id == team._id) {
          flag = 1;
          break;
      }
    }
    if (flag == 0) {
      this.state.newteams.push(team);
      const ds2 = this.state.dataSourceFellowTeams.cloneWithRows(this.state.newteams);
      this.setState({
        form_values: this.state.form_values,
        dataSourceFellowTeams: ds2,
      });
    }
    else {
      Alert.alert(
        'Add Team',
        'Team already added in the group',
        [
          { text: 'Ok', onPress: () => console.log('Ok Pressed!') },
        ],
      );
    }
  }

  removeTeam(team) {
    let index;

    for (let i = 0; i < this.state.newteams.length; i++) {
      if (this.state.newteams[i]._id == team._id) {
        index = i;
        break;
      }
    }
    this.state.newteams.splice(index, 1);
    const ds2 = this.state.dataSourceFellowTeams.cloneWithRows(this.state.newteams);
    this.setState({
      form_values: this.state.form_values,
      dataSourceFellowTeams: ds2,
    });
  }

  addFbPage = async () => {
    // Get new credentials and update
    const credentials = this.form.getValue();

    // Form is valid
    if (credentials) {
      this.setState({ form_values: credentials }, async () => {
        this.setState({ resultMsg: { status: 'Adding facebook page details...' } });

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
             this.props.createPage({pageid,appid,pageToken,pageTitle,pageDescription,companyid},token);
           
          }
          
        }
      });
    }


  }
  render = () => {
    const Form = FormValidation.form.Form;
    return (
      <View
      style={[AppStyles.container]}
        contentContainerStyle={[AppStyles.container]}>
        <Spacer size={55} />
      <ScrollView>
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

          <View>
            <Text h3> Fellow Teams </Text>
            <ListView
              dataSource={this.state.dataSourceFellowTeams}
              renderRow={this.renderRowFellowTeams}
            />
          </View>

          <View>
            <Text h3> All Teams </Text>
            <ListView
              dataSource={this.state.dataSourceAllTeams}
              renderRow={this.renderRow}
            />

          </View>

           <Spacer size={20} />
         

           <Spacer size={20} />


          <Button
            title={'Submit'}
            onPress={this.addFbPage}
          />

          <Spacer size={10} />

        </Card>
      </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
   const {fbpageerror,fbpagesuccess, fbteams} =  state.fbpages;
   const { userdetails} = state.user;
    const { teams } = state.teams;
  return {fbpageerror,fbpagesuccess,userdetails, teams, fbteams};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  createPage: FbActions.createPage,
   teamFetch: TeamActions.teamFetch,
  agentTeamFetch : TeamActions.agentTeamFetch,
  getfbpages: FbActions.getfbpages,

};

export default connect(mapStateToProps, mapDispatchToProps)(AddFbPage);
