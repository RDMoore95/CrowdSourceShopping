import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
  } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";


import { FeedEntry } from '../feed/components/feedEntry';
import Images from '../../assets/imgs';

import {NewButton} from "../../components/newButton/newButton";

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
let deviceWidth = Dimensions.get('window').width

var url = "http://192.168.1.7:5000";
// var url = "http://flip1.engr.oregonstate.edu:5005";

export default class FeedProfile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      haveUserId: false,
      isLoading: true,
      userId: this.props.route.params.user_id
    };
  }

 getAPIData(){

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: this.state.userId.toString() })
    };

    fetch(url + '/getUserProfile/', requestOptions)
        .then(response => response.json())
        .then((json) => {
          console.log("json", json);
          this.setState({data: json[0]})
        
        })
        .catch((error) => console.error(error))
        .finally(() => this.setState({isLoading: false}))

 } 

 componentDidMount() {
   this.getAPIData()
 };

 onRefresh() {
  this.setState({isLoading: true});
  this.getAPIData()
}

  render() {

    const { data, isLoading } = this.state;

    return (
      <View style={styles.profile}>
        {isLoading ? <ActivityIndicator/> : (

        <Block flex>
                  
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width, marginTop: '5%', backgroundColor:'#fff' }}
          refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={() => this.onRefresh()}
            tintColor="clear"
          />
        }
        >

          <TouchableOpacity 
          onPress={() => {
            this.props.navigation.goBack()
            // this.props.navigation.navigate("Feed"), {};
          }}
          style={styles.feedBox}
          >
          <Text bold size={20} color="#32325D">Dismiss</Text>
          </TouchableOpacity>

          <View style={{backgroundColor:'#fff', padding: 5}}></View>

          <Block flex style={styles.profileCard}> 
            <Block middle style={styles.avatarContainer}>
              <Image 
                source = {Images.reputation[data.user_reputation_category_id]}
                style={styles.avatar}
              
              /> 
            </Block>
            <Block style={styles.info}>
              <Block
                middle
                row
                space="evenly"
                style={{ marginTop: 20, paddingBottom: 24 }}
                >
                <Button
                  style={{ backgroundColor: argonTheme.COLORS.INFO}}
                >
                <Text
                    bold
                    size={20}
                    color="white"
                  >
                  {data.user_reputation_category_name}
                </Text>
                </Button>
              </Block> 

              <Block row space="between">
              <Text bold size={28} color="#32325D">
                  {data.store_rating}
                </Text>
              </Block>
              
              <Block row space="between" alignSelf="center">
                <Block middle style={{ paddingHorizontal: 16 }}>
                  <Text
                    bold
                    size={18}
                    color="#525F7F"
                    style={{ marginBottom: 4, marginLeft: 4, marginRight: 4 }}
                  >
                    {data.user_received_net}
                  </Text>
                  <Text size={12} color={argonTheme.COLORS.TEXT}>Reputation</Text>
                </Block>
                <Block middle style={{ paddingHorizontal: 16 }}>
                  <Text
                    bold
                    color="#525F7F"
                    size={18}
                    style={{ marginBottom: 4, marginLeft: 4, marginRight: 4, paddingHorizontal: 20 }}
                  >
                    {data.price_feedback}
                  </Text>
                  <Text size={12} color={argonTheme.COLORS.TEXT}>Prices Tracked</Text>
                </Block>
                <Block middle style={{ paddingHorizontal: 16 }}>
                  <Text
                    bold
                    color="#525F7F"
                    size={18}
                    style={{ marginBottom: 4, marginLeft: 4, marginRight: 4 }}
                  >
                    {data.store_feedback}
                  </Text>
                  <Text size={12} color={argonTheme.COLORS.TEXT}>Store Reviews</Text>
                </Block>
              </Block>

            </Block>
            <Block flex>
              <Block middle style={styles.nameInfo}>
                <Text bold size={28} color="#32325D">
                  {data.first_name + " " + data.last_name}
                </Text>
                <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                  San Francisco, USA
                </Text>
              </Block>    

              <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                <Block style={styles.divider} />
              </Block>
              <Block middle>
                <Text
                  size={16}
                  color="#525F7F"
                  style={{ textAlign: "center" }}
                >
                  Superstar Shopper! Trader Joe's >>>
                </Text>

              </Block>

              </Block>

              </Block>

              <FeedEntry id_type = 'user' id_value = {this.state.userId}> </FeedEntry>

              <View style={{backgroundColor:'#fff', padding: 10}}></View>
          
        </ScrollView>

        </Block>

        )}
      
    </View>
    )
  }
};

const styles = StyleSheet.create({
profile: {
  backgroundColor:'#fff',
  flex: 1,
},
profileContainer: {
  height: height,
  padding: 0,
  zIndex: 1,
  width: deviceWidth * 0.8,
  backgroundColor:'#fff',
},
profileBackground: {
  width: deviceWidth * 0.8,
  height: height / 2,
},
profileCard: {
  // position: "relative",
  padding: theme.SIZES.BASE,
  marginHorizontal: theme.SIZES.BASE,
  marginTop: 65,
  borderRadius: 10,
  borderWidth: 1,
  // borderTopLeftRadius: 6,
  // borderTopRightRadius: 6,
  borderColor: '#F7FAFC',
  backgroundColor: '#fff',
  shadowColor: "black",
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 8,
  shadowOpacity: 0.2,
  zIndex: 2,
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
  height: thumbMeasure,
  backgroundColor:'#fff'
},
feedBox: {
  backgroundColor:'#fcfcfc'
  , paddingHorizontal: 6
  , paddingVertical: 12
  , marginHorizontal: theme.SIZES.BASE
  , borderColor: '#d3d3d3'
  , borderRadius: 10
  , borderWidth: 1
  , shadowColor: "black"
  , shadowOffset: { width: 0, height: 0 }
  , shadowRadius: 8
  , shadowOpacity: 0.2
  , zIndex: 2
  , justifyContent: 'center'
  , alignItems: 'center'
},
});
