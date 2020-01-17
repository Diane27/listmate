import React from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Input, Text, Icon, Badge, Button } from 'react-native-elements';
import dataService from '../services/dataService';
import CustomMenu from '../components/CustomMenu';
import theme from '../styles';

export default class ItemsFormScreen extends React.Component {
    constructor(props){
        super(props),
        this.state = {
            item: {
                name: '',
                tags: []
            },
            list:'',
            isNewItem: true,
            isHidden: true,
            tagName: ''
        }
    }

    static navigationOptions = ({ navigation }) => {
        return{
            headerRight: (
                <CustomMenu {...this.props}
                    menuItems={
                        [{
                            name: 'Delete',
                            action: ()=>{dataService.remove('items', navigation.getParam('activeItem').id)}
                        }]
                    }
                />
            )
        }
    }
    UNSAFE_componentWillMount(){
        if(this.props.navigation.state.params){
            const activeItem = this.props.navigation.getParam('activeItem', null)
            this.setState({list: this.props.navigation.getParam('list', null)});
            if (activeItem != null) {
                this.setState({
                    item: activeItem,
                    isNewItem: false
                }, ()=> {
                    console.log(this.state.item)
                });
            }
        }
    }

    tagsList() {
       return this.state.item.tags && this.state.item.tags.map((tag) => {
            return (
                <Badge
                    badgeStyle={styles.badgeStyle}
                    containerStyle={styles.badgeContainerStyle}
                    textStyle={{color: theme.colors.primary}}
                    value={tag} key={tag}
                />
            )
        })
    }
    showAddNewTag = () =>{
        if (this.state.isHidden){
          this.setState({isHidden: false})
        }
    };
    hideAddNewTag = (value) => {
        this.setState({item: {...this.state.item, tags: [...this.state.item.tags, value]}});
        if (!this.state.isHidden){
          this.setState({isHidden: true});
        }
    };
    renderAddTag = () => {
        return (
          <View key={'tag'}>
            <Input
              placeholder='Enter tag name'
              placeholderTextColor = '#fff'
              returnKeyType='done'
              onChangeText={(value) => this.setState({tagName: value})}
              value={this.state.tagName}
              onSubmitEditing={() => this.hideAddNewTag(this.state.tagName)}
            />
          </View>
        );
    };
    saveItem() {
        if (this.state.isNewItem) {
            dataService.create(`lists/${this.state.list}/items`, this.state.item);
        } else {
            dataService.update(`lists/${this.state.list}/items`, this.state.item);
        }
    }
    render(){
        return(
            <View>
                <View style={styles.formHeader}>
                    <Input
                        label="Item"
                        labelStyle={styles.headerLabel}
                        value = {this.state.item.name}
                        inputStyle = {styles.headerInput}
                        onChangeText={(value) => this.setState({item: {...this.state.item, name:value}})}
                    />
                    <View>
                        <Text style={styles.headerLabel}>Tags</Text>
                        <View style={styles.headerTags}>
                            { this.tagsList() }
                            <Icon
                                name= {this.state.isHidden? 'plus': 'minus'}
                                type='font-awesome'
                                onPress= { this.state.isHidden? this.showAddNewTag : ()=>{this.setState({isHidden: !this.state.isHidden})}}
                            />
                        </View>
                    </View>
                    {!this.state.isHidden ? this.renderAddTag() : null}
                </View>
                <View>
                    <Button
                        buttonStyle={styles.submitButton}
                        icon={
                            <Icon
                                name='send'
                                type='materialIcon'
                            />
                        }
                        onPress={this.saveItem.bind(this)}
                    />


                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    formHeader: {
        backgroundColor: theme.colors.primary,
        paddingLeft: 50,
        height: 230,
        justifyContent: 'space-around'
    },
    formBody: {

    },
    headerLabel: {
        color: theme.colors.secondary,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: "left"
    },
    headerInput: {
        fontSize: 36,
    },
    headerTags: {
        flexDirection: 'row',
    },
    badgeContainerStyle: {
        marginRight:10,
    },
    badgeStyle: {
        backgroundColor: '#fff',
    },
    submitButton: {
        width: 60,
        height: 60,
        borderWidth: 0,
        alignSelf: "flex-end",
        alignItems: 'center',
        backgroundColor:theme.colors.secondary,
        borderRadius:50
    }
})