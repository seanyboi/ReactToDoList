/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';

//Importing all the components that I need from 'react-native'
import {
Platform,
StyleSheet,
Text,
View,
FlatList,
AsyncStorage,
Button,
TextInput,
Keyboard
} from 'react-native';

const isAndroid = Platform.OS == "android"; //Test for specific OS
const viewPadding = 10;

export default class App extends Component {

//Initial State
state = {
  tasks: [],
  text: ""
};



changeTextHandler = text => {
  this.setState({text: text});
};

//Adding a task
addTask = () => {
  let notEmpty = this.state.text.trim().length > 0;
  if(notEmpty) {
    this.setState(
      prevState => {
        let {tasks, text} = prevState;
        return {
          tasks: tasks.concat({key: tasks.length, text: text}),
          text: ""
        };
      },
      //Save tasks to LocalStorage after state changes.
      //Important to callback of 'this.setState' as it's async function.
      //Means you will not save old data instead.
      () => Tasks.save(this.state.tasks)
    );
  }
};

//Deleting a task
deleteTask = i => {
  this.setState(
    prevState => {
      let tasks = prevState.tasks.slice()
      tasks.splice(i, 1);

      return {tasks: tasks}
    },
    //Save tasks to LocalStorage after state changes.
    //Important to callback of 'this.setState' as it's async function.
    //Means you will not save old data instead.
    () => Tasks.save(this.state.tasks)
  );
};


componentDidMount() {

  Keyboard.addListener(

      isAndroid ? "keyboardDidhide" : "keyboardWillHide",
      e => this.setState({ viewPadding: e.endCoordinates.height + viewPadding})
  );

  Keyboard.addListener(
      isAndroid ? "keyboardDidhide" : "keyboardWillHide",
      () => this.setState({ viewPadding: viewPadding})
  );

    //Loading from LocalStorage API
    Tasks.all(tasks => this.setState({tasks: tasks || [] }));
}


render() {
    return (

      //Whatever in this view will override styles.container
      <View style={styles.container}>

        <FlatList //Task List
          style = {styles.list}
          data = {this.state.tasks} //Array of tasks
          keyExtractor={ (item, index) => index.toString() }
          renderItem={({item, index}) =>
            <View> //Specifying how to render each item
              <View style={styles.listItemCont}>
                <Text style={styles.listItem}>
                  {item.text}
                </Text>
                <Button title="X" onPress={() => this.deleteTask(index)} /> //Assigning handlers to events
              </View>
              <View style={styles.hr} /> //write styling as an object and assign it to components
            </View>}
          />

          //Input to add tasks
          <TextInput
            style={styles.textInput} //No cascading and global styles like css
            onChangeText={this.changeTextHandler}
            onSubmitEditing={this.addTask}
            value={this.state.text}
            placeHolder="Add Tasks"
            returnKeyType="done"
            returnKeyLabel="done"
          />
        </View>
    );
  }
}



let Tasks = {
  //Serialize the data to a string with separator and then

  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({key: i, text: task})) : []
    );
  },
  //Deserialize it to retrieve
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  //Save data locally using aysncstorage
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: viewPadding,
    paddingTop: 50,
    paddingBottom: 50

  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    fontSize: 18
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "blue",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%"
  }
});
