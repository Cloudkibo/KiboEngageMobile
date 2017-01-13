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
  ListView
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../../services/auth';
import { List, ListItem, SocialIcon } from 'react-native-elements';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles } from '@theme/';
import * as TeamActions from '@redux/team/teamActions';
import { connect } from 'react-redux';


// Components
import { Alerts, Card, Spacer, Text, Button } from '@components/ui/';

/* Component ==================================================================== */
class EditTeam extends Component {
  static componentName = 'EditTeam';

 
  constructor(props) {
    super(props);
    console.log('edit team is called');
    console.log(this.props.team);
    this.ds = new ListView.DataSource({
  
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.ds2 = new ListView.DataSource({
  
      rowHasChanged: (r1, r2) => r1 !== r2
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

    this.state = {
      resultMsg: {
        status: '',
        success: '',
        error: '',

      },
      dataSource  : this.ds.cloneWithRows(this.props.agents),
      dataSource2 : this.ds2.cloneWithRows(this.props.teamagents),
      newagents : [],
      form_fields: FormValidation.struct({
        teamName:validName,
        teamDescription: validDesc,
      }),
      empty_form_values: {
        teamName:'',
        teamDescription: '',
      
      },
      form_values: {
        teamName:this.props.team.deptname,
        teamDescription: this.props.team.deptdescription,
      
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
          },
          
        },
      },
    };
  }

  componentDidMount = async () => {
    // Get user data from AsyncStorage to populate fields
  /*  const values = await AsyncStorage.getItem('api/credentials');
    const jsonValues = JSON.parse(values);

    if (values !== null) {
      this.setState({
        form_values: {
          Domain: jsonValues.domain,
          Email: jsonValues.username,
          Password: jsonValues.password,

        },
      });
    }*/
  }

  /**
    * Create Team
    */
   renderRow = (agent) => (
    <ListItem
      key={`list-row-${agent._id}`}
      onPress={this.addAgent.bind(this,agent)}
      title={agent.firstname + ' '+ agent.lastname}
  
      
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
      if(this.props.teamagents)
      {
      this.props.teamagents.filter((agent) => agent.deptid == this.props.team._id).map((agent, i)=> (
                          this.props.agents.filter((ag) => ag._id == agent.agentid).map((ag,j) =>
                          (
                             agentid.push({"_id" :ag._id})
                          ))
                          ));
       };
            this.props.editteam({
              name: credentials.teamName,
              desc: credentials.teamDescription,
              id : this.props.team._id,
              deptagents : agentid,
              token:token,
            })
        }
      });
    }
  }
  
  deleteTeam = async () => {
    // Form is valid
        this.setState({ resultMsg: { status: 'One moment...' } });

        // Scroll to top, to show message
        if (this.scrollView) {
          this.scrollView.scrollTo({ y: 0 });
        }

        if(auth.loggedIn() == true){
            console.log('auth.loggedIn() return true');
            var token = await auth.getToken();
            console.log(token);
   
            this.props.deleteteam({
              id:this.props.team._id,
              token:token,
            })
        }
     
  }
  
  addAgent = (c) =>{
    console.log('addAgent is called');
    console.log(this.props.teamagents.length);
    this.props.teamagents.push({'deptid': this.props.team._id,'agentid':c._id});
    console.log(this.props.teamagents.length);
   
    // update the DataSource in the component state
    this.setState({
        dataSource2 : this.ds.cloneWithRows(this.props.teamagents),
    });
  }
  renderFellowAgents = (fellowAgent) =>{
    if(fellowAgent.deptid == this.props.team._id){

       for(var j=0;j<this.props.agents.length;j++){
        if(this.props.agents[j]._id == fellowAgent.agentid){
                return  (<ListItem
                          key={`list-row-${this.props.agents[j]._id}`}
                          title={this.props.agents[j].firstname + ' '+ this.props.agents[j].lastname}
                          /> )
        break;
        }

        else{
          return null;
        }
       } 
    }

     else{
          return null;
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
            success={this.state.resultMsg.success}
            error={this.state.resultMsg.error}
          />

          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />


          <View>
            <Text h3> Fellow Agents </Text>
             <ListView dataSource={this.state.dataSource2}
              renderRow={this.renderFellowAgents}
            />
           
          </View>

           <Spacer size={20} />
           <View>
            <Text h3> All Agents </Text>
            <ListView
                 dataSource={this.state.dataSource}
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

           <Alerts
           
            success={this.props.teameditsuccess}
            error={this.props.teamediterror}
          />
        </Card>
      </View>
    );
  }
}


function mapStateToProps(state) {
   const {teams,teamediterror,teameditsuccess} =  state.teams;
  
  return {teams,teamediterror,teameditsuccess };
}


// Any actions to map to the component?
const mapDispatchToProps = {
  editteam: TeamActions.editteam,
  deleteteam: TeamActions.deleteteam,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTeam);

