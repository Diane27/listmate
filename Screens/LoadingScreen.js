import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import firebaseService from '../service-firebase'

class LoadingScreen extends Component {
  componentDidMount() {
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = () => {
    firebaseService.auth().onAuthStateChanged(
      function(user) {
        // console.log('AUTH STATE CHANGED CALLED ')
        // this.props.navigation.navigate('Dashboard');
        if (user) {
          this.props.navigation.navigate('Dashboard');
        } else {
          this.props.navigation.navigate('Login');
        }
      }.bind(this)
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}
export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});