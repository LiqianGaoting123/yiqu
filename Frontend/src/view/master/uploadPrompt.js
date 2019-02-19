import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, ImageBackground} from 'react-native'
import API from '../../static/methods'

export default class UploadPrompt extends Component {
    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Text
                            style={styles.content}>为了保证艺术品详情展示如您所愿，请使用电脑登录下面网站进行上传</Text>
                        <Text style={styles.name}>master.ds-xq.com</Text>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: API.reset(23)
    },
    box: {
        paddingTop: API.reset(30),
        paddingBottom: API.reset(70),
        paddingHorizontal: API.reset(20),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    name: {
        alignSelf: 'center',
        fontSize: 17,
        marginTop: API.reset(14),
        marginBottom: API.reset(23)
    },
    content: {
        paddingHorizontal: API.reset(7),
        paddingBottom: API.reset(19),
        fontSize: 15,
        lineHeight: 18,
        color: '#666'
    }
});