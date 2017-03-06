import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  fbpages:[],
 fbpagesuccess:'',
 fbpageerror:'',
 fbcustomers:[],
  
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
   
    case ActionTypes.FBPAGE_SUCCESS:
      return { ...state,fbpageerror: '', fbpagesuccess: action.payload };
    case ActionTypes.FBPAGE_FAIL:
      return { ...state,fbpageerror: 'There is an error occurred. Please try later', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_FB_CUSTOMERS:
      return { ...state,fbcustomers:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_FB_CHATS:
    return { ...state,fbchats:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_FB_SELECTEDCHATS:
    return { ...state,fbchatSelected:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    case ActionTypes.SHOW_FB_CHATS_UPDATED:
    return { ...state,fbchatSelected:action.fbchatSelected,fbchats:action.payload,fbpageerror: '', fbpagesuccess:'' ,loading: false };

    default:
      return state;
  }
};
