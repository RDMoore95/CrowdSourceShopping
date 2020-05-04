import React, { Component } from 'react';
import { ActivityIndicator,
  FlatList, 
  StyleSheet, 
  Dimensions, 
  ImageBackground,
  View, 
  ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

// var url = "http://192.168.1.2.:5000/getStores/";
var url = "http://flip1.engr.oregonstate.edu:5005/getStores/";

export default class Feed extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true
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
             firstParam: 'user_id',
             secondParam: '121',
         }),
     }).then((response) => response.json())
      .then((json) => {
        this.setState({ data: json.stores });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });       
  }

  render() {

    const { data, isLoading } = this.state;
    // const { data, isLoading } = this.state;

    // console.log(JSON.stringify("Print something"));
    //console.log(JSON.stringify("On stores page"));    
    // console.log(JSON.stringify(response));
    //console.log(response);
    // console.log(error);

    return (

      <Block flex style={styles.profile}>
        <Block flex>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '25%' }}
            >

          <Block flex style={styles.profileCard}>

          <Text size={24} color={argonTheme.COLORS.TEXT}>Your Favorite Stores</Text>

            {isLoading ? <ActivityIndicator/> : (
              <FlatList
                data={data}
                keyExtractor={({ id }, index) => id}
                renderItem={({ item }) => (
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{item.name}, {item.location}</Text>
                )}
              />
            )}

            </Block>
        
            </ScrollView>

          </ImageBackground>

        </Block>

      </Block>

    );
  } 


}


const styles = StyleSheet.create({
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
    //height: height / 2
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
  }
});