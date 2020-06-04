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
  AsyncStorage,
  Button,
  RefreshControl,
  TouchableHighlight
  } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withNavigation } from 'react-navigation';
import { Block, Text, theme } from "galio-framework";
//import { Button } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

import { appstyles } from '../../styles/appStyle'

const USER_STORAGE_KEY = "@user_id";

//const url = "http://10.0.0.159:5000";
const url = "http://flip1.engr.oregonstate.edu:5005";

export class ShoppingList extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        data: [],
        tags: [],
        user_id: "",
        haveUserId: true,
        tag_name: "",
        isLoading: false,
        refresh: false,
        firstRender: true,
        modalAddVisible: false,
        refreshing: false
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
    
      addList(){
        fetch(url + '/addList/', {
                       method: 'POST',
                       headers: {
                           Accept: 'application/json',
                           'Content-Type': 'application/json',
                       },
                       body: JSON.stringify({
                           user_id: this.state.user_id,
                           tag_name: this.state.tag_name,
                       })
                      }).then((response) => response.json())
                      .then((json) => {
                        this.setState({ data: json });
                      }).finally(() => {
         this.setState({ refresh: !this.state.refresh });
         })
    
      }

      removeItem(shopping_list_history_id){
        fetch(url + '/removeItem/', {
                       method: 'POST',
                       headers: {
                           Accept: 'application/json',
                           'Content-Type': 'application/json',
                       },
                       body: JSON.stringify({
                        user_id: this.state.user_id,
                           list_id: shopping_list_history_id,
                       })
        }).then((response) => response.json())
       .then((json) => {
         this.setState({ data: json });
       }).finally(() => {
         this.setState({ refresh: !this.state.refresh });
         })
    
      }

    
      getUserId = async () => {
        try {
          const value = await AsyncStorage.getItem(USER_STORAGE_KEY);
          this.setState({['user_id']: value});
          this.setState({['haveUserId']: true});
          return value;
        }
        catch {
          console.log("failed to get userId");
        }
      }

      onChangeText = (key, val) => {
        this.setState({ [key]: val })
      }
    
      submitHandler(){
        this.addList()
        this.setModalAddVisible(!this.state.modalAddVisible)

      }

    componentDidMount() {
        
        this.setState({ loading: true });
        this.getUserId().then(() => fetch(url + '/getShoppingList/', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              user_id: this.state.user_id
          }),
         }).then((response) => response.json())
       .then((json) => {
         this.setState({ data: json });
       }).finally(() => {
         this.setState({ isLoading: false });
        })
       );
        /*
        this.setState({data: [ 
          {"shopping_list_history_id":55928,"tag_name":"tissues","id":"0"},
        {"shopping_list_history_id":55929,"tag_name":"fish","id":"1"},
        {"shopping_list_history_id":55931,"tag_name":"trout","id":"2"},
        {"shopping_list_history_id":55933,"tag_name":"corn","id":"3"},
        {"shopping_list_history_id":55934,"tag_name":"corn","id":"4"} 
      ] });  
      */
  }
  
  /*
  _onRefresh () {
    this.setState({refreshing: true});

    this.getList().then(() => {
      this.setState({refreshing: false});
    });
  }
*/


  renderSeparator = () => {
    return (
      <View style={{backgroundColor:'#fff', flex:1 ,padding: 10}}></View>
    );
  };

  setModalAddVisible = (visible) => {
    this.setState({ modalAddVisible: visible });
  }

   // Render each feed entry in a flatlist
   render() {  

       return ( 
      <ScrollView >
        <View style={appstyles.container}>


              <Block flex style={appstyles.profileContainer}>
                  <View style = {appstyles.centeredView2}>
                                                                               
                    
                    
                    <TouchableHighlight 
                        
                        style = {appstyles.listButton2}
                        onPress={() => this.setModalAddVisible()}>
                        <Text bold
                    size={20}
                    color="white">Add Item to List</Text>
                         
                    </TouchableHighlight>
                    </View>
                    <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.modalAddVisible}
                                onRequestClose={() => {
                                  Alert.alert("Modal has been closed.");
                                }}
                            >
                              <View style={appstyles.centeredView}>
                                <View style={appstyles.modalView}>
                                  <Text style={appstyles.modalText}>Add an item!</Text>
                                  <TextInput
                                    style={appstyles.input}
                                    placeholder='What are you shopping for?'
                                    autoCapitalize="none"
                                    maxLength={50}
                                    placeholderTextColor='white'
                                    onChangeText={val => this.onChangeText('tag_name', val)}
                                  />
                                  <TouchableHighlight
                                    title = "Submit"
                                    style={appstyles.listButton1}
                                    onPress={() => this.submitHandler() }>
                                    <Text size="20">Submit</Text>
                                  </TouchableHighlight>  
                                  <TouchableHighlight
                                    title = "Close"
                                    style={appstyles.listButton2}
                                    onPress={() => {
                                      this.setModalAddVisible(!this.state.modalAddVisible) 
                                      this.props.navigation.navigate("ShoppingList")}}>
                                    <Text size="20">Close</Text>
                                  </TouchableHighlight>
                                </View>
                              </View>
                            </Modal>

               
                    <View style={appstyles.container}>
                    {this.state.isLoading ? <ActivityIndicator/> : (
                            <FlatList
                                data={this.state.data}
                                extraData={this.state.refresh}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListHeaderComponent = { this.renderSeparator}
                                renderItem={({ item, id }) => (
                                <View>
                                    <View style={appstyles.listRow}>
                                        <Text size="30">{item.tag_name}</Text>
                                        <Icon
                                          name="ios-close-circle-outline" size={40}
                                          onPress={() => {this.removeItem(item.shopping_list_history_id)
                                            this.props.navigation.navigate("ShoppingList")}}
                                        />
                                    </View>
                                </View>)}
                                keyExtractor={(item, id) => id.toString()}
                            />
                            )}  
                            <TouchableHighlight
                              style = {appstyles.listButton1}
                              onPress={() => Alert.alert('Reccomend button pressed')}>
                              <Text bold
                    size={20}
                    color="white">Get Reccomendations</Text>  
                            </TouchableHighlight>           
                    </View>
              </Block>
        </View>
      </ScrollView>

        )
    };
}

const styles = StyleSheet.create({
    tag1: {flex: 1, color: theme.COLORS.LIGHT_GREEN},
    tag2: {flex: 1, color: theme.COLORS.GREEN},
    tag3: {flex: 1, color: theme.COLORS.DARK_GREEN},
    listButton: {
        width: width * .8,
        height: height * .1,
        color: theme.COLORS.GREEN
    },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }, 
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
});
