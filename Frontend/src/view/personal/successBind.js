import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import API from '../../static/methods'
import BackButton from '../../components/backButton';
class SuccessBind extends Component {
    static navigationOptions = ({ navigation }) => {
        return { headerLeft: (<BackButton onPress={() => navigation.pop(navigation.getParam('first') ? 2 : 1)} />) }
    };
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={require('../../assets/icon/passed.png')} style={styles.passIcon} />
                <Text style={styles.resTxt}>任务完成</Text>
                <Text style={styles.resTxt}>您已经成功领取奖励</Text>
                <View style={styles.tips}>
                    <Text style={styles.tipsTitle}>按照如下步骤完成关注微信公众号，即可领取1创造力</Text>
                    <View style={styles.step}>
                        <Text style={styles.tipsTxt}>1.在微信公众号中搜索搜索“大师星球INFO”并关注</Text>
                        <Text style={styles.tipsTxt}>2.在大师星球INFO公众号中输入“领取创造力”获得验证码</Text>
                        <Text style={styles.tipsTxt}>3.在下方输入验证码，验证成功后即可领取创造力</Text>
                    </View>
                    <Text style={styles.tipsTxt}>说明：每个星球账号仅有一次领取机会</Text>
                </View>
            </View>
        );
    }
}

export default SuccessBind;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: API.reset(48),
        backgroundColor: '#fff'
    },
    passIcon: {
        alignSelf: 'center',
        width: API.reset(100),
        height: API.reset(100),
        marginBottom: API.reset(19)
    },
    resTxt: {
        alignSelf: 'center',
        fontSize: 17,
        lineHeight: API.reset(30),
        color: '#333'
    },
    tips: {
        paddingTop: API.reset(16),
        paddingHorizontal: API.reset(23),
        marginTop: API.reset(19)
    },
    tipsTitle: {
        fontSize: 12,
        color: '#333',
        marginBottom: API.reset(13)
    },
    tipsTxt: {
        fontSize: 12,
        lineHeight: API.reset(20),
        color: '#999'
    },
    step: {
        marginBottom: API.reset(25)
    }
});