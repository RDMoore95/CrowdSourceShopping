import React from 'react';
import { StyleSheet, Text, TextInput, Image, View, Button,  ListView, ImageBackground, ActivityIndicator } from 'react-native';
import { AsyncStorage } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { NavigationEvents } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const USER_STORAGE_KEY = "@user_id";
const image = require("../../assets/imgs/bg.png");



// based on signin code taken from https://gist.github.com/dabit3/1c6b1808c9bdf10138f51dae46418d8c & tweaked 

export default class SignIn extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '', password: '', userId: '', lat: '', long: '', coordinates_received: false
    }

    this.findCoordinates();
    this.getUserId();

  }

  getUserId = async () => {

    try {
      const userId = await AsyncStorage.getItem(USER_STORAGE_KEY)
      if (userId !== null) {
        this.props.navigation.navigate('Romanesco');
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }
  //navigation = useNavigation();

  setUserId = async (userId) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, userId);
    }
    catch {
      console.log("failed to set userId");
    }
  }

  findCoordinates = async () => {

    let { status } = await Location.requestPermissionsAsync();

    if (status !== 'granted') {
      console.log("location permission denied");
    }

    else {
      let location = await Location.getCurrentPositionAsync({});
      this.setState({lat: location.coords.latitude});
      this.setState({long: location.coords.longitude});
      this.setState({coordinates_received: true});
      //console.log(this.state.lat, this.state.long);
    }
    
  };  

    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }

    signIn = async (email: any, password: any, lat: any, long: any) => {
      try {

        var options = {
          email: email,
          password: password
        }

        if (this.state.coordinates_received) {
          options.lat = lat;
          options.long = long;
        }

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(options)
          };

          fetch('http://flip1.engr.oregonstate.edu:4545/signIn', requestOptions)
              .then(response => response.json())
              .then((json) => {
                //console.log(json[0].user_id);
                if (json[0].error) {
                  alert(json[0].error);
                }

                else {
                  //console.log(this.state.userId.toString());
                  this.setState( {['userId']: json[0].user_id.toString()});
                  this.setUserId(this.state.userId.toString());
                  console.log(this.state.userId);
                  this.props.navigation.navigate('Romanesco');
                }
              })
              .catch(error => console.log(error));


        // Signin Code
          // fetch 


       
      } catch (err) {
        alert('error signing in: ' +this.state.email);
      }
    }
   
    styles = StyleSheet.create({
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
      container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      backgroudImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: "center",
      },
      welcomeMessage: {
        fontSize: 18,
        padding: 18,
        color: "white",
        fontWeight: "bold"
      }
    });

    render() {
      return (
        <>

          <View style={this.styles.container}>
          <ImageBackground
          source={image}
          style={this.styles.backgroudImage}
          >

          <Text style={this.styles.welcomeMessage} color="#32325D">
          Welcome to Romanesco! Please sign in below. Or tap the button to sign up.
          </Text>
          <Button
            title='Sign Up'
            onPress={() => this.props.navigation.navigate('SignUp')}         
            color="#fff"
          />
          <TextInput
            style={this.styles.input}
            placeholder='Email'
            autoCapitalize="none"
            placeholderTextColor='white'
            onChangeText={val => this.onChangeText('email', val)}
          />
          <TextInput
            style={this.styles.input}
            placeholder='Password'
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor='white'
            onChangeText={val => this.onChangeText('password', val)}
          />

          <Button
            title='Sign In'
            // onPress = {() => this.login(this.state.email, this.state.password)}
            onPress = {() => this.signIn(this.state.email, this.state.password, this.state.lat, this.state.long)}
            color="#fff"
          />

          </ImageBackground>
          </View>
        </>

      )
    }
  


  

}