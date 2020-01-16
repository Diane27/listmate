import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Text, Button, Image } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from '../styles';

import Iconsvg from '../components/Iconsvg';

import * as firebase from 'firebase'
import firebaseService from '../service-firebase'
import '@firebase/firestore';
import * as Google from 'expo-google-app-auth';
import config from '../config'

const db = firebaseService.firestore();

export default class LoginScreen extends React.Component {

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebaseService.auth.GoogleAuthProvider.PROVIDER_ID && providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };

  onSignIn = googleUser => {
    // console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    let unsubscribe = firebaseService.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          )
          // Sign in with credential from the Google user.
          firebaseService
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(function(result) {
              if (result.additionalUserInfo.isNewUser) {
                db.collection("users").doc(result.user.uid)
                  .set({
                    gmail: result.user.email,
                    profile_picture: result.additionalUserInfo.profile.picture,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name,
                    created_at: Date.now()
                  })
                  .then(function(docRef) {
                    // console.log('Snapshot', snapshot);
                  })
                  .catch(function(error) {
                    console.error("Error adding document: ", error);
                  });
              } else {
                db.collection("users").doc(result.user.uid)
                  .update({
                    last_logged_in: Date.now()
                  });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      console.log("gets here")
      const result = await Google.logInAsync({
        // androidClientId: YOUR_CLIENT_ID_HERE,
        iosClientId: config.IOS_CLIENT_ID,
        scopes: ['profile', 'email']
      });
      
      console.log('ok?')
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text h3 style={styles.headerText}>Welcome to</Text>
          <Text h3 style={[styles.headerText, styles.headerListmate]}>Listmate</Text>
        </View>
        <View style={styles.footerButtons}>
          <Button raised
            title="Sign up with Google"
            type="outline"
            titleStyle={{color: "#342E37", marginLeft:8}}
            buttonStyle={styles.signUpButton}
            onPress={() => this.signInWithGoogleAsync()}
            icon={
              <Iconsvg
                name="Google"
                width="25px" height="25px" viewBox="0 0 400 400"
              />
            } 
          />
          <View style={styles.footerSignIn}>
            <Text style={{textAlign:'center'}}>Already have an account? </Text> 
            <Text style={{color:theme.colors.secondary}}>Sign In </Text> 
          </View>
        </View>
      </SafeAreaView>
    );
  }

};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      marginHorizontal: 20,
      marginVertical: 70,
    },
    headerText: {
      textAlign: 'left',
      fontWeight: '500'
    },
    headerListmate: {
      color: theme.colors.primary
    },
    footerButtons: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center'
    },
    signUpButton: {
      borderRadius: 10,
      paddingHorizontal: 30
    },
    footerSignIn: {
      flexDirection: 'row',
      marginTop: 20,
    }
});
  