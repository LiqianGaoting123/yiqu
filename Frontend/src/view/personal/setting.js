import React, {Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native'
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton';
import {authentication, follow} from "../../redux/actions";

export default class Center extends Component {
    constructor() {
        super();
        this.state = {
            identification: false,
        }
    }

    Unlogin() {
        storage.remove({key: 'token', id: '2'});
        storage.remove({key: 'userInfo', id: '3'});
        storage.remove({key: 'property', id: '4'});
        storage.remove({key: 'custom', id: '5'});
        storage.remove({key: 'invitation', id: '6'});
        storage.remove({key: 'followStatus', id: '7'});
        storage.remove({key: 'qrcode', id: '8'});
        this
            .props
            .navigation
            .navigate('LoginApp')
    }

    componentDidMount() {
        this.fetchParams()
    }

    async fetchParams() {
        let formData = {};
        let response = await API._fetch(API.GET({url: '/mission/leadership/check', formData})); // 判断是否完成任务
        let json = await response.json();

        if (response.status === 200) {
            this.setState({identification: json.identification})
        }
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <View style={styles.box}>
                        {this.state.identification ? [] : <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('modifyNickname', {
                                refresh: async function () {
                                    await this.fetchParams();
                                }
                            })}>
                            <Text style={styles.label}>修改昵称</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>}
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('modifyPassword')}>
                            <Text style={styles.label}>修改密码</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('modifyPaycode')}>
                            <Text style={styles.label}>修改支付码</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('AboutUs')}>
                            <Text style={styles.label}>关于我们</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => this.props.navigation.navigate('FeedBack')}>
                            <Text style={styles.label}>意见反馈</Text>
                            <Image source={require('../../assets/icon/right_arrow.png')} style={styles.goRight}/>
                        </TouchableOpacity>
                        <SubmitBtn
                            buttonStyle={styles.submitBtn}
                            text='退出登录'
                            onPress={() => this.Unlogin()}/>
                    </View>
                </View>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: API.reset(23)
    },
    box: {
        paddingVertical: API.reset(5),
        paddingHorizontal: API.reset(19),
        marginTop: API.reset(100),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    item: {
        flexDirection: 'row',
        paddingVertical: API.reset(21),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6'
    },
    label: {
        flex: 1,
        paddingLeft: API.reset(9),
        color: '#333'
    },
    goRight: {
        width: API.reset(8),
        height: API.reset(14)
    },
    submitBtn: {
        marginTop: API.reset(46),
        marginBottom: API.reset(40)
    }
});