import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import Metrics from '../Themes/Metrics';
import Colors from '../Themes/Colors';
import Images from '../Themes/Images';
import { Card, ListItem, Button, Slider, CheckBox, SearchBar } from 'react-native-elements'
import firebase from 'firebase';

/*
  Displays a Jedi ID Card
  start at
  load more
*/
export default class GroupBlock extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      image: null,
      itemName: '',
      category: '',
      price: '',
      description: '',
      convoKey: '',
      userName: '',
      sellerName: '',
      previousMessage: false,
    }

    console.log(JSON.stringify("groupblock " + props));
    console.log("groupblock uri " + this.props.jedi.photo);
  }

  openMovingGroupPurchaseScreen() {
    console.log('pressed');
    this.props.purchaseMovingGroup(this.props.jedi);
  }

  onPressMessageFreelancer = async () => {
    console.log('testing message seller');
     await this.rememberMessage();
     await this.add();
     console.log("convokey: " + this.state.convoKey);
     this.openMessageScreen();
     this.props.navigation.navigate('MessagesScreen', {key: this.state.convoKey});
    //query
  }

  openMessageScreen() {
    console.log("pressed message: ");
    this.props.messageBlock(this.state.convoKey);
  }


    rememberMessage = async () => {
      try {
          const key1 = await AsyncStorage.getItem(firebase.auth().currentUser.uid+this.props.jedi.id);
          console.log("key1: " + key1);
          const key2 = await AsyncStorage.getItem(this.props.jedi.id+firebase.auth().currentUser.uid);
          console.log("key2: " + key2);
          if (key1 !== null) {
            await this.setState({convoKey: key1, previousMessage: true });
          }
          if (key2 !== null) {
            await this.setState({convoKey: key2, previousMessage: true })
          }
      } catch (error) {
        console.log(error);
      }
    }

  add = async () => {
    // console.log(firebase.database().ref('users').child(this.state.key).child('rooms').child('roomName');
      console.log("previousMessage: " + this.state.previousMessage);
      console.log("seller/jedi id: " + this.props.jedi.id);
      console.log("current userid: " + firebase.auth().currentUser.uid);

      if (this.state.previousMessage === false) {
        var roomsList = firebase.database().ref('users').child(this.props.jedi.id).child('rooms').push();
        // firebase.database().ref('users').child(uid).child('points').set(this.state.price);

        console.log("roomslist: " + roomsList);

        await roomsList.set({
          roomName: firebase.auth().currentUser.displayName,
        }).then(() => this.setState({text: ""}));
        console.log("roomName: " + roomsList.roomName);

        roomsList = firebase.database().ref('users').child(firebase.auth().currentUser.uid).child('rooms').child(roomsList.key);
        await roomsList.set({
          roomName: this.props.jedi.seller,
        }).then(() => this.setState({text: ""}));
        await AsyncStorage.setItem(firebase.auth().currentUser.uid+this.props.jedi.id, roomsList.key);
        await AsyncStorage.setItem(this.props.jedi.id+firebase.auth().currentUser.uid, roomsList.key);
        await  this.setState({convoKey: roomsList.key});
        console.log("rooms list key: " + roomsList.key);
        return roomsList.key;
    } else {
      return this.state.convoKey;
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.openMovingGroupPurchaseScreen()}>
        <View style={styles.cardView}>
          <Card style={styles.card}
              title={this.props.jedi.seller}
              image={{uri: this.props.jedi.photo}}
              imageStyle={{ flex: 1}}
              imageProps={{ resizeMode: 'contain'}}>
              <Text style={styles.textStyles}>
              Size Storage Unit: {this.props.jedi.sizeStorageUnit} square feet
              </Text>
              <Text style={styles.textStyles}>
              Price: ${this.props.jedi.Price}
              </Text>
              <Text style={styles.textStyles}>
              Number of Months: {this.props.jedi.numberOfMonths} months
              </Text>
              <Button
                icon={{name: 'code'}}
                backgroundColor='#03A9F4'
                buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 5, marginTop: 5}}
                title='MESSAGE BUDDY'
                onPress={()=> this.onPressMessageFreelancer()}/>
              </Card>

        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  cardView: {
    width: Metrics.screenWidth,
  },
  textStyles: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 200,
    left: Metrics.screenWidth*.06,
  },
});
