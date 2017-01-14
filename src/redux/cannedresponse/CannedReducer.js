import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  cannedresponses:[],
 cannederror:'',
 cannedsuccess:'',
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    
    case ActionTypes.ADD_CANNED_RESPONSES:
      return {...state,cannedresponses:action.payload,teamerror: '',teamsuccess:''};

    case ActionTypes.CREATE_CANNED:
      return { ...state, loading: true, cannederror: '',cannedsuccess:'' };
    case ActionTypes.CREATE_CANNED_SUCCESS:
      return { ...state, ...INITIAL_STATE,cannedresponses : state.cannedresponses,cannederror: '', cannedsuccess: 'Canned Response created successfully' };
    case ActionTypes.CREATE_CANNED_FAIL:
      return { ...state, cannedresponses : state.cannedresponses,cannederror: 'Canned Response creation failed', cannedsuccess:'' ,loading: false };


    case ActionTypes.EDIT_CANNED:
      return { ...state, cannedresponses : state.cannedresponses,loading: true, cannederror: '',cannedsuccess:'' };
    case ActionTypes.EDIT_CANNED_SUCCESS:
      return { ...state, ...INITIAL_STATE,cannedresponses : state.cannedresponses,cannederror: '', cannedsuccess: 'Canned Response updated successfully' };
    case ActionTypes.EDIT_CANNED_FAIL:
      return { ...state, cannedresponses : state.cannedresponses,cannederror: 'Canned Response update failed', cannedsuccess:'' ,loading: false };
    

    case ActionTypes.DELETE_CANNED_SUCCESS:
      return { ...state, ...INITIAL_STATE,cannedresponses : state.cannedresponses,cannederror: '', cannedsuccess: 'Canned Response deleted successfully' };
    case ActionTypes.DELETE_CANNED_FAIL:
      return { ...state, cannedresponses : state.cannedresponses,cannederror: 'Canned Response deletion failed', cannedsuccess:'' ,loading: false };
    
    default:
      return state;
  }
};
