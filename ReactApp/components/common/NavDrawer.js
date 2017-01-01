import React, { PropTypes,Component  } from 'react'
import Drawer from 'react-native-drawer'
import { Actions, DefaultRenderer } from 'react-native-router-flux'

import NavDrawerPanel from './NavDrawerPanel'

class NavDrawer extends Component {
  componentDidMount() {
      Actions.refresh({key: 'main', ref: this.refs.navigation});
  }

  render(){
        const state = this.props.navigationState;
        const children = state.children;
        return (
            <Drawer
              ref="navigation"
              open={state.open}
              onOpen={()=>Actions.refresh({key:state.key, open: true})}
              onClose={()=>Actions.refresh({key:state.key, open: false})}
              type="displace"
              content={<NavDrawerPanel />}
              tapToClose={true}
              openDrawerOffset={0.2}
              panCloseMask={0.2}
              negotiatePan={true}
              tweenHandler={(ratio) => ({
                main: { opacity:Math.max(0.54,1-ratio) }
              })}>
              <DefaultRenderer navigationState={children[0]} onNavigate={this.props.onNavigate} />
            </Drawer>
        );
    }
}


export default NavDrawer; 