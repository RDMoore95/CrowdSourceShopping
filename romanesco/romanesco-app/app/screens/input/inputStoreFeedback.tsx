import React from 'react';
import { View, 
  Button,  
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  Keyboard,
  FlatList,
  TextInput,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  AsyncStorage,
  Dimensions } from 'react-native';
import { Avatar, List, ListItem } from "react-native-elements";
import { useEffect, useState } from 'react';
import { theme } from "galio-framework";
import { withNavigation } from 'react-navigation';
import { Switch } from 'react-native-switch';
const USER_STORAGE_KEY = "@user_id";

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

// var url = "http://192.168.1.7:5000";
var url = "http://flip1.engr.oregonstate.edu:5005";

export default class InputStoreFeedback extends React.Component {  

  constructor(props) {

    super(props)

    this.state = {
      isLoading: true,
      store_id: this.props.route.params.store_id,
      haveUserId: false,
      user_id: this.props.route.params.user_id,      
      store_feedback_category: this.props.route.params.store_feedback_category,
      store_feedback_text: '',
      store_feedback_category_id: this.props.route.params.store_feedback_category_id,      
      store_feedback_positive: false,
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

  // Adding item to database
  addStoreFeedback(){

    this.getUserId()
      .then(() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
                       user_id: this.state.user_id,
                       store_id: this.state.store_id,
                       store_feedback_text: this.state.store_feedback_text,
                       store_feedback_category_id: this.state.store_feedback_category_id,
                       store_feedback_positive: this.state.store_feedback_positive,
                   })
      };

      fetch(url + '/addStoreFeedback/', requestOptions)

    })    

  }

  // Render each feed entry in a flatlist
  render() {

          console.log(this.props)

            return(

          <>

          <View style={styles.container}>

          <View style={{ flex: 1, padding: 5, alignSelf: "center", backgroundColor: "#fff"}}>

                  <View style={{backgroundColor:'#fff', padding: 10}}></View>      

                  <View style={styles.feedBox}>

                      <Text
                        style={{fontSize: 20, textAlign: 'center' }}                       
                      >Feedback Type: {this.state.store_feedback_category}</Text>

                      <View style={{backgroundColor:'#fff', padding: 3}}></View>

                      <TextInput
                        style={{height: 120, fontSize: 26, textAlign: 'center'}}
                        placeholder="Tell us about your trip"
                        onChangeText={(store_feedback_text) => this.setState({store_feedback_text})}
                      />

                      <View style={{backgroundColor:'#fff', padding: 3}}></View>

                      <Text
                        style={{ fontSize: 20, textAlign: 'center' }}                    
                      >Good Experience?</Text>

                      <View style={{backgroundColor:'#fff', padding: 5}}></View>

                      <View style={{alignItems: 'center'}}>
                      <Switch
                      value={false}
                      onValueChange={(store_feedback_positive) => this.setState({store_feedback_positive})}
                      disabled={false}
                      activeText={'Yes'}
                      inActiveText={'No'}
                      backgroundActive={'green'}
                      backgroundInactive={'gray'}
                      circleActiveColor={'#30a566'}
                      circleInActiveColor={'#000000'}
                      />
                      </View>

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <Button
                      title = 'Submit Feedback'
                      onPress={() => {
                        this.addStoreFeedback()
                        this.props.navigation.navigate("InputPrompt", {submissionSuccess: true})
                        ;}}
                      >                      
                      </Button>

                  </View>

                  <View style={{backgroundColor:'#fff', padding: 10}}></View>

           </View>

           </View>       

          </>

          )

    }
      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
      backgroundColor:'#fff'
      , paddingHorizontal: 6
      , paddingVertical: 12
      , marginHorizontal: theme.SIZES.BASE
      , borderColor: '#fff'
      , borderRadius: 10
      , borderWidth: 1
      , shadowColor: "black"
      , shadowOffset: { width: 0, height: 0 }
      , shadowRadius: 8
      , shadowOpacity: 0.2
      , zIndex: 2
      , width: deviceWidth * 0.9
    },
    feedBoxHeader: {
      backgroundColor:'#fff'
      , padding: 3
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReview: {
      backgroundColor:'#fff'
      , padding: 3
      , flexDirection: 'row'
      , alignItems: 'center'
    },    
    feedBoxReviewText: {
      backgroundColor:'#fff'
      , padding: 3
      , flex: 0.9
    },
    feedBoxReviewVote: {
      backgroundColor:'#fff'
      , flex: 0.1
    },                    
    headline: {
       fontSize: 20,
       color:'#32325D',
       textAlign: 'center',
       textAlignVertical: "center",
       paddingLeft: 10,
       width: deviceWidth * 0.75
    }
  });