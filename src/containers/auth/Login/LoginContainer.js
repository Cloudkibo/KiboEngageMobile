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
import LoginRender from './LoginView';

// What data from the store shall we send to the component?
const mapStateToProps = state => ({
  auth: state.auth,
});

// Any actions to map to the component?
const mapDispatchToProps = {
  login: AuthActions.loginUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginRender);
