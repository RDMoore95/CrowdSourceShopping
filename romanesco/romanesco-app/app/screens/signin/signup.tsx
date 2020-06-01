import React from 'react';
import { StyleSheet, TextInput, View, Button,  ListView, AppRegistry,AsyncStorage,Text,TouchableHighlight,PermissionsAndroid} from 'react-native';
import { Formik } from 'formik';
import * as Location from 'expo-location';
// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Geolocation from 'react-native-geolocation-service';

// signup code taken from https://gist.github.com/dabit3/1c6b1808c9bdf10138f51dae46418d8c & slightly tweaked 



export default class SignUp extends React.Component {
  //props.navigation = useNavigation();

  validateEmail = (text) => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log("Email is Not Correct");
      this.setState({correct_email: false});
      this.setState({ email: text })
      return false;
    }
    else {
      this.setState({ email: text })
      console.log("Email is Correct");
      this.setState({correct_email: true});
      console.log(this.state.email);
      console.log("coordinates",this.state.coordinates_received);
    }
  }

  validateZipCode = (text) => {
    console.log(text);
    let reg = /^\d{5}(-\d{4})?$/;
    if (reg.test(text) === false) {
      console.log("Zip Code is not valid");
      this.setState({correct_zipcode: false});
      this.setState( {zip_code: text })
      return false;
    }
    else {
      this.setState({ zip_code: text})
      console.log("Zip Code is Valid");
      this.setState({correct_zipcode: true});
      console.log(this.state.correct_email);
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
    }
    
  };
  
  state = {
      email: '', 
      password: '', 
      first_name: '', 
      last_name: '', 
      zip_code: '', 
      lat: '',
      long: '',
      correct_email: false, 
      correct_zipcode: false,
      coordinates_received: false,
      isLoading: false
  }

  onChangeText = (key, val) => {
      this.setState({ [key]: val })
  }
  signUp = async (email: any, first_name: any, last_name: any, password: any, zip_code: any, lat: any, long: any) => {


      try {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: email,
            first_name: first_name,
            last_name: last_name,
            password: password,
            zip_code: zip_code,
            lat: lat,
            long: long
           })
          };

          console.log(requestOptions);

            fetch('http://flip1.engr.oregonstate.edu:4545/signUp', requestOptions)
              .then(response => response.json())
              .then(json => {


                if (json[0].error !== null) {
                  alert(json[0].error)
                }

                console.log(json)

              })
              .catch(error => console.log(error))
          
        } catch (err) {
          console.log(err);
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
    });

  componentDidMount() {
    this.findCoordinates();
  }


  render() {
    return (
      <View style={this.styles.container}>
        <TextInput
          style={this.styles.input}
          placeholder='Email'
          autoCapitalize="none"
          maxLength={320}
          placeholderTextColor='white'
          onChangeText={val => this.validateEmail(val)}
        />
        <TextInput
          style={this.styles.input}
          placeholder='First Name'
          autoCapitalize="none"
          maxLength={50}
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('first_name', val)}
        />
        <TextInput
          style={this.styles.input}
          placeholder='Last Name'
          autoCapitalize="none"
          maxLength={50}
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('last_name', val)}
        />
        <TextInput
          style={this.styles.input}
          placeholder='Password'
          secureTextEntry={true}
          autoCapitalize="none"
          maxLength={30}
          placeholderTextColor='white'
          onChangeText={val => this.onChangeText('password', val)}
        />
        <TextInput
          style={this.styles.input}
          placeholder='Zip Code'
          autoCapitalize="none"
          maxLength={10}
          placeholderTextColor='white'
          onChangeText={val => this.validateZipCode(val)}
        />
        {(this.state.correct_email != true || this.state.correct_zipcode != true) ? 

        <Button
        disabled={true}
        title='Sign Up'
        onPress={() => alert("this shouldn't happen")}
        />

            : (

          <Button
          title='Sign Up'
          onPress={() => this.signUp(this.state.email, this.state.first_name, this.state.last_name, this.state.password, this.state.zip_code, this.state.lat, this.state.long)}
          />
          
        )}
      </View>
      )
    }
  };


