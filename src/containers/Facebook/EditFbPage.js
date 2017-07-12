import { AppStyles } from '@theme/';
import { Alerts, Card, Text, Spacer, Button } from '@ui/';
import * as FbActions from '@redux/facebook/FbActions';
import * as TeamActions from '@redux/team/TeamActions';
import { ListItem } from 'react-native-elements';
import Loading from '@components/general/Loading';
import React, { Component } from 'react';
import { View, ScrollView, Alert, ListView } from 'react-native';
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
      newteams: [],
      dataSourceAllTeams: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true
      }),
      dataSourceFellowTeams: new ListView.DataSource({
        rowHasChanged: (row1, row2) => true
      }),
      form_fields: FormValidation.struct({
        pageId: validName,
        pageTitle: validName,
        pageDescription: validName,
        appId: validName,
        pageToken: validName
      }),
      empty_form_values: {
        pageId: '',
        pageTitle: '',
        pageDescription: '',
        appId: '',
        pageToken: '',
      },
      form_values: {
        pageId: this.props.fbpage.pageid,
        pageTitle: this.props.fbpage.pageTitle,
        pageDescription: this.props.fbpage.pageDescription,
        appId: this.props.fbpage.appid,
        pageToken: this.props.fbpage.pageToken,
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
    this.renderRow = this.renderRow.bind(this);
    this.renderRowFellowTeams = this.renderRowFellowTeams.bind(this);
  }

  componentDidMount = async () => {
    console.log("Component Did Mount in FB EDIT PAGES called");
    this.props.resetFbStatus();
    console.log("Component Did Mount in FB EDIT PAGES Status was reset");
    const token = await auth.getToken();
    console.log(`token is Launchview is ${token}`);
    if (token !== '') {
      //this.props.getfbpages(token);
      this.props.teamFetch(token);
    }
    const fbpageTeams = this.props.fbteams.filter((c) => c.pageid._id == this.props.fbpage._id);
    for (let i = 0; i < fbpageTeams.length; i++) {
      if (fbpageTeams[i].teamid) {
        this.state.newteams.push(fbpageTeams[i].teamid);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.teams) {
      console.log(this.props.fbteams);
      console.log(this.state.newteams);
      const ds = this.state.dataSourceAllTeams.cloneWithRows(nextProps.teams);
      const ds2 = this.state.dataSourceFellowTeams.cloneWithRows(this.state.newteams);
      this.setState({
        dataSourceAllTeams: ds,
        dataSourceFellowTeams: ds2,
      });
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
        form_values: {
          pageId: this.form.getValue().pageId,
          pageTitle: this.form.getValue().pageTitle,
          pageDescription: this.form.getValue().pageDescription,
          appId: this.form.getValue().appId,
          pageToken: this.form.getValue().pageToken,
        },
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
      form_values: {
        pageId: this.form.getValue().pageId,
        pageTitle: this.form.getValue().pageTitle,
        pageDescription: this.form.getValue().pageDescription,
        appId: this.form.getValue().appId,
        pageToken: this.form.getValue().pageToken,
      },
      dataSourceFellowTeams: ds2,
    });
  }

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
          const pageTitle = credentials.pageTitle;
          const pageDescription = credentials.pageDescription;
          const pageToken = credentials.pageToken;
          const appid = credentials.appId;
          const companyid = this.props.userdetails.uniqueid;
          const pageid = credentials.pageId;
          const _id = this.props.fbpage._id;
          let pageTeams = [];
          for (let i = 0; i < this.state.newteams.length; i++) {
            pageTeams.push({"_id":this.state.newteams[i]._id});
          }
          if (pageToken && pageid) {
             this.props.editPage({ _id, pageid, appid, pageToken, pageTitle, pageDescription, companyid }, token, pageTeams);
          }
        }
      });
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
  const { fbpageerror, fbpagesuccess, fbteams,fbpages } = state.fbpages;
  const { userdetails } = state.user;
  const { teams } = state.teams;
  return { fbpageerror, fbpagesuccess, userdetails, fbteams, teams,fbpages };
}


// Any actions to map to the component?
const mapDispatchToProps = {
  editPage: FbActions.editPage,
  resetFbStatus: FbActions.resetFbStatus,
  getfbpages: FbActions.getfbpages,
  deletefbpage: FbActions.deletefbpage,
  fetchfbpageteams: FbActions.fetchfbpageteams,
  teamFetch: TeamActions.teamFetch,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditFbPage);
