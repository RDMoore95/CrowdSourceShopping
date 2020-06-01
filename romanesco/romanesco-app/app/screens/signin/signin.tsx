import React from 'react';
import { StyleSheet, Text, TextInput, Image, View, Button,  ListView } from 'react-native';
import { AsyncStorage } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
const USER_STORAGE_KEY = "@user_id";


// based on signin code taken from https://gist.github.com/dabit3/1c6b1808c9bdf10138f51dae46418d8c & tweaked 

export default class SignIn extends React.Component {
  //navigation = useNavigation();

  setUserId = async (userId) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, userId);
    }
    catch {
      console.log("failed to set userId");
    }
  }

  state = {
      email: '', password: '', userId: ''
    }

    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }

    signIn = async (email: any, password: any) => {
      try {

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: email,
            password: password,
           })
          };

          fetch('http://flip1.engr.oregonstate.edu:4545/signIn', requestOptions)
              .then(response => response.json())
              .then((json) => {
                //console.log(json[0].user_id);
                this.setState( {['userId']: json[0].user_id.toString()});

                if (this.state.userId == null) {
                  alert("Please enter valid credentials, or tap sign up")
                }

                else {
                  //console.log(this.state.userId.toString());
                  this.setUserId(this.state.userId.toString());
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
    });

    render() {
      return (
        <View style={this.styles.container}>
            <Button
            title='Sign Up'
            onPress={() => this.props.navigation.navigate('SignUp')}
         
            color="#000"
          />
          <Text>Welcome to Romanesco! Please sign in below. Or tap the button to sign up.</Text>
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
            onPress = {() => this.signIn(this.state.email, this.state.password)}
          />
        </View>
      )
    }
  


  

}