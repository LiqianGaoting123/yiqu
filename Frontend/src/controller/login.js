import React, { Component } from 'react';
import {
    Text,
    StatusBar,
    Platform
} from 'react-native';
import { createStackNavigator } from 'react-navigation';
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard';
import API from '../static/methods';
import Login from '../view/login/login';
import Register from '../view/login/register'
import ForgetPwd from '../view/login/forgetpwd'
import BackButton from '../components/backButton';
import Protacol from '../view/about/protacol';
const RouteConfig = {
    Login: {
        screen: Login,
        navigationOptions: () => ({ headerTitle: '登录' })
    },
    Register: {
        screen: Register,
        navigationOptions: ({ navigation }) => ({ headerTitle: '注册', headerLeft: (<BackButton onPress={() => navigation.goBack()} />) })
    },
    ForgetPwd: {
        screen: ForgetPwd,
        navigationOptions: ({ navigation }) => ({ headerTitle: '找回密码', headerLeft: (<BackButton onPress={() => navigation.goBack()} />) })
    },
    Protacol: {
        screen: Protacol,
        navigationOptions: ({ navigation }) => ({ headerTitle: '用户协议', headerLeft: (<BackButton onPress={() => navigation.goBack()} />) })
    }
};
const StackNavigatorConfig = {
    initialRouteName: 'Login',
    mode: 'card',
    headerMode: 'screen',
    gesturesEnabled: true,
    onTransitionStart: () => {
        dismissKeyboard()
    },
    navigationOptions: {
        headerLeft: (
            <Text/>
        ),
        headerRight: (
            <Text/>
        ),
        cardStyle: {
            backgroundColor: "transparent"
        },
        headerStyle: {
            height: Platform.OS === 'android' && Platform.Version > 20
                ? StatusBar.currentHeight + API.resetHeight(46)
                : API.resetHeight(46),
            paddingTop: Platform.OS === 'android' && Platform.Version > 20
                ? StatusBar.currentHeight
                : 0,
            backgroundColor: '#242048',
            color: 'transparent',
            borderBottomWidth: 0,
            elevation: 0
        },
        headerBackTitleStyle: {
            // color: 'rgb(3, 0, 32)',
            color: 'transparent'
        },
        headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            fontSize: 20,
            color: '#fff'
        }
    }
};
const LoginStack = createStackNavigator(RouteConfig, StackNavigatorConfig);
export default LoginStack