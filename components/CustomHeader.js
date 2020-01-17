import React from 'react'
import { TouchableHighlight } from 'react-native'
import { Header, Icon } from 'react-native-elements'
import { DrawerActions } from 'react-navigation'
import theme from '../styles'

class CustomHeader extends React.Component{
    render(){
        return(
            <Header
                statusBarProps={{ barStyle: 'light-content' }}
                barStyle="light-content" // or directly
                leftComponent={
                    <TouchableHighlight
                        underlayColor='transparent'
                        onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name='bars' type='font-awesome' size={22} color={'#FAFFFD'} />
                    </TouchableHighlight>
                }
                rightComponent={
                    <TouchableHighlight
                        underlayColor='transparent'
                        onPress={() => this.props.navigation.openDrawer()}>
                        <Icon name='bell' type='font-awesome' size={22} color={'#FAFFFD'} />
                    </TouchableHighlight>
                }
                centerComponent={{ text: 'Listmate', style: { color: '#FAFFFD', fontWeight: "bold", fontSize: 20 } }}
                containerStyle={{
                    backgroundColor: theme.colors.primary,
                    justifyContent: 'space-around',
                }}
            />
        )
    }
}

export default CustomHeader;