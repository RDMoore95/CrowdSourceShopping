import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  FlatList, 
  Alert,
  Modal, 
  TextInput,
  AsyncStorage
  } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withNavigation } from 'react-navigation';
import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import Icon from 'react-native-vector-icons/Ionicons';

import { NewButton } from "../../components/newButton/newButton";

import { appstyles } from '../../styles/appStyle'

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const USER_STORAGE_KEY = "@user_id";

const url = "http://10.0.0.159:5000";
//const url = "http://flip1.engr.oregonstate.edu:5005";

export class ShoppingListList extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        data: [],
        isLoading: false,
        refresh: false,
        firstRender: true,
        modalVisible: false,
        new_list: "",
        user_id: "7",
        haveUserId: false
      };
    }

    state = {}

    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#000",
            }}
          />
        );
      }
    
    /*
    
    */
   
   getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem(USER_STORAGE_KEY);
      this.setState({['user_id']: value});
      this.setState({['haveUserId']: true});
    }
    catch {
      console.log("failed to get userId");
    }
  }

  addList(){
    var currentdate = new Date();
    this.state.list_id = this.state.user_id + currentdate.getHours() + currentdate.getMinutes() + currentdate.getSeconds() + currentdate.getDate()
    fetch(url + '/addList/', {
                   method: 'POST',
                   headers: {
                       Accept: 'application/json',
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                       user_id: this.state.user_id,
                       list_id: this.state.list_id,
                       tag_name: this.state.tag_name,
                   })
    })

  }

  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

   componentDidMount() {
      
    this.setState({ loading: true });
    this.getUserId().then((uid) => fetch(url + '/getListList/', {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             user_id: this.state.userId
         }),
     }).then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      }).finally(() => {
        this.setState({ isLoading: false });
      }));    
      /*
     this.setState(
         {
             data:  [
                {id: "1", name: "List 1", tag: "Baking", quantity: "1", units: "package"}, 
                {id: "2", name: "List 2", tag: "Stew", quantity: "3", units: "package"}, 
                {id: "3", name: "List 3", tag: "Restock", quantity: "5", units: "LBs"}
            ]
     }
     */
        
  }

  

  renderSeparator = () => {
    return (
      <View style={appstyles.seperator}></View>
    );
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

   // Render each feed entry in a flatlist
   render() {  

       return (    
      <ScrollView >
        <Block flex>
              <Block flex style={appstyles.profileCard}>
                <Block middle style={appstyles.avatarContainer}>
                    <Text size={28} color="#32325D" style={{ marginTop: height * .15}}>Your Shopping Lists</Text>
                </Block>
                     
                <Block>
                    <View style={{ flex: 1, padding: 12, alignItems: 'center' }}>
                        <Block>
                            <Button style={appstyles.listButton} title ={"Add List"} onPress={() => this.setModalVisible()}>
                                <Icon name = "ios-create" size = {25}/>
                            </Button>



                            <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.modalVisible}
                                onRequestClose={() => {
                                  Alert.alert("Modal has been closed.");
                                }}
                            >
                              <View style={appstyles.centeredView}>
                                <View style={appstyles.modalView}>
                                  <Text style={appstyles.modalText}>Add List!</Text>
                                  <TextInput
                                    style={appstyles.input}
                                    placeholder='List Name'
                                    autoCapitalize="none"
                                    maxLength={50}
                                    placeholderTextColor='white'
                                    onChangeText={val => this.onChangeText('tag_name', val)}
                                  />
                                  <Button
                                    style={appstyles.listButton}
                                    onPress={() => {
                                      this.addList()
                                      this.setModalVisible(!this.state.modalVisible) }}>
                                    <Text>Submit</Text>
                                  </Button>  
                                  <Button
                                    style={appstyles.listButton}
                                    onPress={() => 
                                      
                                      this.setModalVisible(!this.state.modalVisible) }>
                                    <Text>Cancel</Text>
                                  </Button>
                                </View>
                              </View>
                            </Modal>



                        </Block>  
                        {this.state.isLoading ? <ActivityIndicator/> : (
                            <FlatList
                                data={this.state.data}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListHeaderComponent = { this.renderSeparator }
                                renderItem={({ item, id }) => (
                                <View>
                                    <View style={appstyles.listRow}>
                                        <View style={{flex: 4}}>
                                            <Text>{item.name}</Text>
                                        </View>
                                        <View style= {{flex: 1}}>
                                        <Icon
                                            name="ios-arrow-forward" size={25}
                                            onPress={() => this.props.navigation.navigate("ShoppingList")}
                                          />
                                        </View>
                                        
                                    </View>
                                    
                                </View>
                              )}
                            />
                          )}
                         
                        </View>
                </Block>
                
                
              </Block>

        </Block>
        <NewButton />
      </ScrollView>

        )
    };
}



