import React from 'react';
import { Text, View, Button,  ScrollView, StyleSheet } from 'react-native';


export function FeedEntry( props ) {
    
    // to be filled in via server calls...
    props = {
        name: "username",
        karma: "test_val",
        store: "Grocery_Store_name",
        rating: "test_rating",
        review_text: "Lorem Ipsum blagh blah blah"
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text>Name: {props.name}</Text>
                <Text>Karma: {props.karma}</Text>
            </View> 
            <View style={styles.row}>
                <Text>Store Name: {props.store}</Text>
                <Text>Rating: {props.rating}</Text>
            </View> 
            <View style={styles.col}>
                <Text>Grocery Trip Review: </Text>
                <Text>{props.review_text}</Text>
            </View> 
        </View>
       
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column'
    },
    col:{
        flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'row'
    },
    row:{
        flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      borderStyle: 'solid',
      flexDirection: 'column'
    }
  });