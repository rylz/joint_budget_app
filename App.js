import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { Alert, Button, Picker, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';


import {homepage, transaction} from './example_api_results.js'

const MERCHANT_CHAR_LIM = 15

// fetch('https://riley_server.com/mydata.json')
class HomeScreen extends React.Component {
    state = {
        unclaimedHead: ['Unclaimed'],
        unclaimedTable: [],
        jointHead: ['Joint'],
        jointTable: [],
        personalHead: ['Personal'],
        personalTable: []
    }
    render() {
        //const { data, style, widthArr, heightArr, flexArr, textStyle, ...props } = this.props;
        //const flex = flexArr ? sum(flexArr) : 0;
        //const width = widthArr ? sum(widthArr) : 0;
        const state = this.state;
        const {navigate} = this.props.navigation;
        // for loop for each category, for each transaction
        for (let i=0; i<2; i++) {
            // TODO: sort by date (moment.js), adjust table column size
            if (homepage.unclaimed.length !== 0) {
                item = homepage.unclaimed[i];
                state.unclaimedTable.push([item.date, item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
            }
        }
        for (let i=0; i<2; i++) {
            if (homepage.joint.length !== 0) {
                item = homepage.joint[i];
                state.jointTable.push([item.date, item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
            }
        }
        for (let i=0; i<2; i++) {
            if (homepage.personal.length !== 0) {
              item = homepage.personal[i];
              state.personalTable.push([item.date, item.merchant.substring(0, MERCHANT_CHAR_LIM), `$${item.payment}`])
            }
        }
        return (
              <View style={styles.container}>
                  <Table borderStyle = { {borderWidth: 2, borderColor: 'transparent'} }>
                      <Row  data={state.unclaimedHead} style={styles.head} textStyle={styles.headtext}/>
                      {state.unclaimedTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 onPress = { () => navigate('Details', {info: homepage.unclaimed[i]} ) } />
                         );
                      })}
                  </Table>
                  <Table borderStyle = { {borderWidth: 2, borderColor: 'transparent'} }>
                      <Row  data={state.jointHead} style={styles.head} textStyle={styles.headtext}/>
                      {state.jointTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 onPress = { () => navigate('Details', {info: homepage.joint[i]} ) } />
                         );
                      })}
                  </Table>
                  <Table borderStyle = { {borderWidth: 2, borderColor: 'transparent'} }>
                      <Row  data={state.personalHead} style={styles.head} textStyle={styles.headtext}/>
                      {state.personalTable.map( (item, i) => {
                         return (
                             <Row
                                 key={i}
                                 data={item}
                                 textStyle={styles.text}
                                 onPress = { () => navigate('Details', {info: homepage.personal[i]} ) } />
                         );
                      })}
                  </Table>
            </View>
        );
    }
}

class DetailsScreen extends React.Component {
    state = {budget: '', budgetval: '',
             category: '', categoryval: '',
             payer: '', payerval: '',
             text: 'Notes: '}
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
        return (
            <View style={{ flex: 1, justifyContent: 'space-evenly' }}>
                <View style = {styles.detailview}>
                    <Text style = {styles.detailtext}>
                        {` Merchant: ${info.merchant}`}
                    </Text>
                    <Text style = {styles.text}>
                        {` Payment: $${info.payment} \n Date: ${info.date} \n Card: ${info.card_last_4}`}
                    </Text>
                </View>

                <View style = {{alignItems: 'center'}}>
                <Picker
                    selectedValue={this.state.budget}
                    style={{ height: 50, width: 250 }}
                    onValueChange={this.updateBudget} >
                    <Picker.Item label="Please select a budget" value="0" />
                    <Picker.Item label="Joint" value="joint" />
                    <Picker.Item label="Personal" value="personal" />
                </Picker>
                <Picker
                    selectedValue={this.state.category}
                    style={{ height: 50, width: 250 }}
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
                    style={{ height: 50, width: 250 }}
                    onValueChange={this.updatePayer}>
                    <Picker.Item label="Please select who paid" value="0" />
                    <Picker.Item label="Riley" value="riley" />
                    <Picker.Item label="Vivian" value="vivian" />
                </Picker>

                <TextInput
                    style = {styles.textbox}
                    multiline = {true}
                    numberOfLines = {4}
                    placeholder = "Notes and other details"
                    onChangeText={(text) => this.setState({text})}
                />
                </View>
            </View>
        );
    }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 22,
        //justifyContent: 'space-evenly'
        //alignItems: 'center',
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 20,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247, 247, 247, 1.0)',
    },
    buttonContainer: {
        margin: 20
    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
    },
    head: {height: 40, backgroundColor: '#f1f8ff'},
    headtext: {margin: 6, fontSize: 20, fontWeight: 'bold'},
    text: {margin: 6, fontSize: 18},
    textbox: {borderWidth: 1, padding: 10},
    detailtext: {margin: 6, fontSize: 18},
    detailview: {
        alignItems: 'flex-start',
        backgroundColor : 'powderblue',
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2}
});
