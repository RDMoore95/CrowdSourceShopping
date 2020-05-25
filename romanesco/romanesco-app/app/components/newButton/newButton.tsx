import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Alert, Text, ScrollView, Image, Button, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

//export function NewButton({ navigation: { navigate } }) {
//export function NewButton( {navigation} ){
// export class NewButton extends React.Component {
export function NewButton(){

    const navigation = useNavigation();

    clickHandler = () => {
        //function to handle click on floating Action Button
        // Alert.alert('Floating Button Clicked');
        navigation.navigate('InputPrompt', 
          {
            store_id: '10',
            store_name_fmt: 'My Store',
            store_street: 'Some Street',
            store_city: 'Some City',
          }
        );
      };

    return (
        <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.clickHandler}
        style={styles.TouchableOpacityStyle}>
        <Image
           source={{
            uri:'https://raw.githubusercontent.com/AboutReact/sampleresource/master/plus_icon.png',
          }}
          //source={require('./images/float-add-icon.png')}
          style={styles.FloatingButtonStyle}
        />
        </TouchableOpacity>
    );
}

// export default withNavigation(NewButton);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      // justifyContent: 'center',
    },

    TouchableOpacityStyle: {
      position: 'absolute',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      right: 30,
      bottom: 30,
    },
  
    FloatingButtonStyle: {
      resizeMode: 'contain',
      width: 50,
      height: 50,
      //backgroundColor:'black'
    },
  });