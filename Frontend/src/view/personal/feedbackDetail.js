import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import API from '../../static/methods'
class FeedbackDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const data = this.props.navigation.state.params;
        return (
            <View style={styles.container}>
                <Text style={styles.title}>我的反馈</Text>
                <View style={styles.typeWrapper}>
                    <View
                        style={styles.type}>
                        <Text
                            style={{
                                color: '#fff'
                            }}>{data.type}</Text>
                    </View>
                </View>
                <View style={styles.textAera}>
                    <Text
                        style={{
                        }}>{data.content}</Text>
                </View>
                <Text style={styles.title}>上传问题截图</Text>
                <View style={styles.uploadWrapper}>
                    <Image defaultSource={require('../../assets/icon/default_icon.png')} source={{ uri: data.url }} style={styles.uploadImg} />
                </View>
                <View
                    style={styles.input}>
                    <Text
                        style={{
                        }}>{data.tel}</Text>
                </View>
            </View>
        );
    }
}

export default FeedbackDetail;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9'
    },
    title: {
        paddingLeft: API.reset(18),
        paddingTop: API.reset(18),
        color: '#999999'
    },
    typeWrapper: {
        flexDirection: 'row',
        paddingLeft: API.reset(18),
        paddingTop: API.reset(12),
        paddingBottom: API.reset(15)
    },
    type: {
        justifyContent: 'center',
        alignItems: 'center',
        width: API.reset(70),
        height: API.reset(25),
        marginRight: API.reset(15),
        borderRadius: API.reset(5),
        backgroundColor: '#2052e0'
    },
    textAera: {
        height: API.reset(111),
        paddingHorizontal: (18),
        paddingVertical: API.reset(14),
        backgroundColor: '#fff'
    },
    uploadWrapper: {
        height: API.reset(103),
        paddingLeft: API.reset(19),
        paddingTop: API.reset(14),
        marginTop: API.reset(18),
        marginBottom: API.reset(48),
        backgroundColor: '#fff'
    },
    uploadBtn: {
        width: API.reset(66),
        height: API.reset(66)
    },
    uploadImg: {
        width: API.reset(66),
        height: API.reset(66)
    },
    input: {
        justifyContent: 'center',
        height: API.reset(54),
        paddingHorizontal: (18),
        backgroundColor: '#fff'
    },
    submit: {
        marginTop: API.reset(59)
    }
});