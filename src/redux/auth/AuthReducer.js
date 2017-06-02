import * as ActionTypes from '../types'; 

const INITIAL_STATE = {
  email: '',
  password: '',
  domain:'',
  user: null,
  error: '',
  errorSignup :[],
  loading: false,
  fname:'',
  lname:'',
  phone:'',
  cpassword:'',
  cname:'',
  teams:[],
  login_status: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TEAMS:
    return {...state,teams:action.payload};
    case ActionTypes.EMAIL_CHANGED:
      return { ...state, email: action.payload };
    case ActionTypes.DOMAIN_CHANGED:
      return { ...state, domain: action.payload };  
    case ActionTypes.PASSWORD_CHANGED:
      return { ...state, password: action.payload };
    case ActionTypes.LOGIN_USER:
      return { ...state, loading: true, error: '' };
    case ActionTypes.LOGIN_USER_SUCCESS:
      return { ...state, ...INITIAL_STATE, user: action.payload };
    case ActionTypes.LOGIN_USER_FAIL:
      return { ...state, error: 'Authentication Failed.', login_status: 'Authentication Failed.', password: '', loading: false };
    case ActionTypes.SIGNUP_USER_FAIL:
      return { ...state, ...INITIAL_STATE,errorSignup: action.payload, password: '', loading: false };
    case ActionTypes.SIGNUP_USER_SUCCESS:
      return { ...state,...INITIAL_STATE, errorSignup: action.payload, password: '', loading: false };

    case ActionTypes.REGISTER_UPDATE:
      return { ...state, [action.payload.prop]: action.payload.value };
   
    default:
      return state;
  }
};
