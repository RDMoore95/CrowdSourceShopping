import React from 'react';
import { StyleSheet, TextInput, View, Button,  ListView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// signup code taken from https://gist.github.com/dabit3/1c6b1808c9bdf10138f51dae46418d8c & slightly tweaked 

export default class SignUp extends React.Component {
    const navigation = useNavigation();
    
    state = {
        username: '', password: '', dob: '', email: '', zip_code: ''
    }
    onChangeText = (key, val) => {
        this.setState({ [key]: val })
    }
    signUp = async () => {
        const { username, password, email, zip_code } = this.state
        try {


          // here place your signup logic
            // fetch 
          const success = this.state.email;
          console.log('user successfully signed up!: ' + this.state.username, success);
          this.navigation.navigate('Home');
        } catch (err) {
          console.log('error signing up: ' + this.state.username, err);
        }
    }
     
    render() {
      return (
        <View style={styles.container}>
          <TextInput
            style={styles.input}
            placeholder='Email'
            autoCapitalize="none"
            placeholderTextColor='white'
            onChangeText={val => this.onChangeText('email', val)}
          />
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
          <TextInput
            style={styles.input}
            placeholder='Birthday'
            secureTextEntry={true}
            autoCapitalize="none"
            placeholderTextColor='white'
            onChangeText={val => this.onChangeText('birthday', val)}
          />
          <TextInput
            style={styles.input}
            placeholder='Zip Code'
            autoCapitalize="none"
            placeholderTextColor='white'
            onChangeText={val => this.onChangeText('zip_code', val)}
          />
          <Button
            title='Sign Up'
            onPress={this.signUp}
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