import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  TouchableOpacity
  } from 'react-native';
import { useEffect, useState } from 'react';
import { FeedEntry } from '../feed/components/feedEntry';
import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import { useNavigation } from '@react-navigation/native';

import Images from '../../assets/imgs';

const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
let deviceWidth = Dimensions.get('window').width

// var url = "http://192.168.1.7:5000";
var url = "http://flip1.engr.oregonstate.edu:5005";

export function StoreProfile( { route }, {} ) {

    const navigation = useNavigation();

    // Get store_id
    const { store_id } = route.params;
    const { store_street } = route.params;
    const { store_city } = route.params;
    const { user_id } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [valid, setValid] = useState(true)

    useEffect(() => {
      fetch(url + '/getStore/', {
           method: 'POST',
           headers: {
               Accept: 'application/json',
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({
               store_id: store_id,
           }),
       }).then((response) => response.json())
        .then((json) => setData(json[0]))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false))
    }, []);

    return (    

      <View style={styles.profile}>
        <Block flex>
          
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ width, marginTop: '5%', backgroundColor:'#fff' }}
            > 

            <TouchableOpacity 
                onPress={() => {
                  navigation.navigate("Stores"), {};
                }}
                style={styles.feedBox}
                >
                <Text bold size={20} color="#32325D">Dismiss</Text>
            </TouchableOpacity>

            <View style={{backgroundColor:'#fff', padding: 3}}></View>

              <Block flex style={styles.profileCard}> 
                <Block middle style={styles.avatarContainer}>
                
                  <Image 
                    source = {Images.stores[data.store_name_fmt]}
                    onError={() => setValid(false)}
                    defaultSource = {Images.stores["romanescostoredefault"]}
                    style={styles.avatar} 
                    backgroundColor = "#fcfcfc"
                  /> 
                </Block>
                <Block style={styles.info}>
                  <Block
                    middle
                    row
                    space="evenly"
                    style={{ marginTop: 20, paddingBottom: 24 }}
                    >
                    <Button
                      style={{ backgroundColor: argonTheme.COLORS.INFO }}
                    >
                     <Text
                        bold
                        size={18}
                        color="white"
                      >
                      {data.store_name}
                     </Text>                      
                    </Button>
                  </Block> 

                  <Block row space="between">
                  <Text bold size={28} color="#32325D">
                      {data.store_rating}
                    </Text>
                  </Block>

                  <Block row space="between" alignSelf="center">
                    <Block middle style={{ paddingHorizontal: 16 }}>
                      <Text
                        bold
                        size={18}
                        color="#525F7F"
                        style={{ marginBottom: 4 }}
                      >
                         {data.reviewers}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Romanescos</Text>
                    </Block>
                    <Block middle style={{ paddingHorizontal: 16 }}>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        {data.prices_tracked}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Prices Tracked</Text>
                    </Block>
                    <Block middle style={{ paddingHorizontal: 16 }}>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        {data.reviews_tracked}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Store Reviews</Text>
                    </Block>
                    
                  </Block>

                </Block>
                <Block flex>
                  <Block middle style={styles.nameInfo}>
                    <Text bold size={28} color="#32325D">
                      {store_street}
                    </Text>
                    <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                      {store_city}
                    </Text>
                  </Block>
                            
                  </Block>
                  </Block>

                  <View style={{backgroundColor:'#fff', padding: 10}}></View>

                  <TouchableOpacity 
                    onPress={() => navigation.navigate('InputPrompt', 
                      {
                        store_id: data.store_id,
                        user_id: user_id
                      }
                    )
                    }
                    style={styles.feedBox}
                  >
                    <Text style={styles.headline}> 
                    Review Store
                    </Text>
                  </TouchableOpacity>

                  <FeedEntry navigation={navigation} id_type = 'store' id_value = {store_id}> </FeedEntry>
              
            </ScrollView>
 
        </Block>
      </View>

        )
};



const styles = StyleSheet.create({
  profile: {
    backgroundColor:'#fff',
    flex: 1,
  },
  profileContainer: {
    height: height,
    padding: 0,
    zIndex: 1,
    width: deviceWidth * 0.8,
    backgroundColor:'#fff',
  },
  profileBackground: {
    width: deviceWidth * 0.8,
    height: height / 2,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderRadius: 10,
    borderWidth: 1,
    // borderTopLeftRadius: 6,
    // borderTopRightRadius: 6,
    borderColor: '#F7FAFC',
    backgroundColor: '#fff',
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 35
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
    backgroundColor:'#fff'
  },
  feedBox: {
    backgroundColor: '#fff'
    , paddingHorizontal: 6
    , paddingVertical: 12
    , marginHorizontal: theme.SIZES.BASE
    , borderColor: '#d3d3d3'
    , borderRadius: 10
    , borderWidth: 1
    , shadowColor: "black"
    , shadowOffset: { width: 0, height: 0 }
    , shadowRadius: 8
    , shadowOpacity: 0.2
    , zIndex: 2
    , justifyContent: 'center'
    , alignItems: 'center'
  },
  headline: {
     fontSize: 16,
     fontWeight: 'bold',
     color:'#32325D',
     textAlign: 'center',
     textAlignVertical: "center",
     paddingLeft: 10,
     width: deviceWidth * 0.75
  },
});
