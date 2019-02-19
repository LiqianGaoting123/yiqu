import React, { Component } from 'react'
import { TouchableOpacity, Image } from 'react-native'
import API from '../static/methods';
export default class BackButton extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.onPress()}
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    height: API.reset(46),
                    paddingHorizontal: API.reset(10)
                }}>
                <Image
                    style={{
                        width: API.reset(7),
                        height: API.reset(14)
                    }}
                    source={require('../assets/icon/back_btn.png')} />
            </TouchableOpacity>
        )
    }
}