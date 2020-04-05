import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native';

import R from "res/R";
import Modal from "react-native-modal";
import Button from '../library/components/Button';
import CustomText from "../library/components/CustomText";
import ActionTab from "../library/components/ActionTab";

import message from '../library/services/notifications';
import auth from '../library/networking/auth';
import firebase from "react-native-firebase";
import db from '../library/networking/db';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mrn: "", pia: "",
      data: "", time: "",

      messages: [],
      activeMessage: 0,
      isFetching: true,

      modalHeight: 0.4,
      modalVisible: false,
    };
  }

  componentDidMount() {
    auth.getKeyVal('name').then(name => { this.setState({name}) });
    auth.getKeyVal('mrn')
      .then(mrn => this.setState({mrn}))
      .then(() => { this.fetch_data()})
      .then(() => this.timeout = setInterval(() => this.fetch_data(), 60000))
      .catch(err => alert(err.message));

    // Set up android notifications channel
    const channel = new firebase.notifications
      .Android.Channel('hero-patient', 'HeroAI Patient',
      firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');

    // Register device for notifications
    firebase.notifications().android.createChannel(channel)
      .then(() => message.checkPermission())
      .then(() => message.createTokenListener())
      .then(() => message.createNotificationListeners())
      .catch(err => alert(err.message))
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    message.removeListeners();
  }

  onRefresh() { this.setState({ isFetching: true }, function() { this.fetch_data() }) }

  fetch_data() {
    const {mrn} = this.state;
    db.get_beacons(mrn).then(data => {
      this.setState({
        messages: data.messages,
        isFetching: false,
        date: data.date,
        time: data.time,
        los: data.los,
        pia: data.pia,
        mrn: mrn
      })
    });
  }

  handleArchive(id) {
    db.archive_message(id)
      .then(message => alert(message))
      .then(() => this.fetch_data())
      .then(() => this.setState({activeMessage: 0}))
      .catch(err => alert(err))
  }

  renderModal = (modalVisible, modalContainer, currentMessage) => {
    return (
      <Modal
        onBackdropPress={() => this.setState(this.closeModal())}
        onSwipeComplete={() => this.setState(this.closeModal())}
        swipeDirection="down"
        isVisible={modalVisible}
        style={styles.modalStyle}
      >
        <View style={modalContainer}>
          <View style={styles.modalHeader}>
            <CustomText customStyle={{textTransform: 'capitalize'}} label={currentMessage.sender}/>
            <View style={{alignItems: 'flex-end'}}>
              <CustomText subtitle_2 label={currentMessage.date} />
              <CustomText subtitle_2 label={currentMessage.timestamp} />
            </View>
          </View>
          <View style={{width: '100%', flex: 4, paddingTop: '2%', justifyContent: 'flex-start'}}>
            <CustomText label={currentMessage.body}/>
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'flex-end'}}>
            <Button half light customStyle={{margin: 0, width: R.constants.screenWidth * 0.65 / 2}} onPress={() => this.handleArchive(currentMessage.id)} title="Delete"/>
            <Button half dark customStyle={{margin: 0, width: R.constants.screenWidth * 0.65 / 2}} onPress={() => this.closeModal()} title="Close"/>
          </View>
        </View>
      </Modal>
    )
  };

  openModal(index) { this.setState({
    modalVisible: true,
    activeMessage: index
  })}

  closeModal() { this.setState({
    modalHeight: 0.4,
    expandModal: false,
    modalVisible: false
  })}

  render() {

    const { messages, activeMessage, isFetching, modalVisible } = this.state;
    const currentMessage = messages[activeMessage];
    const modalContainer = {
      height: R.constants.screenHeight * this.state.modalHeight,
      paddingLeft: '15%',
      paddingRight: '15%',
      paddingTop: '10%',
      backgroundColor: 'white',
      alignItems: 'center',
      borderRadius: 10
    };

    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <View style={styles.greetingView}>
            <CustomText customStyle={styles.greeting} title label={`Welcome back, ${this.state.name}`} />
          </View>
          <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', padding: '5%'}}>
            <View style={{alignItems: 'center', width: R.constants.screenWidth * 0.4}}>
              <CustomText customStyle={{fontSize: 16, textAlign: 'center'}} label="Your predicted wait-time is" />
              <Text style={styles.piaText}>{this.state.pia} h</Text>
            </View>
            <View style={{alignItems: 'center', width: R.constants.screenWidth * 0.4}}>
              <CustomText customStyle={{fontSize: 16, textAlign: 'center'}} label="Your current length of stay" />
              <Text style={styles.piaText}>{this.state.los} h</Text>
            </View>
          </View>
        </View>
        <View style={styles.actionContainer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <CustomText label="Beacon" />
            <CustomText subtitle_2 label={`${this.state.date} | ${this.state.time}`} />
          </View>
          {
            messages.length === 0 && isFetching ? <CustomText subtitle label="Fetching messages ..."/> :
            messages.length === 0 && !isFetching ? <CustomText subtitle label="No messages" />
            :
            <>
              <FlatList
                data={messages}
                refreshing={isFetching}
                onRefresh={() => this.onRefresh()}
                renderItem={({item, index}) => <ActionTab item={item} onPress={() => this.openModal(index)}/>}
                keyExtractor={(item, index) => index.toString()}
              />
              <View>
                {this.renderModal(modalVisible, modalContainer, currentMessage)}
              </View>
            </>
          }
        </View>
        <View style={{marginBottom: '15%'}}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  infoContainer: {
    flex: 3,
    padding: '3%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  actionContainer: {
    flex: 4,
    padding: '7%',
    marginBottom: '-15%',
    backgroundColor: '#FFF',
    width: R.constants.screenWidth * 0.95,
    borderRadius: 20
  },
  greetingView: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: R.constants.screenWidth * 0.5
  },
  greeting: {
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  piaText: {
    fontSize: 30,
    marginTop: '10%',
    fontFamily: R.fonts.robotoBlack,
    fontWeight: 'bold'
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0
  },
  modalHeader: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});

export default Home;
