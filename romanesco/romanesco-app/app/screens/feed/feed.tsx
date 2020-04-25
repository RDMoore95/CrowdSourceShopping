import React from 'react';
import { StyleSheet, Text, View, Button,  ScrollView } from 'react-native';
import { FeedEntry } from './components/feedEntry';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export function Feed( { navigation } ) {
    return (
        <View style={styles.container}>
            <ScrollView>
                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <FeedEntry></FeedEntry>
                <Button
                    title="Profile"
                    color="#000"
                    onPress={() => {
                      navigation.navigate("Profile", {
                      name: "testName",
                      karma: 710,
                    });
                  }}
                />
                <Button
                onPress={() => navigation.navigate('Home')}
                title="Home"
                color="#000"
                />
            </ScrollView>
        </View>
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