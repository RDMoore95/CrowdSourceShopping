import React from 'react';
import { StyleSheet, Text, TextInput, Image, View, Button,  ListView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// based on signin code taken from https://gist.github.com/dabit3/1c6b1808c9bdf10138f51dae46418d8c & tweaked 

export default class SignIn extends React.Component {
    //navigation = useNavigation();

    state = {
        email: '', password: ''
      }
      onChangeText = (key, val) => {
        this.setState({ [key]: val })
      }
      signIn = async () => {
        const { email, password, } = this.state
        try {


          // Signin Code
            // fetch 
          const success = this.state.email;
          console.log('user successfully signed in!: '+this.state.email, success);
          this.props.navigation.navigate('Romanesco');
        } catch (err) {
          console.log('error signing in: ' +this.state.email, err);
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
              placeholder='Username'
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
              onPress = {() => this.login(this.state.email, this.state.password)}
            />
          </View>
        )
      }
    


    

}