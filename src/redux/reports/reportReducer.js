import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  country: [],
  page: [],
  agent: [],
  team: [],
  notification: [],
  channel: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
   case ActionTypes.FETCH_COUNTRY_STATS:
      return {...state,country:action.payload};

   case ActionTypes.FETCH_PAGE_STATS:
      return {...state,page:action.payload};
  case ActionTypes.FETCH_AGENT_STATS:
      return {...state,agent:action.payload};
  case ActionTypes.FETCH_TEAM_STATS:
      return {...state,team:action.payload};
  case ActionTypes.FETCH_NOTIFICATION_STATS:
      return {...state,notification:action.payload};
  case ActionTypes.FETCH_CHANNEL_STATS:
      return {...state,channel:action.payload};
   
    default:
      return state;
  }
};
