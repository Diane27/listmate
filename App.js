import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Icon, ThemeProvider } from 'react-native-elements';
import { createAppContainer, createSwitchNavigator, createDrawerNavigator, DrawerItems, createStackNavigator } from 'react-navigation';
import firebaseService from './service-firebase';
import theme from './styles';

import CustomHeader from './components/CustomHeader';
import CustomLeftDrawer from './components/CustumLeftDrawer';
import CustomMenu from './components/CustomMenu';

import LoginScreen from './Screens/LoginScreen';
import DashboardScreen from './Screens/DashboardScreen';
import LoadingScreen from './Screens/LoadingScreen';
import ItemScreen from './Screens/ItemScreen';
import ItemsFormScreen from './Screens/ItemsFormScreen';

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppNavigator />
      </ThemeProvider>
    );
  }
};

const StackNavigator = createStackNavigator({
  Dashboard: {
    navigationOptions: ({navigation}) => {
      return {
        header: (<CustomHeader {...this.props} navigation={navigation} />),
        headerBackTitle: null
      };
    },
    screen: DashboardScreen
  },
  Items: {
    navigationOptions: {
      headerTintColor: "#fff",
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerRight: ( <CustomMenu {...this.props} menuItems={[{name:'Activity Log', action: ()=>{console.log("activity")}}]}/> )
    },
    screen: ItemScreen
  },
  ItemsForm: {
    navigationOptions: {
      headerTintColor: "#fff",
      headerStyle: {
        backgroundColor: theme.colors.primary,
      }
    },
    screen: ItemsFormScreen
  }
})

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      navigationOptions: {
        drawerIcon: () => (
          <Icon name="md-home" color="#342E37" />
        )
      },
      screen: StackNavigator
    }
  },
  {
    contentComponent:(props) => (
        <CustomLeftDrawer {...props} />
    ) 
})

const AppSwitchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  Login: LoginScreen,
  Dashboard: DrawerNavigator,
}, {
  navigationOptions: {
    header: {
      visible: false
    }
  }
});

const AppNavigator = createAppContainer(AppSwitchNavigator);


