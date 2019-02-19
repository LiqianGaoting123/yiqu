'use strict';

import {
    Image,
    TextInput,
    View,
    StyleSheet
} from 'react-native';
import React, {Component} from "react";

let Dimensions = require('Dimensions');

//export 因为要在其他类中使用
export default class Search extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.container}>
                {/*<Image source={require('../images/back_btn.png')} style={styles.logo} onPress={() => {navigation.goBack(); console.log('press')}}/>*/}
                <View style={styles.searchBox}>
                    <Image source={require('../assets/icon/search.png')} style={styles.searchIcon}/>
                    <TextInput style={styles.inputText}
                               keyboardType='web-search'
                               onSubmitEditing={this.props.onSubmitEditing}
                               placeholder={this.props.placeholder}/>
                </View>
            </View>
        )
    }
}

//样式
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',   // 水平排布
        paddingLeft: 10,
        paddingRight: 10,
        padding: 10,
        height: 58,
        width: Dimensions.get('window').width,
        backgroundColor: '#242048',
        alignItems: 'center'  // 使元素垂直居中排布, 当flexDirection为column时, 为水平居中
    },
    searchBox: {//搜索框
        height: 38,
        flexDirection: 'row',   // 水平排布
        flex: 1,
        borderRadius: 5,  // 设置圆角边
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        alignContent: 'flex-end',
        marginLeft: 30,
        marginRight: 4,
        marginHorizontal: 10,
    },
    searchIcon: {//搜索图标
        height: 20,
        width: 20,
        marginLeft: 10,
        resizeMode: 'stretch'
    },
    inputText: {
        flex: 1,
        marginLeft: 10,
        backgroundColor: 'transparent',
        fontSize: 16,
        color: '#535353',
    },
    logo: {
        height: 17,
        width: 17,
        padding: 5,
        marginHorizontal: 6,
        // resizeMode: 'stretch'  // 设置拉伸模式
    },
});