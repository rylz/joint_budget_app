import React, {Component} from 'react';
import {createStackNavigator, createAppContainer, createMaterialTopTabNavigator} from 'react-navigation';
import { Animated, Dimensions, Keyboard, Picker, ScrollView, StyleSheet, Text, TextInput, UIManager, View } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import moment from 'moment'

const MERCHANT_CHAR_LIM = 15
const NUM_TRANSACTIONS = 15
const {State: TextInputState} = TextInput;
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

// changing moment.js default print values to shorthand
moment.updateLocale('en', {
    relativeTime : {
        s:  '%d s',
        m:  '1 m',
        mm: '%d m',
        h:  '1 h',
        hh: '%d h',
        d:  '1 d',
        dd: '%d d',
        ww: '%d w',
        M:  '4 w',
        MM: function(num) {
                return num * 4 + ' w' // months to weeks
            },
        YY: '%d y',
    }
});

// fetch('https://riley_server.com/mydata.json')
class HomeScreen extends React.Component {
    state = {isLoading: true}

    componentDidMount() {
        return fetch( 'https://vrbudget.herokuapp.com')
            .then( (response) => response.json())
            .then( (responseJson) => {
                this.setState({
                    isLoading: false,
                    unclaimed: responseJson.unclaimed,
                    joint: responseJson.joint,
                    personal: responseJson.vivian,
                })
            } )
            .catch( (error) => {
                console.error(error);
            });
    }

    render() {
        if (this.state.isLoading) {
          return (
            <View style={ {flex: 1, padding: 20, backgroundColor: 'lightcyan'} }>
            </View>
          )
        }
        const {navigate} = this.props.navigation;

        // transactions sorted in descending order of date
        const unclaimed = this.state.unclaimed.sort( (a,b) => {
            return moment(b.date) - moment(a.date)
        })
        const joint = this.state.joint.sort( (a,b) => {
            return moment(b.date) - moment(a.date)
        })
        const personal = this.state.personal.sort( (a,b) => {
            return moment(b.date) - moment(a.date)
        })

        // arrays for display on homepage
        const unclaimedTable = []
        const jointTable = []
        const personalTable = []
        for (let i=0; i<Math.min(unclaimed.length, NUM_TRANSACTIONS); i++) {
            item = unclaimed[i]
            unclaimedTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
        }
        for (let i=0; i<Math.min(joint.length, NUM_TRANSACTIONS); i++) {
            item = joint[i];
            jointTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
        }
        for (let i=0; i<Math.min(personal.length, NUM_TRANSACTIONS); i++) {
            item = personal[i];
            personalTable.push([ moment(item.date).fromNow(), item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
        }

        return (
              <ScrollView style={styles.homeContainer}>
                  <Table borderStyle = { styles.homeTable }>
                      <Row  data={ ['Unclaimed']} style={styles.head} textStyle={styles.headtext}/>
                      {unclaimedTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 flexArr={[1, 2, 1]}
                                 onPress = { () => navigate('Details', {info: unclaimed[i]} ) } />
                         );
                      })}
                  </Table>
                  <Table borderStyle = { styles.homeTable }>
                      <Row  data={ ['Joint'] } style={styles.head} textStyle={styles.headtext}/>
                      {jointTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 onPress = { () => navigate('Details', {info: joint[i]} ) } />
                         );
                      })}
                  </Table>
                  <Table borderStyle = { styles.homeTable }>
                      <Row  data={ ['Personal'] } style={styles.head} textStyle={styles.headtext}/>
                      {personalTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 onPress = { () => navigate('Details', {info: personal[i]} ) } />
                         );
                      })}
                  </Table>
            </ScrollView>
        );
    }
}

class DetailsScreen extends React.Component {
    state = {budget: '', budgetval: '',
             category: '', categoryval: '',
             payer: '', payerval: '',
             text: '',
             shift: new Animated.Value(0)}

    componentWillMount() {
        this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
        this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    updateBudget = (label, value) => {
        if (value !== 0) {
            this.setState({budget:label})
        }
    }
    updateCategory = (label, value) => {
        if (value !== 0) {
            this.setState({category:label})
        }
    }
    updatePayer = (label, value) => {
        if (value !== 0) {
            this.setState({payer:label})
        }
    }
    render() {
        const {info} = this.props.navigation.state.params;
        const {shift} = this.state;
        const tableData = [
               ['Merchant'],
               ['Payment'],
               ['Date'],
               ['Card']
             ]
        tableData[0].push(info.merchant)
        tableData[1].push(`$${info.payment}`)
        tableData[2].push( moment(info.date).format('MMM DD YY, HH:mm') )
        tableData[3].push(info.card_last_4)

        return (
            <Animated.View style={ [styles.detailContainer, {transform: [{translateY:shift}]}] }>
                <Table borderStyle = { {borderWidth: 1, borderColor: 'mediumturquoise'}}>
                      <Row data ={['Transaction Details']} style={styles.head} textStyle={styles.headtext}/>
                      <Rows data = {tableData} textStyle={styles.text} />
                </Table>

                <View style = {{alignItems: 'center', paddingTop: 0.05*HEIGHT}}>
                    <Picker
                        selectedValue={this.state.budget}
                        style={styles.picker}
                        onValueChange={this.updateBudget} >
                        <Picker.Item label="Please select a budget" value="0" />
                        <Picker.Item label="Joint" value="joint" />
                        <Picker.Item label="Personal" value="personal" />
                    </Picker>
                    <Picker
                        selectedValue={this.state.category}
                        style={styles.picker}
                        onValueChange={this.updateCategory}>
                        <Picker.Item label="Please select a category" value="0" />
                        <Picker.Item label="Housemates" value="housemates" />
                        <Picker.Item label="Groceries" value="groceries" />
                        <Picker.Item label="Entertainment" value="entertainment" />
                        <Picker.Item label="Vacation" value="vacation" />
                        <Picker.Item label="Auto" value="auto" />
                        <Picker.Item label="Misc" value="misc" />
                        <Picker.Item label="Charity" value="charity" />
                    </Picker>
                    <Picker
                        selectedValue={this.state.payer}
                        style={styles.picker}
                        onValueChange={this.updatePayer}>
                        <Picker.Item label="Please select who paid" value="0" />
                        <Picker.Item label="Riley" value="riley" />
                        <Picker.Item label="Vivian" value="vivian" />
                    </Picker>
                </View>

                <View style = {{alignItems: 'center', paddingTop: 20}} >
                    <TextInput
                        style = {styles.textbox}
                        multiline = {true}
                        numberOfLines = {4}
                        placeholder = "Notes and other details"
                        onChangeText={(text) => this.setState({text})}
                    />
                </View>
            </Animated.View>
        );
    }

    handleKeyboardDidShow = (event) => {
        const {height: windowHeight} = Dimensions.get('window');
        const keyboardHeight = event.endCoordinates.height;
        const currentlyFocusedField = TextInputState.currentlyFocusedField();
        UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
            const fieldHeight = height;
            const fieldTop = pageY;
            const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
            if (gap >= 0) {
                return;
            }
            Animated.timing(
                this.state.shift,
                {
                    toValue: gap,
                    duration: 100,
                    useNativeDriver: true,
                }
            ).start();
        });
    }

    handleKeyboardDidHide = () => {
        Animated.timing(
            this.state.shift,
            {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
            }
        ).start();
    }
}

class SpendingScreen extends React.Component {
    render() {
        return (
            <View>
                <Text> Spending information here! </Text>
            </View>
        );
    }
}


const TabNavigator = createMaterialTopTabNavigator({
    Stack: createStackNavigator({
        Home: HomeScreen,
        Details: DetailsScreen,
      },
      {
        initialRouteName: 'Home',
        defaultNavigationOptions: {
            header: null,
        }
      }),
    Spending: SpendingScreen,
},{
    tabBarOptions: {
        style: {paddingTop: 0.03*HEIGHT}
    }
});

const TabContainer = createAppContainer(TabNavigator);

export default class App extends React.Component {
  render() {
    return <TabContainer />
  }
}

const styles = StyleSheet.create({
    detailContainer: {
        flex: 1,
        backgroundColor: 'lightcyan',
        paddingTop: 22,
    },
    head: {height: 40, backgroundColor: 'mediumturquoise'},
    headtext: {margin: 6, fontSize: 20, fontWeight: 'bold'},
    homeContainer: {
        flex: 1,
        backgroundColor: 'lightcyan',
        paddingTop: 22,
    },
    homeTable: {
        borderWidth: 2,
        borderColor: 'transparent',
    },
    picker: {
        height:0.08*HEIGHT,
        width: 0.85*WIDTH,
    },
    text: {margin: 6, fontSize: 18},
    textbox: {
        height:0.15*HEIGHT,
        width: 0.85*WIDTH,
        borderWidth: 1,
        padding: 10},
});
