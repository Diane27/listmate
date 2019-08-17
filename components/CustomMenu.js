import React from 'react';
import { Icon } from 'react-native-elements';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

class CustomMenu extends React.PureComponent {
    _menu = null;
    constructor(props){
        super(props);
    }

    setMenuRef = ref => {
        this._menu = ref;
    };
    hideMenu = () => {
        this._menu.hide();
    };
    showMenu = () => {
        this._menu.show();
    };

    render(){
        var menuItems = this.props.menuItems.map(function(item) {
            return (
                <MenuItem onPress={item.action} key={"key"+item.name}>{item.name}</MenuItem>
            );
          });
        
        return(
            
            <Menu
            ref={this.setMenuRef}
            button={<Icon name='ellipsis-v' color='#fff' type='font-awesome' onPress={this.showMenu}>Show menu</Icon>}
            >
                { menuItems }
            </Menu>
        )
    }
}

export default CustomMenu;