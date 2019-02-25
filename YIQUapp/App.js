import React, {Component} from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createMaterialTopTabNavigator,
} from 'react-navigation'
import {StyleSheet, View, Text, Image} from 'react-native'
import Home from './src/screens/Home'
import Me from './src/screens/Me'
import ChattingDetail from './src/screens/ChattingDetail'
import Chatting from "./src/screens/Chatting";
import Organization from "./src/screens/Organization";
import Resources from "./src/screens/Resources";
import Teaching from "./src/screens/Teaching/index"
import Exchange from "./src/screens/Exchange/index"

const CreateTab = createMaterialTopTabNavigator({
  Home: {
    screen: Home,
    navigationOptions: {
      tabBarLabel: '首页',
      tabBarIcon: ({tintColor, focused}) => (
        focused ? <Image style={styles.icon} source={require('./src/assets/home_after.jpg')}/> :
          <Image style={styles.icon} source={require('./src/assets/home.jpg')}/>
      )
    }
  },
  Chatting: {
    screen: Chatting,
    navigationOptions: {
      tabBarLabel: '趣信',
      tabBarIcon: ({tintColor, focused}) => (
        focused ? <Image style={styles.icon} source={require('./src/assets/chatting_after.jpg')}/> :
          <Image style={styles.icon} source={require('./src/assets/chatting.jpg')}/>
      )
    }
  },
  Organization: {
    screen: Organization,
    navigationOptions: {
      tabBarLabel: '机构',
      tabBarIcon: ({tintColor, focused}) => (
        focused ? <Image style={styles.icon} source={require('./src/assets/organization_after.jpg')}/> :
          <Image style={styles.icon} source={require('./src/assets/organization.jpg')}/>
      )
    }
  },
  Resources: {
    screen: Resources,
    navigationOptions: {
      tabBarLabel: '资源',
      tabBarIcon: ({tintColor, focused}) => (
        focused ? <Image style={styles.icon} source={require('./src/assets/resources_after.jpg')}/> :
          <Image style={styles.icon} source={require('./src/assets/resources.jpg')}/>
      )
    }
  },
  Me: {
    screen: Me,
    navigationOptions: {
      tabBarLabel: '我的',
      tabBarIcon: ({tintColor, focused}) => (
        focused ? <Image style={styles.icon} source={require('./src/assets/me_after.jpg')}/> :
          <Image style={styles.icon} source={require('./src/assets/me.jpg')}/>
      ),
    }
  }
}, {
  initialRouteName: 'Home',
  tabBarPosition: 'bottom',
  lazy: true,
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: '#E3017E',
    inactiveTintColor: '#878787',
    showIcon: true,
    style: {
      height: '9%',
      backgroundColor: '#DDDDDD',
    },
  }
});

const StacksOverTabs = createStackNavigator({
  Root: {
    screen: CreateTab,
    navigationOptions: {
      header: () => null,
    }
  },
  ChattingDetail: {
    screen: ChattingDetail,
    navigationOptions: {
      title: '趣信',
    },
  },
  Teaching:{
    screen:Teaching,
    navigationOptions:{
      title:'助教',
    },
  },
  Exchange:{
    screen:Exchange,
    navigationOptions:{
      title:'老师',
      backgroundColor: 'orange',
  },
},
});

const StacksOverTab = createAppContainer(StacksOverTabs);

export default class App extends Component {
  render() {
    return (
      <StacksOverTab/>
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24
  }
});
