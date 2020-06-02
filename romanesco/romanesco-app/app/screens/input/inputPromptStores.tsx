import React from 'react';
import { View, 
  Button,  
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage,
  Dimensions } from 'react-native';
import { Avatar, List, ListItem } from "react-native-elements";
import { useEffect, useState } from 'react';
import { Block, Text, theme } from "galio-framework";
import { withNavigation } from 'react-navigation';

import Images from '../../assets/imgs';

const USER_STORAGE_KEY = "@user_id";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

// var url = "http://192.168.1.7:5000";
var url = "http://flip1.engr.oregonstate.edu:5005";

export default class InputPromptStores extends React.Component {

  constructor(props) {

  super(props);

  this.state = {
       user_id: "",
       data: [],
       isLoading: true,
    };
  }

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

  componentDidMount() {
    this.getUserId()
      .then(() => {
      fetch(url + '/getFeedbackStores/', {
           method: 'POST',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({
               user_id: this.state.user_id,
           }),
       }).then((response) => response.json())
        .then((json) => {
          this.setState({ data: json });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
      })
  }

  render() {

    const { data, isLoading } = this.state;

  return (  

      <>

      <View style={{  backgroundColor:'#fff', flexDirection: 'column' }}>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, backgroundColor:'#fff'}}
          >

          <View style={{ padding: 5, width: deviceWidth * 0.98 }}>

            {isLoading ? <ActivityIndicator/> : (
              <FlatList
                data={this.state.data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <>
                  <View style={styles.feedBox}>
                  <TouchableOpacity 
                    onPress={() => this.props.navigation.navigate('InputPrompt', 
                      {
                        store_id: item.store_id,
                        user_id: this.state.user_id
                      }
                    )
                    }
                  >

                  <View style={styles.feedBoxHeader}>
                    <Avatar
                    rounded
                    source = {Images.stores[item.store_name_fmt]}
                     />  
                    <Text numberOfLines={1} style={styles.headline}> 
                    {item.store_name} at {item.store_street}
                    </Text>
                  </View> 
                  </TouchableOpacity>

                  </View>

                  <View style={{backgroundColor:'#fff', flex:1 ,padding: 3}}></View>

                  </>
                )}
              />
            )}

            <View style={{backgroundColor:'#fff', flex:1 ,padding: 3}}></View>

          </View>        
      
       </ScrollView>

       </View>       

      </>

   );

  }
      
}

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