import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CheckBox, ListItem, Badge, Icon, Button } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import firebaseService from '../service-firebase';
import { addItem } from '../services/addService';
import { editItem } from '../services/editService';
import { removeItem } from '../services/removeService';



// const FIREBASE_REF_MESSAGES = firebaseService.database().ref('lists/').push({}).push({
//     title: 'Paper towels',
//     tags: ['Safeway', 'Bathroom']
//   });

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            list: {},
            activeList: '-LMk3D3jMHADzAlSmNYK'
            /*list : [
                {
                  title: 'Paper towels',
                  tags: ['Safeway', 'Bathroom']
                },
                {
                  title: 'Garbage bags',
                  tags: ['Safeway', 'Kitchen']
                },
                {
                  title: 'Hand soap',
                  tags: []
                },
                {
                  title: 'Ground turkey',
                  tags: ['Safeway', 'Groceries']
                },
                {
                  title: 'Plastic cups',
                  tags: ['Party', 'Cup Stacking']
                },
                {
                  title: 'Power Strip',
                  tags: ['Diane\'s Room', 'Utilities']
                },
                {
                  title: 'USB-C & HDMI cord',
                  tags: ['Living Room', 'Utilities']
                },
              ],*/
        };
    }
    static navigationOptions = ({ navigationOptions }) => {
        return { 
            headerTitle: "Listmate",
            headerBackTitle: "return",
            // headerStyle: {
            //     backgroundColor: navigationOptions.headerStyle.backgroundColor,
            // }
        };
    };

    componentDidMount() {
        console.log("component mount is happening yay!")
        var query = firebaseService.database().ref('items').orderByChild('list').equalTo(this.state.activeList);
        query.on("value", (snap) => {
            var list = snap.toJSON();
            console.log(snap.toJSON());
            Object.values(list).forEach(item => {
                item.tags = item.tags? Object.values(item.tags) : Object.values({})
            });
            this.setState({list}, ()=>{
                console.log(this.state.list);
            });
        })
        // ListData.on('value', (snapshot) => {
        //     snapshot.forEach(function(snap) {
        //         var list = Object.values(snap.val());
        //         this.setState({list});
        //     }.bind(this));
            
        //  });
    }
    checkItem = (item, id) => {
        item.checked = !item.checked;
        editItem(item, id);
    };

    renderTags = (item, showDelete, deleteTag) => {
        const tagOutput = [];
        let tags = item.tags;
        badgeStyle = styles.badgeStyle;
        if (!tags.length) {
            tags = ['No tags']; // don't push b\c then you would modify original tag list
            badgeStyle = styles.badgeStyleEmpty;
            showDelete = false; // force hide delete icon when there are no tags
        }
    
        for (let i=0; i < tags.length; i++) {
            tagOutput.push(
                <Badge containerStyle={badgeStyle} key={"item_"+i}>
                    <Text>{tags[i]}</Text>
                    { showDelete ? <Icon name='cancel' type = 'MaterialIcons' size= {15} onPress={()=> deleteTag(i)}></Icon> : null}
                </Badge>
            );
        }
        
        return tagOutput;
    };

    render() {
      const { navigate } = this.props.navigation;
      const titleConfig = {
        title: 'Listmate',
      };
      

      return (
        <View style={styles.container}>
          {/* <NavBar title={titleConfig}></NavBar> */}
          <ScrollView>
            { Object.entries(this.state.list).sort(([a_id, a], [b_id,b])=> {
                if (a.checked) {
                    return 1;
                } else if(b.checked) {
                    return -1;
                } else {
                    return 0;
                }
            }).map(([id, item]) =>
                <ListItem 
                        key={item.title}
                        title={<CheckBox
                                containerStyle={{borderWidth: 0, backgroundColor:'#fff'}}
                                title={item.title}
                                onPress={() => this.checkItem(item, id)}
                                checked={this.state.list[id].checked}
                                />
                            }
                        subtitle={
                            <View style={styles.tags}>
                            {this.renderTags(item)}
                            </View>     
                        }
                        rightIcon={{name:'edit', type: 'feather'}}
                        // onPressRightIcon={ () => navigate('EditItem', {item:item, renderTags:this.renderTags, editItem: editItem.bind(this), itemKey:id}) }
                        containerStyle = {this.state.list[id].checked ? styles.checkedListItem : null}
                    />
                ) 
            }
          </ScrollView>
          <View>
            <Button
                icon={{
                    name: 'add',
                    type:'MaterialIcons',
                    size: 30,
                    style: { marginRight: 0 }
                }}
                buttonStyle={styles.addButton}
                // onPress= { () => navigate('AddItem', {renderTags:this.renderTags, addItem: addItem.bind(this), activeList:this.state.activeList})}
            >
            </Button>
          </View>
        </View>
      );
    }
}
const styles = StyleSheet.create({
    container: {
      flex:1,
    //   marginTop: -Constants.statusBarHeight,
    //   backgroundColor: '#fff',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    },
    tags: {
      display: 'flex',
      alignItems: 'flex-start',
      flexDirection:'row',
      marginLeft: 20,
    },
    addButton: {
        backgroundColor: '#29B6F6',
        width: 60,  
        height: 60,
        borderWidth: 0,
        borderRadius: 30,
        alignSelf: 'flex-end',
        position: 'absolute',
        bottom: 60,
        right: 10,
        alignItems: 'center',
    },
    badgeStyle: { 
        backgroundColor:'violet', 
        marginRight:10, 
        display:'flex',
        flexDirection:'row'
    },
    badgeStyleEmpty : { 
        backgroundColor: 'lightgray' 
    },
    checkedListItem : {
        backgroundColor: 'lightgray',
    }
});



