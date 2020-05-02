import React from 'react';
import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function getProfileData() {
    return fetch('https://flip1.engr.oregonstate.edu:4545/profile')
      .then((response) => response.json())
      .then((json) => {
          console.log(json);
        return json;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getProfileData();