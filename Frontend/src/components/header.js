import React, { Component } from 'react'
import { View, Text, SafeAreaView, Platform, StatusBar } from 'react-native'
import API from '../static/methods'
import center from '../view/personal/center';
export default class Header extends Component {
    render() {
        return (
            <SafeAreaView>
                <View style={{
                    justifyContent: center,
                    alignItems: 'center',
                    height: API.resetHeight(46),
                    paddingTop: Platform.OS == 'android' && Platform.Version > 20
                        ? StatusBar.currentHeight
                        : 0,
                }}>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#fff'
                        }}>{this.props.title}</Text>
                </View>
            </SafeAreaView>
        )
    }
}