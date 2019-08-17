import React from 'react'
import { View, SafeAreaView, StyleSheet, StatusBar} from 'react-native'
import { Button, Icon, Avatar, Text } from 'react-native-elements'
import { DrawerItems } from 'react-navigation'
import firebaseService from '../service-firebase';
import theme from '../styles'

class CustomLeftDrawer extends React.Component{
    render(){
        const user = firebaseService.auth().currentUser;
        return(
            <View style={{flex:1}}>
                <SafeAreaView style={{ flex: 0, backgroundColor: theme.colors.primary }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    {/* <StatusBar
                        barStyle="light-content"
                        backgroundColor={theme.colors.primary}
                    /> */}
                    <View style={styles.profileContainer}>
                        <Avatar
                            rounded
                            size="medium"
                            source={{ uri: user.photoURL}} 
                        />
                        <View>
                            <Text style={{color:"#fff", paddingLeft: 10, fontSize:20, textAlign:"left"}}>{user.displayName}</Text>
                            <Text style={{color:"#fff", paddingLeft: 10, fontSize:14}}>{user.email}</Text>
                        </View>
                    </View>
                </SafeAreaView>
                <SafeAreaView style={{ flex: 1, }}>
                    <DrawerItems {...this.props} 
                    activeTintColor={theme.colors.primary}
                    activeBackgroundColor={theme.colors.primaryLight}
                    inactiveTintColor={"#342E37"}
                    />
                    {/* <Divider></Divider> */}
                    <Button 
                    title="Logout" 
                    type="clear" 
                    onPress={() => firebaseService.auth().signOut()}
                    icon= {<Icon name="sign-out" type="font-awesome" color="#342E37" />}
                    buttonStyle= {{ justifyContent: 'flex-start', marginLeft: 10 }}
                    titleStyle={{ marginLeft: 30, color: "#342E37" }}
                    />
                </SafeAreaView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    profileContainer: {
        height: 70,
        backgroundColor: theme.colors.primary,
        flexDirection: "row",
        padding: 10
    }
})

export default CustomLeftDrawer;