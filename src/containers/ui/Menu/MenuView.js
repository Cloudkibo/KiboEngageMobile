/**
 * Menu Contents
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes } from '@theme/';

// Components
import { Spacer, Text, Button } from '@ui/';

/* Styles ==================================================================== */
const MENU_BG_COLOR = '#2E3234';

const styles = StyleSheet.create({
  backgroundFill: {
    backgroundColor: MENU_BG_COLOR,
    height: AppSizes.screen.height,
    width: AppSizes.screen.width,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  container: {
    position: 'relative',
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
  },

  // Main Menu
  menu: {
    flex: 6,
    left: 0,
    right: 0,
    backgroundColor: MENU_BG_COLOR,
    padding: 20,
    paddingTop: AppSizes.statusBarHeight,
  },
  menuItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#3D4346',
    paddingBottom: 10,
    flexDirection: "row",

  },
  menuItem_text: {
    fontSize: 18,
    lineHeight: parseInt(18 + (18 * 0.5), 10),
    fontWeight: '500',
    marginTop: 10,
    color: '#EEEFF0',
  },
  iconContainer: {
    marginTop: 10,
    padding: 2,
  },

  // Menu Bottom
  menuBottom: {
    flex: 1,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
  menuBottom_text: {
    color: '#EEEFF0',
  },
});

/* Component ==================================================================== */
class Menu extends Component {
  static propTypes = {
    logout: PropTypes.func.isRequired,
    closeSideMenu: PropTypes.func.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
  }

  constructor() {
    super();

    this.state = {
      menu: [
        // {
        //   title: 'Recipes',
        //   onPress: () => { this.props.closeSideMenu(); Actions.app(); },
        //   icon:'dashboard',
        // },
        // {
        //   title: 'Example Link',
        //   onPress: () => { this.props.closeSideMenu(); Actions.comingSoon(); },
        //   icon:'dashboard',
        // },

         {
          title: 'Teams',
          onPress: () => { this.props.closeSideMenu(); Actions.teams(); },
          icon:'people',
        },

        {
          title: 'Agents',
          onPress: () => { this.props.closeSideMenu(); Actions.agents(); },
          icon:'account-circle',
        },
        {
          title: 'Message Channels',
          onPress: () => { this.props.closeSideMenu(); Actions.channels(); },
          icon:'message',
        },

        {
          title: 'Customer Directory',
          onPress: () => { this.props.closeSideMenu(); Actions.customers(); },
          icon:'book',
        },

        {
          title: 'Canned Responses',
          onPress: () => { this.props.closeSideMenu(); Actions.cannedresponse(); },
          icon:'timer',
        },

        {
          title: 'Notifications',
          onPress: () => { this.props.closeSideMenu(); Actions.notifications(); },
          icon:'notifications',
        },
        {
          title: 'Groups',
          onPress: () => { this.props.closeSideMenu(); Actions.groupsmain(); },
          icon:'group-add',
        },
        {
          title: 'Company Settings',
          onPress: () => { this.props.closeSideMenu(); Actions.companySettings(); },
          icon:'settings',
        },
        {
          title: 'My Profile',
          onPress: () => { this.props.closeSideMenu(); Actions.myProfile(); },
          icon: 'face',
        },
      

      ],
    };
  }

  login = () => {
    this.props.closeSideMenu();
    Actions.login();
  }

  logout = () => {
    this.props.logout();


  }

  render = () => {
    const { menu } = this.state;

    // Build the actual Menu Items
    const menuItems = [];
    menu.map((item) => {
      const { title, onPress, icon } = item;

      return menuItems.push(
        <TouchableOpacity
          key={`menu-item-${title}`}
          onPress={onPress}
        >
            <View style={[styles.menuItem]}>
          <View style={styles.iconContainer}>
             <Icon
              name={ icon } color='#5555577' />
          </View>
           <View>
            <Text style={[styles.menuItem_text]}>
               {title}
            </Text>
           </View>

          </View>
        </TouchableOpacity>,
      );
    });

    return (
      <View style={[styles.container]}>
        <View style={[styles.backgroundFill]} />

        <View style={[styles.menuContainer]}>
          <View style={[styles.menu]}>{menuItems}</View>

          <View style={[styles.menuBottom]}>
             <View>

                <View style={[AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml]}>
                  <Button
                    small
                    title={'Log Out'}
                    onPress={this.logout}
                  />
                </View>
              </View>


          </View>
        </View>
      </View>
    );
  }
}

/* Export Component ==================================================================== */
export default Menu;
