
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, ListItem, Badge, Icon, Button, CheckBox } from 'react-native-elements';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { ScrollView } from 'react-native-gesture-handler';
import AnimatedLoader from 'react-native-animated-loader';
import firebaseService from '../service-firebase';
import theme from '../styles';

const db = firebaseService.firestore();

export default class ItemScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            items: [],
            checked: false,
            list: ''
        };
    }
    componentDidMount() {
        let newList = [];
        const listId = this.props.navigation.getParam('activeList', 'NO-ID');
        this.setState({list: listId});
        db.collection(`lists/${listId}/items`)
        .onSnapshot((snapshot) => {
            snapshot.forEach((doc) => {
                const item = Object.assign(
                    { id: doc.id},
                    doc.data()
                )
                newList.push(item);
            })
            this.setState({items: newList, loading: false})
        })
    }
    saveList() {
        db.collection("lists").add({
            name: this.state.listName,
            createdBy: firebaseService.auth().currentUser.uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
            this.setState({isVisible: false})
        })
        .catch((err) => {
            console.log("Error saving list: ", err)
        })
    }
    renderTags = (item, showDelete, deleteTag) => {
        const tagOutput = [];
        let tags = item.tags;
        for (let i=0; i < tags.length; i++) {
            tagOutput.push(
                <Badge containerStyle={styles.badgeStyle} value={tags[i]} key={"item_"+i}/>
            );
        }
        return tagOutput;
    };

    render() {
      const { navigation } = this.props;
      let loadingOrList = <AnimatedLoader speed={0.5} visible={this.state.loading} animationStyle={styles.lottie} source={require("../assets/7541-circle-loader.json")}/>;
      if (!this.state.loading) {
        if (this.state.items.length === 0) {
            loadingOrList = <View style={styles.emptyDashContainer}>
                                <Text style={styles.emptyDashText}>You don't have any item in this list yet. Press the add button below to create an item </Text>
                            </View>;
        } else {
            loadingOrList = <ScrollView>
                                {
                                    this.state.items.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        title={item.name}
                                        titleStyle={{ textAlign: "left" }}
                                        containerStyle={styles.listContainer}
                                        leftElement = {
                                            <CheckBox 
                                            checked={this.state.checked}
                                            onPress={() => this.setState({checked: !this.state.checked})}
                                            />
                                        }
                                        subtitle= {
                                            <View style={styles.tags}>
                                                {this.renderTags(item)}
                                            </View>     
                                        }
                                        onPress={()=> {navigation.navigate('ItemsForm', { activeItem: item })}}
                                    />
                                    ))
                                }
                            </ScrollView>
        }
      }
      
      return (
        <View style={styles.container}>
            { loadingOrList }
            { !this.state.loading  ?
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
                        onPress= {() => navigation.navigate('ItemsForm', {list: this.state.list}) }
                    >
                    </Button>
                </View>) : null 
            }
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
    tags: {
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection:'row',
      },
    badgeStyle: { 
        marginRight:10, 
        marginTop: 10,
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
        borderWidth: 0,
        borderRadius: 30,
        alignSelf: 'flex-end',
        alignItems: 'center',
    }
});



