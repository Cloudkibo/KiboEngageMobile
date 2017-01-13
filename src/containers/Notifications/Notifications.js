import { AppColors, AppStyles } from '@theme/';
import { Text } from '@components/ui/';
import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TabBarTop } from 'react-native-tab-view';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
  // Tab Styles
  tabContainer: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: AppColors.brand.primary,
  },
  tabbarIndicator: {
    backgroundColor: '#FFF',
  },
  tabbar_text: {
    color: '#FFF',
  },
});

/* Component ==================================================================== */
class Notifications extends Component {
  static componentName = 'Notifications';

  /**
    * Header Component
    */
  renderHeader = props => (
    <TabBarTop
      {...props}
      style={styles.tabbar}
      indicatorStyle={styles.tabbarIndicator}
      renderLabel={scene => (
        <Text style={[styles.tabbar_text]}>{scene.route.title}</Text>
      )}
    />
  )

  render = () => (
    <View style={[AppStyles.container]} />
  )
}

export default Notifications;
