import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Alert, Text, ScrollView, Image, Button, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { appstyles } from '../../styles/appStyle'

//export function NewButton({ navigation: { navigate } }) {
//export function NewButton( {navigation} ){
// export class NewButton extends React.Component {
export function NewButton(){

    const navigation = useNavigation();

    clickHandler = () => {
        //function to handle click on floating Action Button
        navigation.navigate('InputPromptStores', 
          {}
        );
      };

    return (
        <TouchableOpacity
        activeOpacity={0.7}
        onPress={this.clickHandler}
        style={appstyles.TouchableOpacityStyle}>
            <Icon
                name="ios-add-circle" size={50}
            />
        </TouchableOpacity>
    );
}

