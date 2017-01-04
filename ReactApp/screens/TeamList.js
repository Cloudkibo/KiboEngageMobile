import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView ,View} from 'react-native';
import { teamFetch } from '../actions';
import ListItem from '../components/ListItem';
import Button from '../components/button'
import CreateTeam from './CreateTeam';

import AppStyles from '../styles'
import AppConfig from '../config'
import AppUtil from '../util'

class TeamList extends Component {
  static componentName = 'Teams';
  static propTypes = {
    navigator: React.PropTypes.object.isRequired,
  }
  componentWillMount() {
    this.props.teamFetch();
    this.createDataSource(this.props);
  
  }

 
  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log('componentWillReceiveProps is called');
    console.log(nextProps);
    if(nextProps.teams){
       this.createDataSource(nextProps);
     }
  }

  createDataSource({ teams }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.dataSource = ds.cloneWithRows(teams);
  }

  renderRow(team) {
    return <ListItem team={team} />;
  }

  onButtonPress() {
    this.props.navigator.push({
            title: 'Create Team',
            component: CreateTeam,
            index: 2           
          });
      
  }

  render() {
    return (
      <View style={[AppStyles.container]}>
       <Button type={'outlined'}
          text={'Create Team'} onPress={this.onButtonPress.bind(this)}/>
              
        
      <ListView
        enableEmptySections
        dataSource={this.dataSource}
        renderRow={this.renderRow}
      />
     </View>
    );
  

  }
}


function mapStateToProps(state) {
   const { teams } = state.auth;

  return {teams };

}
export default connect(mapStateToProps, { teamFetch })(TeamList);
