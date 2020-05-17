import React, { Component } from 'react';
import { ActivityIndicator,
  Button,
  FlatList, 
  StyleSheet, 
  Dimensions, 
  ImageBackground,
  Text,
  View, 
  ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withNavigation } from 'react-navigation';
import Modal from 'react-native-modal';

import { Block, theme } from "galio-framework";
//import { Button } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import{ StoreProfile } from "./storeProfile"

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;

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
    console.warn("toggling")
    this.setState({ isModalVisible: !this.state.isModalVisible})
  };  

  render() {

    const { data, isLoading } = this.state;
    console.log(data);

    return (

      <>

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

          <Text size={24} color={argonTheme.COLORS.TEXT}
                  onPress={() => {
                        console.warn(this.state.isModalVisible)
                        // this.props.navigation.navigate("StoreProfile"), {
                        // name: "testName",
                        // karma: 710,};
                      }
                    }
          >Your Favorite Stores

          </Text>

           <View >
            <Button
              onPress={() => this.props.navigation.navigate('MyModal')}
              title="Open Modal"
            />
            <Modal isVisible={this.state.isModalVisible}>
              <View >
                <Text>Hello!</Text>
                <Button title="Hide modal" onPress={this.toggleModal} />
              </View>
            </Modal>
          </View>

            {isLoading ? <ActivityIndicator/> : (
              <FlatList
                data={data}
                //keyExtractor={({ id }, index) => id}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <>
                  <View 
                    >
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{item.store_name}</Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{item.store_street}</Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>{item.days_since_last_feedback}</Text>
                  </View>
                  </>
                )}
              />
            )}

            </Block>
        
            </ScrollView>

          </ImageBackground>

        </Block>

      </Block>

      </>

    );
  } 

}

export default withNavigation(StoreFeed);


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