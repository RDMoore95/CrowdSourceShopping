import React, {Component} from 'react';
import { StyleSheet, 
  Text, 
  View, 
  Button, 
  ScrollView} from 'react-native';
import { FeedEntry } from './components/feedEntry';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import feedStyles from '../components/feedStyles';
import {NewButton} from "../../components/newButton/newButton";

import { appstyles } from '../../styles/appStyle'

export default class Feed extends React.Component {

  state = {
    }

    onChangeText = (key, val) => {
      this.setState({ [key]: val })
    }

 render() {
  return (

        <View style={appstyles.container}>
            <FeedEntry navigation={this.props.navigation} id_type = 'all' id_value = '0'> </FeedEntry>
            <NewButton navigation={this.props.navigation}></NewButton>
        </View>

    )
  }

  styles = StyleSheet.create({
    container: {
      //flex: 1,
      backgroundColor: '#fffffc',
      alignItems: 'center',
      //justifyContent: 'center',
    },
  });
}