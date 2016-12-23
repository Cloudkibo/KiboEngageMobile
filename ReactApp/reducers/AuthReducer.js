import * as ActionTypes from '../actions/types'; 

const INITIAL_STATE = {
  email: '',
  password: '',
  domain:'',
  user: null,
  error: '',
  loading: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
      return { ...state, error: 'Authentication Failed.', password: '', loading: false };
    default:
      return state;
  }
};
