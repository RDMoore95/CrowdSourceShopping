import React from 'react';
import { StyleSheet, Text, Screen, View, Button,  ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export function Feed( { navigation } ) {
    return (
        <Screen style={styles.container}>
            <ScrollView>
                <Text>FEED 1</Text>
                <Text>FEED 2</Text>
                <Text>FEED 3</Text>
                <Text>FEED 4</Text>
                <Text>FEED 5</Text>
                <Button
                onPress={() => navigation.navigate('UserProfile')}
                title="Profile"
                color="#fff"
              />
      <Button
                onPress={() navigation.navigate('Home')}
                title="Feed"
                color="#fff"
              />
            </ScrollView>
        </Screen>
    )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });