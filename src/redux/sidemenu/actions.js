/**
 * Sidemenu Actions
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */

export function toggle() {
  return {
    type: 'SIDEMENU_TOGGLE',
  };
}

export function open() {
	console.log('sidebar opened');
  return {
    type: 'SIDEMENU_OPEN',
  };
}

export function close() {
	console.log('sidebar closed');
  return {
    type: 'SIDEMENU_CLOSE',
  };
}
