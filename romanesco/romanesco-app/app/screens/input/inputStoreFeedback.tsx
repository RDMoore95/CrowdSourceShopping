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
  Dimensions } from 'react-native';
import { Avatar, List, ListItem } from "react-native-elements";
import { useEffect, useState } from 'react';
import { theme } from "galio-framework";
import { withNavigation } from 'react-navigation';
import { Switch } from 'react-native-switch';

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

var url = "http://192.168.1.7:5000";
// var url = "http://flip1.engr.oregonstate.edu:5005";

export default class InputStoreFeedback extends React.Component {  

  constructor(props) {

    super(props)

    this.state = {
      data: [],
      isLoading: true,
      refresh: false,
      store_feedback_category: this.props.route.params.store_feedback_category,
      store_feedback_category_id: this.props.route.params.store_feedback_category_id,
      text: '',
      positive: false,
    };
  }

  // Adding item to database
  addStoreFeedback(){

    fetch(url + '/addStoreFeedback/', {
                   method: 'POST',
                   headers: {
                       Accept: 'application/json',
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                       user_id: '5',
                       text: this.state.text,
                       store_feedback_category_id: this.state.store_feedback_category_id,
                       store_id: '1',
                     })
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
                        style={{height: 120, fontSize: 20, textAlign: 'center' }}
                        placeholder="Tell us about your trip"
                        // onChangeText={this.state.text => setText(this.state.text)}
                        defaultValue={this.state.text}
                        onChangeText={(text) => this.setState({text})}
                      />

                      <View style={{backgroundColor:'#fff', padding: 3}}></View>

                      <Text
                        style={{ fontSize: 20, textAlign: 'center' }}                    
                      >Good Experience?</Text>

                      <View style={{backgroundColor:'#fff', padding: 5}}></View>

                      <View style={{alignItems: 'center'}}>
                      <Switch
                      value={false}
                      onValueChange={(val) => this.setState({val})}
                      disabled={false}
                      activeText={'Yes'}
                      inActiveText={'No'}
                      backgroundActive={'green'}
                      backgroundInactive={'gray'}
                      circleActiveColor={'#30a566'}
                      circleInActiveColor={'#000000'}
                      />
                      </View>

                      <View style={{backgroundColor:'#fff', padding: 5}}></View>

                      <Button
                      title = 'Submit Feedback'
                      onPress={() => {
                        this.addStoreFeedback()
                        this.props.navigation.navigate("InputPrompt", {submissionSuccess: true});}}
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