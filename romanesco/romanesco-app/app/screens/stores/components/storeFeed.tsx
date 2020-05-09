import React from 'react';
import { Text, View, Button,  ScrollView, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useEffect, useState } from 'react';



export function StoreFeed( props ) {
    FlatListItemSeparator = () => {
        return (
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#000",
            }}
          />
        );
      }
    
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

      // modify on backend this to just get the feed for one particular store?

    useEffect(() => {
      fetch('http://flip1.engr.oregonstate.edu:4545/feedEntries')
        .then((response) => response.json())
        .then((json) => setData(json))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }, []);
    
    return (

        <View style={{ flex: 1, padding: 24 }}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          ItemSeparatorComponent = {FlatListItemSeparator}
          renderItem={({ item }) => (
            <View>
                <Text>{item.time_added.slice(0,10)}</Text>
                <Text>{item.first_name}, {item.last_name}</Text>
                <Text>Store: {item.store_name}, Category: {item.store_feedback_category}</Text>
                <Text>Review: {item.store_feedback_text}</Text>
                </View>
          )}
        />
      )}
    </View>
       
    );
}

{/* <View style={styles.container}>
            <View style={styles.row}>
                <Text>Name: {props.first_name}</Text>
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
        </View> */}

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