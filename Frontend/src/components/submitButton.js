import React, { Component } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
export default class SubmitBtn extends Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => this.props.onPress()}
                style={[styles.wrapper, this.props.buttonStyle]}>
                <LinearGradient
                    start={{
                        x: 0,
                        y: 1
                    }}
                    end={{
                        x: 1,
                        y: 1
                    }}
                    locations={[0, 1]}
                    colors={['#1758DE', '#7617EB']}
                    style={styles.button}>
                    <Text
                        style={{
                            fontSize: 15,
                            color: '#fff'
                        }}>{this.props.text}</Text>
                </LinearGradient>
            </TouchableOpacity >
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        alignSelf: 'center',
        width: 230,
        height: 35
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 230,
        height: 35,
        borderRadius: 18
    }
})