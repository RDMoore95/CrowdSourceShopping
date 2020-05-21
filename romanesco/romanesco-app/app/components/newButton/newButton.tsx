import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Alert, Text, ScrollView, Image, Button, View, TouchableOpacity } from 'react-native';

export function NewButton() {
    clickHandler = () => {
        //function to handle click on floating Action Button
        Alert.alert('Floating Button Clicked');
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

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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