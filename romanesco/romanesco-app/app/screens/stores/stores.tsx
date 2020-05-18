import React, { Component } from 'react';
import { ActivityIndicator,
  Button,
  FlatList, 
  StyleSheet, 
  Dimensions, 
  ImageBackground,
  Text,
  TouchableOpacity,
  View, 
  ScrollView } from 'react-native';
import { Avatar, List, ListItem } from "react-native-elements";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withNavigation } from 'react-navigation';
import Modal from 'react-native-modal';

import { Block, theme } from "galio-framework";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import{ StoreProfile } from "./storeProfile"

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

//var url = "http://192.168.1.2.:5000/getStores/";
var url = "http://flip1.engr.oregonstate.edu:5005/getStores/";

export default class StoreFeed extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      isModalVisible: false,
      setModalVisible: false,
    };
  }

  state = {}

    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }

  componentDidMount() {
    fetch(url, {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             user_id: '121',
         }),
     }).then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });       
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible})
  };  

  render() {

    const { data, isLoading } = this.state;
    console.log(data);

    return (

      <>

      <View style={{  backgroundColor:'#fff' }}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: '5%', backgroundColor:'#fff'}}
          >

          <View style={{backgroundColor:'#fff', flex:1 ,padding: 6}}></View>
          <Text style={styles.storeHeadline}>
          Your Favorite Stores
          </Text>
          <View style={{backgroundColor:'#fff', flex:1 ,padding: 6}}></View>

          <View style={{ flex: 1, padding: 5, width: deviceWidth * 0.98 }}>

            {isLoading ? <ActivityIndicator/> : (
              <FlatList
                data={this.state.data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <>
                  <View style={styles.feedBox}>
                  <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('StoreProfileModal', 
                      {
                        store_id: item.store_id
                      }
                    )
                    }
                  >

                  <View style={styles.feedBoxHeader}>
                    <Avatar
                    rounded
                    source={require('../../assets/imgs/romanescoicon.png')}
                     />  
                    <Text numberOfLines={1} style={styles.headline}> 
                    {item.store_name} at {item.store_street}
                    </Text>
                  </View> 
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                       You last rated {item.days_since_last_feedback} days ago   
                    </Text>

                  </TouchableOpacity>

                  </View>

                  <View style={{backgroundColor:'#fff', flex:1 ,padding: 3}}></View>

                  </>
                )}
              />
            )}

          </View>  

         </ScrollView>

          <View style={{backgroundColor:'#fff', flex:1 ,padding: 6}}></View>
          <Text style={styles.storeHeadline}>
          Top Stores Near You
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: '5%', backgroundColor:'#fff'}}
          >

           <View >
            <Button
              onPress={() => this.props.navigation.navigate('StoreProfileModal', 
                {
                  storeId: 10,
                }
                )
              }
              title="Open Modal"
            />
            <Modal isVisible={this.state.isModalVisible}>
              <View >
                <Text>Hello!</Text>
                <Button title="Hide modal" onPress={this.toggleModal} />
              </View>
            </Modal>
          </View>

          <View style={{ flex: 1, padding: 5, width: deviceWidth * 0.98 }}>

            {isLoading ? <ActivityIndicator/> : (
              <FlatList
                data={this.state.data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <>
                  <View style={styles.feedBox}>
                  <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('StoreProfileModal', 
                    {
                      store_id: item.store_id
                    }
                    )
                    }
                  >
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{item.store_name}</Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{item.store_street}</Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{item.days_since_last_feedback}</Text>
                  </TouchableOpacity>

                  </View>

                  <View style={{backgroundColor:'#fff', flex:1 ,padding: 3}}></View>

                  </>
                )}
              />
            )}

          </View>  

         </ScrollView>













         </View>

      </>

    );
  } 

}

export default withNavigation(StoreFeed);


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column',
    },
    col:{
      //flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'row'
    },
    row:{
      //flex: 1,
      backgroundColor: '#5E72E4',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column'
    },
    feedBox: {
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
    },
    feedBoxHeader: {
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReview: {
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReviewText: {
      backgroundColor:'#F7FAFC'
      , padding: 3
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flex: 0.9
    },
    feedBoxReviewVote: {
      backgroundColor:'#F7FAFC'
      , borderColor: '#F7FAFC'
      , borderRadius: 25
      , borderWidth: 1
      , flex: 0.1
    },                    
    headline: {
       fontSize: 14,
       color:'#32325D',
       textAlign: 'left',
       textAlignVertical: "center",
       paddingLeft: 10,
       width: deviceWidth * 0.75
    },
    storeHeadline: {
       fontSize: 20,
       color:'#32325D',
       textAlign: 'left',
       textAlignVertical: "center",
       paddingLeft: 10,
       width: deviceWidth * 0.75
    }
  });