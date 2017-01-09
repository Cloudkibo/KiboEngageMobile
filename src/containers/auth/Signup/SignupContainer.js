/**
 * Login Container
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import { connect } from 'react-redux';

// Actions
import * as AuthActions from '@redux/auth/AuthActions';

// The component we're mapping to
import SignupRender from './SignupView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  auth: state.auth,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  signup: AuthActions.signupuser,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupRender);
