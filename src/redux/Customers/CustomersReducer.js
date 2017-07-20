import * as ActionTypes from '../types';

const INITIAL_STATE = {
  customers: [],
  sendEmailError: '',
  sendEmailSuccess: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case ActionTypes.ADD_CUSTOMERS:
      return { ...state, customers: action.payload, sendEmailError: '', sendEmailSuccess: '' };

    case ActionTypes.SEND_EMAIL:
      return { ...state, sendEmailError: '', sendEmailSuccess: '' };
    case ActionTypes.SEND_EMAIL_SUCCESS:
      return { ...state, sendEmailSuccess: 'Email has been sent successfully.' };
    case ActionTypes.SEND_EMAIL_FAIL:
      return { ...state, sendEmailError: 'Email sending failed.' };

    default:
      return state;
  }
};
