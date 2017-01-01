import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ListView } from 'react-native';
import { teamFetch } from '../actions';
import ListItem from './ListItem';

class TeamList extends Component {
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

  render() {
    return (
      <ListView
        enableEmptySections
        dataSource={this.dataSource}
        renderRow={this.renderRow}
      />
   
    );
  

  }
}


function mapStateToProps(state) {
   const { teams } = state.auth;

  return {teams };

}
export default connect(mapStateToProps, { teamFetch })(TeamList);
