import React from 'react';
import { StyleSheet, TextInput, View, Button,  ListView, AppRegistry,AsyncStorage,Text,TouchableHighlight} from 'react-native';
import { Formik } from 'formik';
// import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// signup code taken from https://gist.github.com/dabit3/1c6b1808c9bdf10138f51dae46418d8c & slightly tweaked 



export default class SignUp extends React.Component {
    //props.navigation = useNavigation();

    validateEmail = (text) => {
      console.log(text);
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(text) === false) {
        console.log("Email is Not Correct");
        this.setState({ email: text })
        return false;
      }
      else {
        this.setState({ email: text })
        console.log("Email is Correct");
        this.setState({correct_email: true});
      }
    }

    validateZipCode = (text) => {
      console.log(text);
      let reg = /^\d{5}(-\d{4})?$/;
      if (reg.test(text) === false) {
        console.log("Zip Code is not valid");
        this.setState( {zip_code: text })
        return false;
      }
      else {
        this.setState({ zip_code: text})
        console.log("Zip Code is Valid");
        this.setState({correct_zipcode: true});
      }
    }
    
    state = {
        email: '', password: '', first_name: '', last_name: '', zip_code: '', correct_email: false, correct_zipcode: false
    }
    onChangeText = (key, val) => {
        this.setState({ [key]: val })
    }
    signUp = async (email: any, first_name: any, last_name: any, password: any, zip_code: any) => {

      if (this.state.correct_email == true && this.state.correct_zipcode == true) {

        try {

          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: email,
              first_name: first_name,
              last_name: last_name,
              password: password,
              zip_code: zip_code
             })
            };
  
              fetch('http://flip1.engr.oregonstate.edu:4545/signUp', requestOptions)
                .then(response => response.json)
                .then(json => console.log(json))
                .catch(json => alert(json.error))
            
          } catch (err) {
            console.log(err);
          }

      } else {

        if (this.state.correct_zipcode == false) {
          alert("Please enter a valid zipcode!");
        }
        if (this.state.correct_email == false) {
          alert("Please enter a valid email!");
        }
        
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
          <Button
            title='Sign Up'
            onPress={() => this.signUp(this.state.email, this.state.first_name, this.state.last_name, this.state.password, this.state.zip_code)}
          />
        </View>
        )
      }
    };


