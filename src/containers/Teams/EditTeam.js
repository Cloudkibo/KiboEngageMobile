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
  
} from 'react-native';
import FormValidation from 'tcomb-form-native';
import { Actions } from 'react-native-router-flux';
import auth from '../../services/auth';
import { List, ListItem, SocialIcon } from 'react-native-elements';

// Consts and Libs
import AppAPI from '@lib/api';
import { AppStyles, AppSizes} from '@theme/';
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

  componentDidMount =  () => {
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
      
      this.newFellowAgents  = this.props.teamagents.filter((c) => c.deptid == this.props.team._id)
      
      let ds = this.state.dataSourceAllAgents.cloneWithRows(this.props.agents);
      let ds2 = this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents);

      this.setState({
          dataSourceAllAgents  : ds,
          dataSourceFellowAgents  : ds2,

      });

      console.log('dataSourceAllAgents');
      console.log(this.state.dataSourceAllAgents);
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
            console.log('this.newFellowAgents');
            console.log(this.newFellowAgents);
            for(var j=0;j<this.newFellowAgents.length;j++){
               agentid.push({"_id" :this.newFellowAgents[j].agentid})
            }
            console.log('teamDescription');
            console.log(credentials.teamDescription);
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
    this.newFellowAgents.push({'deptid': this.props.team._id,'agentid':c._id})
    // update the DataSource in the component state
   this.setState({
          
            dataSourceFellowAgents  : this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents)
        });
  }


  removeAgent = (c) =>{
    console.log('removeAgent is called');
    var indexOfItem = this.newFellowAgents.findIndex((item) => item.deptid === c.deptid && item.agentid === c.agentid);
    this.newFellowAgents.splice(indexOfItem, 1);
    // update the DataSource in the component state
   this.setState({
          
            dataSourceFellowAgents  : this.state.dataSourceFellowAgents.cloneWithRows(this.newFellowAgents)
        });
  }
  renderFellowAgents = (fellowAgent) =>{
   console.log('fellowAgent');
   console.log(fellowAgent);
   var flag = 0;
   for(var j=0;j<this.props.agents.length;j++){
        if(this.props.agents[j]._id == fellowAgent.agentid){
          console.log('fellowAgent matched');
                return  (<ListItem
                          key={`list-row-${this.props.agents[j]._id}`}
                          title={this.props.agents[j].firstname + ' '+ this.props.agents[j].lastname}
                           onPress={this.removeAgent.bind(this,fellowAgent)}
                          /> )
        flag = 1;
        break;
        }

     
       }
       if(flag == 0){
        return null;
       }

    
  }

 

  render = () => {
    const Form = FormValidation.form.Form;

    return (
      <ScrollView style={[AppStyles.container]}>
      <Spacer size={55} />
        <Card>
          <Alerts
            status={this.state.resultMsg.status}
            success={this.props.teameditsuccess}
            error={this.props.teamediterror}
          />

  
          <Form
            ref={(b) => { this.form = b; }}
            type={this.state.form_fields}
            value={this.state.form_values}
            options={this.state.options}
          />


          <View>
            <Text h3> All Agents </Text>
            <ListView
                 dataSource={this.state.dataSourceAllAgents}
                 renderRow={this.renderRow}
            />
          </View>

          <View>
            <Text h3> Fellow Agents </Text>
             <ListView dataSource={this.state.dataSourceFellowAgents}
              renderRow={this.renderFellowAgents}
            />
           
          </View>

           <Spacer size={20} />
         

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
   const {teams,teamediterror,teameditsuccess} =  state.teams;
  
  return {teams,teamediterror,teameditsuccess };
}


// Any actions to map to the component?
const mapDispatchToProps = {
  editteam: TeamActions.editteam,
  deleteteam: TeamActions.deleteteam,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTeam);
