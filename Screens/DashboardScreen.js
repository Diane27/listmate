
import React from 'react';
import { StyleSheet, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Overlay, Text, ListItem, Badge, Icon, Button, Header, Input } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import AnimatedLoader from 'react-native-animated-loader';
import RBSheet from "react-native-raw-bottom-sheet";
import firebaseService from '../service-firebase';
import dataService from '../services/dataService';
import theme from '../styles';
import CustomHeader from '../components/CustomHeader';

const db = firebaseService.firestore();

export default class DashboardScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            listCreateVisible: false,
            listOptionVisible: false,
            loading: true,
            lists: [],
            listName: '',
            listToEdit: '',
            user: {},
            email: ''
        };
    }

    componentDidMount() {
        const user = firebaseService.auth().currentUser;
        this.setState({user});
        dataService.find('listToUsers', { param: 'user', value: user.uid })
        .then(result =>
            Promise.all(result.map(listToUser =>
                dataService.find('lists', { param: 'id', value: listToUser.list })
                .then(list => list[0])
            ))
        )
        .then(result => {
            this.setState({ lists: result, loading: false });
        }); 
    }

    saveList = () =>{
        db.collection("lists").add({
            name: this.state.listName,
            createdBy: this.state.user.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            this.setState({listCreateVisible: false})
        })
        .catch((err) => {
            console.log("Error saving list: ", err)
        })
    }

    addEmail = () =>{
        dataService.find('users', { param: 'gmail', value: this.state.email })
        .then(result => {
            if(!result.length){
                console.log("Invite User not yet implemented");
            } else {
                dataService.create('listToUsers', {
                    role: 'mate',
                    user: result[0].id,
                    list: this.state.listToEdit
                });
            }
        })
    }

    onPressAddEmail = () =>{
        this.RBSheet.close();
        setTimeout(()=>{
            this.setState({listOptionVisible: true}, ()=>{console.log(this.state.listOptionVisible)})
        }, 300 );
    }

    openRBSheet = (listToEdit) =>{
        this.setState({listToEdit});
        this.RBSheet.open();
    }

    renderInner = () => (
        <View style={styles.panel}>
          <TouchableOpacity style={styles.panelButton} onPress={this.onPressAddEmail}>
            <Text style={styles.panelButtonTitle}>Add mates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonTitle}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton}>
            <Text style={styles.panelButtonTitle}>Delete</Text>
          </TouchableOpacity>
        </View>
    )

    bs = React.createRef()

    render() {
      const { navigation } = this.props;
      let loadingOrList = <AnimatedLoader speed={0.5} visible={this.state.loading} animationStyle={styles.lottie} source={require("../assets/7541-circle-loader.json")}/>;
      if (!this.state.loading) {
        if (this.state.lists.length === 0) {
            loadingOrList = <View style={styles.emptyDashContainer}>
                                <Text style={styles.emptyDashText}>You don't have any lists yet. Press the add button below to create a list </Text>
                            </View>;
        } else {
            loadingOrList = <ScrollView>
                            {
                                this.state.lists.map((list, index) => (
                                <ListItem
                                    key={index}
                                    title={list.name}
                                    titleStyle={{ textAlign: "left" }}
                                    containerStyle={styles.listContainer}
                                    onPress={()=> {navigation.navigate('Items', {activeList: list.id })}}
                                    onLongPress={() => this.openRBSheet(list.id) }
                                />
                                ))
                            }
                        </ScrollView>;
        }
      }
      return (
        <View style={styles.container}>
            { loadingOrList }
            <Overlay
                isVisible={this.state.listCreateVisible}
                onBackdropPress={() => this.setState({ listCreateVisible: false })}
                height={250}
                borderRadius={10}
            >
                <View style={styles.overlayContainer}>
                    <View>
                        <Text h4>Add List</Text>
                        <Text style={{fontSize:16, marginTop:10 }}>Please enter a name for the new list</Text>
                    </View>
                    <View>
                        <Input
                            inputContainerStyle={styles.overlayInputBox}
                            inputStyle={{color: "#342E37"}}
                            onChangeText={(listName) => this.setState({listName})}
                        ></Input>
                    </View>
                    <View style={styles.overlayButtons}>
                        <Button
                            title="Cancel"
                            type="clear"
                            titleStyle={{color: "#342E37"}}
                            containerStyle={{flex: 1}}
                            onPress={() => this.setState({ listCreateVisible: false })}
                        >
                        </Button>
                        <Button
                            title="Submit"
                            titleStyle={{color: "#FAFFFD"}}
                            containerStyle={{flex: 1}}
                            onPress={() => this.saveList()}
                        >
                        </Button>
                    </View>
                </View>
            </Overlay>
            <Overlay
                isVisible = {this.state.listOptionVisible}
                onBackdropPress={() => this.setState({ listOptionVisible: false })}
                height={250}
                borderRadius={10}
            >
                <View style={styles.overlayContainer}>
                    <View>
                        <Text h4>email address</Text>
                    </View>
                    <View>
                        <Input
                            inputContainerStyle={styles.overlayInputBox}
                            inputStyle={{color: "#342E37"}}
                            keyboardType='email-address'
                            onChangeText={(email) => this.setState({email})}
                        ></Input>
                    </View>
                    <View style={styles.overlayButtons}>
                        <Button
                            title="Cancel"
                            type="clear"
                            titleStyle={{color: "#342E37"}}
                            containerStyle={{flex: 1}}
                            onPress={() => this.setState({ listOptionVisible: false })}
                        >
                        </Button>
                        <Button
                            title="Submit"
                            titleStyle={{color: "#FAFFFD"}}
                            containerStyle={{flex: 1}}
                            onPress={() => this.addEmail()}
                        >
                        </Button>
                    </View>
                </View>
            </Overlay>
            { !this.state.loading ?
                (<View style={styles.addButtonContainer}>
                    <Button
                        icon={
                            <Icon 
                                name='add'
                                type='materialIcon'
                                size= {40}
                                color='#FAFFFD'
                            />
                        }
                        buttonStyle={styles.addButton}
                        onPress= {() => this.setState({ listCreateVisible: true })}
                    >
                    </Button>
                </View>) : null
            }
            <RBSheet
                ref={ref => {
                    this.RBSheet = ref;
                }}
                duration={250}
                height={300}
                customStyles={{
                    container: {
                    justifyContent: "center",
                    alignItems: "center"
                    }
                }}
                >
                {this.renderInner()}
            </RBSheet>
        </View>

      );
    }
}
const styles = StyleSheet.create({
    container: {
      flex:1,
    },
    emptyDashContainer: {
        flex:1,
        alignItems: "center",
        justifyContent: "center"
    },
    emptyDashText: {
        fontSize: 20,
        color: "grey",
        textAlign: "center"
    },
    listContainer: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        height: 100,
        borderRadius: 5,
        // borderWidth: 1,
        elevation: 1,
        shadowRadius: 5,
        shadowOffset:{  width: 0,  height: 3,  },
        shadowColor: 'grey',
        shadowOpacity: 0.2,
    },
    overlayContainer:{
        flex:1,
        justifyContent: "space-between"
    },
    overlayInputBox:{
        borderColor: "grey",
        borderBottomWidth: 0.5,
        borderWidth: 0.5,
        paddingLeft: 10,
    },
    overlayButtons: {
        margin: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    addButtonContainer: {
        position: 'absolute',
        bottom: 60,
        right: 10,
    },
    addButton: {
        backgroundColor: theme.colors.secondary,
        width: 60,  
        height: 60,
        
        borderRadius: 30,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    lottie: {   
        width: 300,    
        height: 300,  
    },
    panel: {
        // height: 600,
        // padding: 20,
        // paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: { width: 0, height: 0 },
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#292929',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
});



