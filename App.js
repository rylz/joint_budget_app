import React, {Component} from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { Alert, Button, SectionList, StyleSheet, Text, View } from 'react-native';

// fetch('https://riley_server.com/mydata.json')
class HomeScreen extends React.Component {
    render() {
        const {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                <Button
                    title="Go to screen"
                    onPress={() => navigate('Details')}
                />
                <SectionList
                    sections={[
                      {title: 'Unclaimed', data: ['Purchase1']},
                      {title: 'Joint', data: ['Purchase2']},
                      {title: 'Personal', data: ['underwear']},
                    ]}
                    renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
                    renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    keyExtractor={(item, index) => index}
                />
              </View>
        );
    }
}

class DetailsScreen extends React.Component {
    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text>Details Screen</Text>
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



/*
// Buttons with state
export default class BudgetApp extends Component {
  state = {
    textValue: 'Default'
  }

  _onPressButton = () => {
    this.setState({
      textValue: 'BUTTONS, BABY!'
    })
  }
        /*<Text>Purchase information -- date, vendor, description</Text>
        <Text>{this.state.textValue}</Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressButton}
            title="Joint"
            color="powderblue"
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressButton}
            title="Personal"
            color="skyblue"
            //disabled={true}
          />
        </View>
} */


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 22
    //justifyContent: 'space-evenly',
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
});
