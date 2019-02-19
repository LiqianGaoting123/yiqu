import React, {Component} from 'react'
import {View, Text, Image, StyleSheet, ImageBackground} from 'react-native'
import API from '../../static/methods'

export default class AboutUs extends Component {
    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        <Image source={require('../../assets/icon/logo.png')} style={styles.logo}/>
                        <Text style={styles.name}>大师星球</Text>
                        <Text
                            style={styles.content}>大师星球汇聚了当代全球知名艺术家，在这里您可以点对点预约心仪的艺术大师，面对面定制或收藏大师的艺术品。在这里智能合约、时间戳、非对称加密认证您的艺术品所有权。在这里您的专属交易区块为您查询、追溯、确权保驾护航。
                        </Text>
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
        paddingHorizontal: API.reset(29),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    logo: {
        alignSelf: 'center',
        width: API.reset(54),
        height: API.reset(54)
    },
    name: {
        alignSelf: 'center',
        fontSize: 17,
        marginTop: API.reset(14),
        marginBottom: API.reset(23)
    },
    content: {
        paddingHorizontal: API.reset(24),
        paddingBottom: API.reset(19),
        fontSize: 12,
        lineHeight: 18,
        color: '#666'
    }
});