/**
 * Sidemenu Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

export function toggle() {
	console.log('sidemenu toggle');
  return {
    type: 'SIDEMENU_TOGGLE',
  };
}

export function open() {
  return {
    type: 'SIDEMENU_OPEN',
  };
}

export function close() {
  return {
    type: 'SIDEMENU_CLOSE',
  };
}
