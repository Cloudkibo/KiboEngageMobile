/**
 * Login Screen
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  View,
  ListView,
  Alert,

} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../../services/auth';
import { List, ListItem, SocialIcon } from 'react-native-elements';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes} from '@theme/';
import * as TeamActions from '@redux/team/TeamActions';
import { connect } from 'react-redux';
var _ = require('lodash');

// Components
import { Alerts, Card, Spacer, Text, Button } from '@components/ui/';

/* Component ==================================================================== */
class EditTeam extends Component {
  static componentName = 'EditTeam';

  constructor(props) {
    super(props);
    console.log('edit team is called');
    console.log(this.props.team);
    const stylesheet = _.cloneDeep(FormValidation.form.Form.stylesheet);

    // overriding the text color
    stylesheet.textbox.normal.height = 80;
    stylesheet.textbox.error.height = 80;
    var Status = FormValidation.enums({
              public: 'Public',
              private: 'Private'
            });

    const validName= FormValidation.refinement(
      FormValidation.String, (teamname) => {
        if (teamname.length < 1) return false;
        return true;
      },
    );

    const validDesc= FormValidation.refinement(
      FormValidation.String, (teamdesc) => {
        if (teamdesc.length < 1) return false;
        return true;
      },
    );

    this.newFellowAgents  = []
    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',

      },
      dataSourceAllAgents  : new ListView.DataSource({
            rowHasChanged : (row1, row2) => true
        }),
      dataSourceFellowAgents  : new ListView.DataSource({
            rowHasChanged : (row1, row2) => true
        }),


      form_fields: FormValidation.struct({
        teamName:validName,
        teamDescription: validDesc,
        status:Status,
      }),
      empty_form_values: {
        teamName:'',
        teamDescription: '',

      },
      form_values: {
        teamName:this.props.team.groupname,
        teamDescription: this.props.team.groupdescription,
        status:this.props.team.status,

      },
      options: {
        fields: {
          teamName: {
            error: 'Please enter team name',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
          },
          teamDescription: {
            error: 'Please enter short team description',
            autoCapitalize: 'none',
            clearButtonMode: 'while-editing',
            multiline: true,
            stylesheet: stylesheet
          },
          status:{
            nullOption:false,
          }

        },
      },
    };





  }

  componentDidMount =  () => {
    // Get user data from AsyncStorage to populate fields

      console.log("Fellow", this.props.fellow);
      this.newFellowAgents  = this.props.teamagents.filter((c) => c._id == this.props.team._id)

      let ds = this.state.dataSourceAllAgents.cloneWithRows(this.props.agents);
      let ds2 = this.state.dataSourceFellowAgents.cloneWithRows(this.props.fellow);

      console.log('dataSourceAllAgents');
      console.log(this.state.dataSourceAllAgents);
      console.log("This team fellowAgent agents", this.newFellowAgents);
      console.log("This team fellowAgent agents", this.props.teamagents);
    console.log(ds);
    console.log(ds2);

      this.setState({

          dataSourceAllAgents  : ds,
          dataSourceFellowAgents  : ds2,

      });

      
  }

  /**
    * Create Team
    */
  renderRow = (agent) => (
    <ListItem
      key={`list-row-${agent._id}`}
      onPress={this.addAgent.bind(this,agent)}
      title={agent.firstname + ' '+ agent.lastname}
      leftIcon={{ name: 'add-circle' }}
    />
    )
  editTeam = async () => {
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

            var agentid =[];
            console.log('this.newFellowAgents');
            console.log(this.newFellowAgents);
            for(var j=0;j<this.newFellowAgents.length;j++){
               agentid.push({"_id" :this.newFellowAgents[j].agentid})
            }

            this.props.editteam({
              name :credentials.teamName,
              desc:credentials.teamDescription,
              status : credentials.status,
              id:this.props.team._id,
              token:token,
              teamagents: agentid
            });

        }
      });
    }
  }



  addAgent = (c) =>{
    console.log('addAgent is called');
    this.newFellowAgents.push({'teamid': this.props.team._id,'agentid': c._id})
    // update the DataSource in the component state


   this.setState({
            form_values: this.state.form_values,
            dataSourceFellowAgents  : this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents)
        });
  }


  removeAgent = (c) =>{
    console.log('removeAgent is called');
    var indexOfItem = this.newFellowAgents.findIndex((item) => item.teamid === c.teamid && item.agentid === c.agentid);
    this.newFellowAgents.splice(indexOfItem, 1);
    // update the DataSource in the component state
   this.setState({
            form_values: this.state.form_values,
            dataSourceFellowAgents  : this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents)
        });
  }
  renderFellowAgents = (fellowAgent) =>{
      console.log("Render Team Agents", this.props.teamagents);
      console.log("Render All Agents", this.props.agents);
      console.log("Render All fellowAgents", this.newFellowAgents);
      console.log("This team", this.props.team);
      var name = "Test";
    //   for(var j=0; j < this.newFellowAgents.length; j++){
    //     if(fellowAgent.agentid==this.newFellowAgents[j].agentid){
          
    // // Alert.alert(
    // //         'Already Added',
    // //         'Please select a different agent',

    // //         [{
    // //           text: 'Dismiss',
    // //           onPress: null,
    // //         }]
    // //       );
    //       return null;
    //     } 
    //   }

      for(var i=0; i < this.props.agents.length; i++){
        if(fellowAgent.agentid == this.props.agents[i]._id){
          name = this.props.agents[i].firstname + " " + this.props.agents[i].lastname;
          break;
        }
      }
     return(
      <ListItem
      key={`list-row-${fellowAgent.agentid}`}
              title={name}
              leftIcon={{ name: 'remove-circle' }}
              onPress={this.removeAgent.bind(this,fellowAgent)}
              /> 
    );

  }

  confirmDelete = async() => {
    // Form is valid
        this.setState({ resultMsg: { status: 'Deleting team...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
            this.setState({ resultMsg: { status: 'Team Deleted successfully' } });
            this.props.deleteteam({
              id:this.props.team._id,
              token:token,
            })
        }
  }

  deleteTeam = () => {

    Alert.alert(
            'Delete Team',
            'Are you sure you want to delete this team?',
            [
              {text: 'No', onPress: () => console.log('Cancel Pressed!')},
              {text: 'Yes', onPress: () => this.confirmDelete()},
            ]
          )



  }


  render = () => {
    const Form = FormValidation.form.Form;
    console.log("Form values", this.state.form_values);

    return (
      <ScrollView
        style={[AppStyles.container]}
        ref={(b) => { this.scrollView = b; }}
      >
      <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.teamsuccess}
            error={this.props.teamerror}
          />


          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />


           <Spacer size={20} />
            <View>
            <Text h3> Fellow Agents </Text>
             <ListView dataSource={this.state.dataSourceFellowAgents}
              renderRow={this.renderFellowAgents}
            />

          </View>

         <View>
            <Text h3> All Agents </Text>
            <ListView
                 dataSource={this.state.dataSourceAllAgents}
                 renderRow={this.renderRow}
            />
          </View>


           <Spacer size={20} />
          <Button
            title={'Save Changes'}
            onPress={this.editTeam}
          />
           <Spacer size={20} />

          <Button
            title={'Delete Team'}
            onPress={this.deleteTeam}
          />

          <Spacer size={10} />


        </Card>
       </ScrollView>
    );
  }
}


function mapStateToProps(state) {
   const {teams,teamerror,teamsuccess} =  state.teams;

  return {teams,teamerror,teamsuccess};
}


// Any actions to map to the component?
const mapDispatchToProps = {
  editteam: TeamActions.editteam,
  deleteteam: TeamActions.deleteteam,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTeam);
