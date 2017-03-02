import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  fbpages:[],
 fbpagesuccess:'',
 fbpageerror:'',
 fbcustomers:[],
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    case ActionTypes.CREATE_FBPAGE_SUCCESS:
      return { ...state, ...INITIAL_STATE,fbpages : state.fbpages,fbpageerror: '', fbpagesuccess: 'Page details added successfully' };
    case ActionTypes.CREATE_FBPAGE_SUCCESS:
      return { ...state, fbpages : state.fbpages,fbpageerror: 'There is an error occurred. Please try later', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_FB_CUSTOMERS:
      return { ...state, fbpages : state.fbpages,fbcustomers:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    default:
      return state;
  }
};
