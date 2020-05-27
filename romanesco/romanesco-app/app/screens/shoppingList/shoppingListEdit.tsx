import React from 'react';
import { 
  StyleSheet,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert, 
  Modal, 
  TextInput
  } from 'react-native';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { withNavigation } from 'react-navigation';
import { Block, Text, theme } from "galio-framework";
import { Button } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

//const url = "localhost:5000";
const url = "http://flip1.engr.oregonstate.edu:5005";

export class ShoppingList extends React.Component {

    constructor(props) {

      super(props);

      this.state = {
        data: [],
        tags: [],
        isLoading: false,
        refresh: false,
        firstRender: true,
        modalTag1Visible: false,
        modalTag2Visible: false,
        modalTag3Visible: false,
        modalAddVisible: false,
        text_buffer: ""
      };
    }

    state = {}

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
    
    /*
    
    */
   componentDidMount() {
    /*
    this.setState({ loading: true });
    fetch(url + '/shoppingList/' + this.props.user_id + this.props.list_id,  {
         method: 'POST',
         headers: {
             Accept: 'application/json',
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             id_type: this.props.id_type,
             id_value: this.props.id_value,
         }),
     }).then((response) => response.json())
      .then((json) => {
        this.setState({ data: json });
      }).finally(() => {
        this.setState({ isLoading: false });
      });     
      */  
     this.setState(
         {
             data:  [
                {id: "1", name: "TP", price: "0.99", quantity: "1", units: "package"}, 
                {id: "2", name: "Yeast", price: "1.00", quantity: "3", units: "package"}, 
                {id: "3", name: "Potatoes", price: "5.00", quantity: "5", units: "LBs"}
            ]
            
        })
        this.setState(
        {
            tags: [
               {id: "1", name: 'Baking'},
               {id: "2", name: 'Cooking'},
               {id: "3", name: 'Frozen'},
           ]
        }
     )
  }
  
  renderSeparator = () => {
    return (
      <View style={{backgroundColor:'#fff', flex:1 ,padding: 10}}></View>
    );
  };

  setModalTag1Visible = (visible) => {
    this.setState({ modalTag1Visible: visible });
  }

  setModalTag2Visible = (visible) => {
    this.setState({ modalTag2Visible: visible });
  }

  setModalTag3Visible = (visible) => {
    this.setState({ modalTag3Visible: visible });
  }

  setModalAddVisible = (visible) => {
    this.setState({ modalAddVisible: visible });
  }

   // Render each feed entry in a flatlist
   render() {  

       return ( 
      <ScrollView >
        <Block flex>


              <Block flex style={styles.profileCard}>
                <Block middle style={styles.avatarContainer}>
                <Text size={28} color="#32325D" style={{ marginTop: height * .15 }}>
                      Shopping List
                    </Text>
                                                                                              

                </Block>
                    <Button 
                        style = {styles.listButton}
                        onPress={() => Alert.alert('Reccomend button pressed')}>
                        <Icon
                          name="md-pizza" size={25}
                        />
                    </Button>
                    <Button 
                        style = {styles.listButton}
                        onPress={() => this.setModalAddVisible()}>
                        <Icon
                          name="ios-add-circle-outline" size={25}
                        />
                    </Button>

                    <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.modalAddVisible}
                                onRequestClose={() => {
                                  Alert.alert("Modal has been closed.");
                                }}
                            >
                              <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                  <Text style={styles.modalText}>Add an item!</Text>
                                  <TextInput
                                    style={styles.input}
                                    placeholder='What are you shopping for?'
                                    autoCapitalize="none"
                                    maxLength={50}
                                    placeholderTextColor='white'
                                    onChangeText={val => this.onChangeText('text_buffer', val)}
                                  />
                                  <Button
                                    style={styles.listButton}
                                    onPress={() => 
                                      this.setModalAddVisible(!this.state.modalAddVisible) }>
                                    <Text>Submit</Text>
                                  </Button>  
                                  <Button
                                    style={styles.listButton}
                                    onPress={() => 
                                      this.setModalAddVisible(!this.state.modalAddVisible) }>
                                    <Text>Cancel</Text>
                                  </Button>
                                </View>
                              </View>
                            </Modal>

                    <View  >
                        <Button flex
                            style={styles.tag1}
                            onPress={() => this.setModalTag1Visible()}>
                                <Text>Add Tag</Text>
                        </Button>
                        <FlatList
                                data={this.state.tags}
                                horizontal = {true}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListHeaderComponent = { this.renderSeparator }
                                renderItem={({ item, id }) => (
                                <View>
                                    <View flex>
                                        <Text>{item.name}</Text>
                                    </View>
                                </View>)}
                                keyExtractor={(item, id) => id.toString()}
                            />
                        

                        <Modal
                                animationType="slide"
                                transparent={false}
                                visible={this.state.modalTag1Visible}
                                onRequestClose={() => {
                                  Alert.alert("Modal has been closed.");
                                }}
                            >
                              <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                  <Text style={styles.modalText}>Tag 1!</Text>
                                  <TextInput
                                    style={styles.input}
                                    placeholder=' Tag 1'
                                    autoCapitalize="none"
                                    maxLength={50}
                                    placeholderTextColor='white'
                                    onChangeText={val => this.onChangeText('text_buffer', val) }
                                  />
                                  <Button
                                    style={styles.listButton}
                                    onPress={() => 
                                      this.setModalTag1Visible(!this.state.modalTag1Visible) }>
                                    <Text>Submit</Text>
                                  </Button>  
                                  <Button
                                    style={styles.listButton}
                                    onPress={() => 
                                      this.setModalTag1Visible(!this.state.modalTag1Visible) }>
                                    <Text>Cancel</Text>
                                  </Button>
                                </View>
                              </View>
                            </Modal>

                        


                    </View>
                <Block>
                    <View style={{ flex: 1, padding: 24 }}>
                    {this.state.isLoading ? <ActivityIndicator/> : (
                            <FlatList
                                data={this.state.data}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListHeaderComponent = { this.renderSeparator }
                                renderItem={({ item, id }) => (
                                <View>
                                    <View style={styles.listRow}>
                                        <Text>Name: {item.name}</Text>
                                        <Text>Price: {item.price}</Text>
                                        <Icon
                                          name="ios-close-circle-outline" size={25}
                                          onPress={() => Alert.alert('Remove Item')}
                                        />
                                    </View>
                                </View>)}
                                keyExtractor={(item, id) => id.toString()}
                            />
                            )}                
                    </View>
                </Block>
              </Block>
        </Block>
      </ScrollView>

        )
    };
}

const styles = StyleSheet.create({
    tag1: {flex: 1, color: theme.COLORS.LIGHT_GREEN},
    tag2: {flex: 1, color: theme.COLORS.GREEN},
    tag3: {flex: 1, color: theme.COLORS.DARK_GREEN},
    listButton: {
        width: width * .8,
        height: height * .1,
        color: theme.COLORS.GREEN
    },
  listRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
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
    height: thumbMeasure
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }, 
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
});
