import React from 'react';
import { View, 
  Button,  
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions } from 'react-native';
import { Avatar, List, ListItem } from "react-native-elements";
import { useEffect, useState } from 'react';
import { Block, Text, theme } from "galio-framework";
import { withNavigation } from 'react-navigation';

// To get feed entries to fill screen
let deviceWidth = Dimensions.get('window').width

export default class InputPrompt extends React.Component {

  constructor(props) {

  super(props);

  this.state = {
       submissionSuccess: this.props.route.params.submissionSuccess
       , store_id: this.props.route.params.store_id
       , user_id: this.props.route.params.user_id
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (state.submissionSuccess !== props.route.params.submissionSuccess) {
      return {
        submissionSuccess: props.route.params.submissionSuccess,
      }
    }
    return null
  }

  render() {

    console.log(this.props)
    console.log(this.state)
    console.warn(this.state)

    if( this.state.submissionSuccess ){

    return (  

      <>

      <View style={styles.container}>

      <View style={{ flex: 1, padding: 5, alignSelf: "center", backgroundColor: "#fff"}}>

        <View style={{backgroundColor:'#fff', padding: 10}}></View>      

        <View style={styles.feedBox}>

            <Text size={26} color="#32325D">Thank you!</Text>
            <Text size={26} color="#32325D">Submission Successful</Text>

        </View>

        <View style={{backgroundColor:'#fff', padding: 10}}></View>

        <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.props.navigation.navigate("InputBarcode", {
            store_id: this.state.store_id,
            user_id: this.state.user_id,}
            )
          }}
        style={styles.TouchableOpacityStyle}>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>      

              <View style={styles.feedBox}>

                  <Text size={26} color="#32325D">Scan Barcode</Text>
                  <Text size={26} color="#32325D">+10 Reputation</Text>

              </View>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>

         </TouchableOpacity> 

        <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.props.navigation.navigate("InputStoreCategory", {
            store_id: this.state.store_id,
            user_id: this.state.user_id,
        })
        }}
        style={styles.TouchableOpacityStyle}>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>

              <View style={styles.feedBox}>

                  <Text size={26} color="#32325D">Store Feedback</Text>
                  <Text size={26} color="#32325D">+5 Reputation</Text>

              </View>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>

         </TouchableOpacity>              
      
       </View>

       </View>       

      </>

   );

   }

  return (  

      <>

      <View style={styles.container}>

      <View style={{ flex: 1, padding: 5, alignSelf: "center", backgroundColor: "#fff"}}>

        <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.props.navigation.navigate("InputBarcode", {
            store_id: this.state.store_id,
            user_id: this.state.user_id,}
            )
          }}
        style={styles.TouchableOpacityStyle}>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>      

              <View style={styles.feedBox}>

                  <Text size={26} color="#32325D">Scan a Price</Text>
                  <Text size={26} color="#32325D">+5 Reputation</Text>

              </View>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>

         </TouchableOpacity> 

        <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          this.props.navigation.navigate("InputStoreCategory", {
            store_id: this.state.store_id,
            user_id: this.state.user_id,
        })
        }}
        style={styles.TouchableOpacityStyle}>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>

              <View style={styles.feedBox}>

                  <Text size={26} color="#32325D">Store Feedback</Text>
                  <Text size={26} color="#32325D">+10 Reputation</Text>

              </View>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>

         </TouchableOpacity>              
      
       </View>

       </View>       

      </>

   );

  }
      
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      // justifyContent: 'center',
      // borderStyle: 'solid',
      // flexDirection: 'column',
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
      , paddingHorizontal: 12
      , paddingVertical: 40
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
      , alignItems: 'center'
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
       fontSize: 14,
       color:'#32325D',
       textAlign: 'left',
       textAlignVertical: "center",
       paddingLeft: 10,
       width: deviceWidth * 0.75
    }
  });