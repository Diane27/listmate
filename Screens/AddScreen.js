import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { FormLabel, FormInput, Icon, Badge } from 'react-native-elements';
import Tabs from 'react-native-tabs';

export default class AddScreen extends React.Component {
  state = {
    isHidden: true,
    tagName: '',
    item: {
      checked: false,
      list: "",
      title: "",
      tags: []
    },
  };

  render() {
    const { navigation } = this.props;
    const renderTags = navigation.getParam('renderTags');
    const activeList = navigation.getParam('activeList');
    showAddNewTag = () =>{
      console.log('hapening')
      if (this.state.isHidden){
        this.setState({isHidden: false})
      }
    };
    hideAddNewTag = (value) =>{
      this.setState({item: {...this.state.item, tags: [...this.state.item.tags, value]}});
      console.log(this.state.item);
      if (!this.state.isHidden){
        this.setState({isHidden: true});
      }
    };
    renderAddTag = () => {
      const addTagOutput = [];
      addTagOutput.push (
        <View key={'tag'}>
          <FormLabel>New Tag</FormLabel>
          <FormInput
            placeholder='Enter tag name'
            returnKeyType='done' 
            onChangeText={(value) => this.setState({tagName: value})}
            value={this.state.tagName}
            onSubmitEditing={() => hideAddNewTag(this.state.tagName)}
          />
        </View>
      );
      return addTagOutput;
    };
    updateItem = () => {
      console.log("item created");
      this.setState({item: {...this.state.item, list: activeList}}, ()=> {
        navigation.state.params.addItem(this.state.item);
        return navigation.goBack(); 
      }); 
    };
    deleteTag = (index) => {
      listItem = {...this.state.item, tags: [...this.state.item.tags]};
      listItem.tags.splice(index, 1);
      this.setState({item: listItem})
    }
    return (
      <View style={styles.container}>
        <FormLabel>Title</FormLabel>
        <FormInput
          defaultValue="type" 
          onChangeText={(value) => this.setState({item: {...this.state.item, title: value}} )}
        /> 
        <FormLabel>Tags</FormLabel>
        <View style={styles.tags}>
          {renderTags(this.state.item, true, deleteTag)}
          <Icon 
            name='add' 
            type='MaterialIcons'
            onPress= {showAddNewTag}></Icon>
        </View> 
        {!this.state.isHidden ? renderAddTag() : null}  
        <Tabs style={styles.bottomTab}>
          <TouchableHighlight underlayColor='#fff' onPress={() => this.props.navigation.goBack()}>
            <Text>Cancel</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => updateItem()}>
            <Text>Update</Text>
          </TouchableHighlight>
        </Tabs>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tags: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection:'row',
    marginLeft: 20,
    marginTop: 5,
  },
  bottomTab: {
    flex: 1,
    flexDirection:'row',
    position: 'absolute',
    bottom:0,
    padding: 50,
  },
  buttonLeft: {
    
  }
});