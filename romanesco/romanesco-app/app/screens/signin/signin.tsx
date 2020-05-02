import React from 'react';
import { StyleSheet, Text, TextInput, Image, View, Button,  ListView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// based on signin code taken from https://gist.github.com/dabit3/1c6b1808c9bdf10138f51dae46418d8c & tweaked 

export default class SignUp extends React.Component {
    const navigation = useNavigation();

    state = {
        username: '', password: ''
      }
      onChangeText = (key, val) => {
        this.setState({ [key]: val })
      }
      signIn = async () => {
        const { username, password, } = this.state
        try {


          // Signin Code
            // fetch 
          const success = this.state.username;
          console.log('user successfully signed in!: '+this.state.username, success);
          this.navigation.navigate('Home');
        } catch (err) {
          console.log('error signing in: ' +this.state.username, err);
        }
      }
     
      render() {
        return (
          <View style={styles.container}>
              <Button
              title='Sign Up'
              onPress={() => this.navigation.navigate('SignUp')}
           
              color="#000"
            />
            <Text>Welcome to Romanesco! Please sign in below. Or tap the button to sign up.</Text>
            <TextInput
              style={styles.input}
              placeholder='Username'
              autoCapitalize="none"
              placeholderTextColor='white'
              onChangeText={val => this.onChangeText('username', val)}
            />
            <TextInput
              style={styles.input}
              placeholder='Password'
              secureTextEntry={true}
              autoCapitalize="none"
              placeholderTextColor='white'
              onChangeText={val => this.onChangeText('password', val)}
            />
            
            <Button
              title='Sign In'
              onPress={this.signIn}
            />
          </View>
        )
      }
    };
}

const styles = StyleSheet.create({
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