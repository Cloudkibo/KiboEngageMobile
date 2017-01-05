import * as ActionTypes from '../actions/types'; 

const INITIAL_STATE = {
  teamname : '',
  description :'',
  loading: false,
  teamerror:[],

  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    case ActionTypes.REGISTER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
   
   case ActionTypes.CREATE_TEAM:
      return { ...state, loading: true, teamerror: [] };
    case ActionTypes.CREATE_TEAM_SUCCESS:
      return { ...state, ...INITIAL_STATE, teamerror: ['Team created successfully'] };
    case ActionTypes.CREATE_TEAM_FAIL:
      return { ...state, teamerror: ['Team creation failed'], teamname: '', description:'', loading: false };
    
    default:
      return state;
  }
};
