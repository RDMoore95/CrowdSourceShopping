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

var url = "http://192.168.1.7:5000";
// var url = "http://flip1.engr.oregonstate.edu:5005";

export default class InputBarcodeScanned extends React.Component {  

  constructor(props) {

    super(props)

    this.state = {
      data: [],
      isLoading: true,
      refresh: false,
      barcodeData: this.props.route.params.barcodeData,
      item_name: 'Known',
      price: '',
      sale: false,
      store_id: this.props.route.params.store_id,
      user_id: "",
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
    fetch(url + '/getBarcode/', {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             barcodeData: this.state.barcodeData,
         }),
     }).then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      }).finally(() => {
        this.setState({ isLoading: false });
      });       
  }


  // Adding item to database
  addPriceFeedback(){

  this.getUserId()
    .then(() => {
      fetch(url + '/addPriceFeedback/', {
                   method: 'POST',
                   headers: {
                       Accept: 'application/json',
                       'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({
                       user_id: this.state.user_id,
                       item_name: this.state.item_name,
                       barcodeData: this.state.barcodeData,
                       price: this.state.price,
                       sale: this.state.sale,
                       store_id: this.state.store_id,
                   })
    })
    })
  }

  render() {

      if( this.state.isLoading )
        return null;

      // KNOWN ITEM
      // Show item name
      if ( this.state.data[0]["item_found"] == '1' ){

        return(

          <>

          <View style={styles.container}>

          <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>

          <View style={{ flex: 1, padding: 5, alignSelf: "center", backgroundColor: "#fff"}}>

                  <View style={{backgroundColor:'#fff', padding: 10}}></View>      

                  <View style={styles.feedBox}>

                      <Text
                        style={{ fontSize: 26, textAlign: 'center' }}                    
                      >{this.state.barcodeData}</Text>

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <Text
                        style={{ fontSize: 20, textAlign: 'center' }}                    
                      >{this.state.data[0]["item_name"]}</Text>

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <TextInput
                        style={{height: 40, fontSize: 20, textAlign: 'center' }}
                        placeholder="Enter Price"
                        keyboardType={'numeric'}
                        defaultValue={this.state.price}
                        onChangeText={(price) => this.setState({price})}
                      />

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <Text
                        style={{ fontSize: 20, textAlign: 'center' }}                    
                      >Item on Sale?</Text>

                      <View style={{backgroundColor:'#fff', padding: 5}}></View>

                      <View style={{alignItems: 'center'}}>
                      <Switch
                      value={false}
                      onValueChange={(sale) => this.setState({sale})}
                      disabled={false}
                      activeText={'Yes'}
                      inActiveText={'No'}
                      backgroundActive={'green'}
                      backgroundInactive={'gray'}
                      circleActiveColor={'#30a566'}
                      circleInActiveColor={'#000000'}
                      />
                      </View>

                      <View style={{backgroundColor:'#fff', padding: 20}}></View>

                      <Button
                      title = 'Submit'
                      onPress={() => {
                        this.addPriceFeedback()
                        this.props.navigation.navigate("InputPrompt", {submissionSuccess: true});
                      }}
                      >                      
                      </Button>

                  </View>

                  <View style={{backgroundColor:'#fff', padding: 10}}></View>

           </View>

           </TouchableWithoutFeedback>

           </View>       

          </>

          )

       }  

       // UNKNOWN ITEM
       // Prompt user to enter name
        return(

          <>

          <View style={styles.container}>

          <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>

          <View style={{ flex: 1, padding: 5, alignSelf: "center", backgroundColor: "#fff"}}>

                  <View style={{backgroundColor:'#fff', padding: 10}}></View>      

                  <View style={styles.feedBox}>

                      <Text
                        style={{ fontSize: 26, textAlign: 'center' }}                    
                      >{this.state.barcodeData}</Text>

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <Text
                        style={{ fontSize: 26, textAlign: 'center' }}                    
                      > New Item!</Text>

                      <View style={{backgroundColor:'#fff', padding: 3}}></View>

                      <Text
                        style={{ fontSize: 20, textAlign: 'center' }}                    
                      >Tell us the item name for +2 Rep</Text>

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <TextInput
                        style={{height: 40, fontSize: 20, textAlign: 'center' }}
                        placeholder="Enter Name"
                        onChangeText={(item_name) => this.setState({item_name})}
                      />

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <TextInput
                        style={{height: 40, fontSize: 20, textAlign: 'center' }}
                        placeholder="Enter Price"
                        keyboardType={'numeric'}
                        defaultValue={this.state.price}
                        onChangeText={(price) => this.setState({price})}
                      />

                      <View style={{backgroundColor:'#fff', padding: 10}}></View>

                      <Text
                        style={{ fontSize: 20, textAlign: 'center' }}                    
                      >Item on Sale?</Text>

                      <View style={{backgroundColor:'#fff', padding: 5}}></View>

                      <View style={{alignItems: 'center'}}>
                      <Switch
                      value={false}
                      onValueChange={(sale) => this.setState({sale})}
                      disabled={false}
                      activeText={'Yes'}
                      inActiveText={'No'}
                      backgroundActive={'green'}
                      backgroundInactive={'gray'}
                      circleActiveColor={'#30a566'}
                      circleInActiveColor={'#000000'}
                      />
                      </View>

                      <View style={{backgroundColor:'#fff', padding: 20}}></View>

                      <Button
                      title = 'Submit'
                      onPress={() => {
                        this.addPriceFeedback() // Add item to database
                        this.props.navigation.navigate("InputPrompt", {submissionSuccess: true});
                      }}
                      >                      
                      </Button>

                  </View>

                  <View style={{backgroundColor:'#fff', padding: 10}}></View>

           </View>

           </TouchableWithoutFeedback>

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
       fontSize: 14,
       color:'#32325D',
       textAlign: 'left',
       textAlignVertical: "center",
       paddingLeft: 10,
       width: deviceWidth * 0.75
    }
  });