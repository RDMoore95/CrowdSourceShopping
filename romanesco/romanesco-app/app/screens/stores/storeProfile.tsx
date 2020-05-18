import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  ImageBackground
  } from 'react-native';
import { useEffect, useState } from 'react';
//import {StoreFeed} from './components/storeFeed';
import { FeedEntry } from '../feed/components/feedEntry';

import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";

import Images from '../../assets/imgs';

// let deviceWidth = Dimensions.get('window').width
const { width, height } = Dimensions.get("screen");
const thumbMeasure = (width - 48 - 32) / 3;
let deviceWidth = Dimensions.get('window').width

// refactor for store feed... per store?


export function StoreProfile( { route, navigation }, {} ) {

    // Get store_id
    const { store_id } = route.params;
    const { store_name_fmt } = route.params;
    const { store_street } = route.params;
    const { store_city } = route.params;

    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    // store_name, store_address, price_rating, crowd_rating, service_rating, store_rating are the data variables
    // I mocked - but feel free to change!

    useEffect(() => {
        // something like 4545/store/{data.store_id}?
      fetch('http://flip1.engr.oregonstate.edu:4545/profile')
        .then((response) => response.json())
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
              <Block flex style={styles.profileCard}> 
                <Block middle style={styles.avatarContainer}>
                  <Image 
                    // source={require('../../assets/imgs/traderjoes.png')}
                    source = {Images.stores[store_name_fmt]}
                    style={styles.avatar}
                  
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
                      RECOMMENDED STORE
                    </Button>
                  </Block> 

                  <Block row space="between">
                  <Text bold size={28} color="#32325D">
                      {data.store_rating}
                    </Text>
                  </Block>

                  <Block row space="between">
                    <Block middle>
                      <Text
                        bold
                        size={18}
                        color="#525F7F"
                        style={{ marginBottom: 4 }}
                      >
                         {data.price_rating}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Price</Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        {data.crowd_rating}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Traffic</Text>
                    </Block>
                    <Block middle>
                      <Text
                        bold
                        color="#525F7F"
                        size={18}
                        style={{ marginBottom: 4 }}
                      >
                        {data.service_rating}
                      </Text>
                      <Text size={12} color={argonTheme.COLORS.TEXT}>Service</Text>
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

                  <FeedEntry> </FeedEntry>
              
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
  }
});
