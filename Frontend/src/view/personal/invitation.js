import React, {Component} from 'react';
import {
    ScrollView,
    View,
    Text,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ImageBackground,
    StyleSheet,
    Clipboard,
    Modal
} from 'react-native';
import {connect} from 'react-redux'
import {infoUpdate} from '../../redux/actions';
import LinearGradient from 'react-native-linear-gradient'
import * as WeChat from 'react-native-wechat'
import API from '../../static/methods';
import * as QQAPI from 'react-native-qq';

class Invitation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            data: {},
            qqdata: {},
            recommend_code: '',
            qrcode: '',
            imageUrl: '',
        };
    }

    componentDidMount() {
        this.fetchData();
        WeChat.registerApp('wxa07ae7d84b700e12');
    }

    async fetchData() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/mission/leadership/remain', formData}));
            let responseJson = await response.json();
            // console.log(responseJson);
            if (response.status === 200) {
                this
                    .props
                    .dispatch(infoUpdate({leftTimes: responseJson.remain}));
                this.setState({
                    recommend_code: responseJson.myInviteCode,
                    qrcode: responseJson.url_2d,
                    imageUrl: responseJson.url_png,
                    data: {
                        type: 'imageUrl',
                        title: '大师星球',
                        description: '大师星球，我的数据我做主，交易可追溯纪录防篡改。',
                        imageUrl: responseJson.url_png,
                        // imageUrl: `${API.address}${this.props.userData.qrcode}`
                    },
                    qqdata: {
                        type: 'image',
                        title: '大师星球',
                        description: '大师星球，我的数据我做主，交易可追溯纪录防篡改。',
                        // webpageUrl: 'http://mastercoinconfig.oss-cn-beijing.aliyuncs.com/share.png',
                        imageUrl: responseJson.url_png,
                        // webpageUrl: `${API.address}/src/assets/images/guide_first.jpg`,
                        // imageUrl: `${API.address}/src/assets/images/guide_first.jpg`
                        // imageUrl: `${API.address}${this.props.userData.qrcode}`
                    }
                })
            } else {
                API.toastLong('网络故障')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    async copy() {
        await Clipboard.setString(this.props.userData.recommend_code);
        API.toastLong('复制成功')
    }

    async share() {
        WeChat
            .isWXAppInstalled()
            .then((isInstalled) => {
                if (isInstalled) {
                    this.setState({modalVisible: true})
                } else {
                    API.toastLong('没有安装微信软件，请您安装微信之后再试')
                }
            })
    }

    shareToSession() {
        this.setState({modalVisible: false});
        WeChat
            .shareToSession(this.state.data)
            .then(res => {
                if (res) {
                    API.toastLong('分享成功')
                }
            })
            .catch(err => {
                if (err.code === -2) {
                    API.toastLong('取消分享')
                }
            })
    }

    shareToSessionQQ() {
        this.setState({modalVisible: false});
        QQAPI
            .shareToQQ(this.state.qqdata)
            .then(res => {
                if (res) {
                    API.toastLong('分享成功')
                }
            })
            .catch(err => {
                if (err.code === -2) {
                    API.toastLong('取消分享')
                }
            })
    }

    shareToTimeline() {
        this.setState({modalVisible: false});
        WeChat
            .shareToTimeline(this.state.data)
            .then(res => {
                if (res) {
                    API.toastLong('分享成功')
                }
            })
            .catch(err => {
                if (err.code === -2) {
                    API.toastLong('取消分享')
                }
            })
    }

    shareToTimelineQQ() {
        this.setState({modalVisible: false});
        QQAPI
            .shareToQzone(this.state.qqdata)
            .then(res => {
                if (res) {
                    API.toastLong('分享成功')
                }
            })
            .catch(err => {
                if (err.code === -2) {
                    API.toastLong('取消分享')
                }
            })
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <ScrollView style={styles.container}>
                    <Image
                        source={require('../../assets/images/planet_txt.png')}
                        style={styles.planetTxt}/>
                    <Text style={styles.quto}>
                        交易可追溯纪录防篡改
                    </Text>
                    <ImageBackground
                        resizeMode='stretch'
                        source={require('../../assets/images/invitation_bg.png')}
                        style={styles.background}>
                        <Text style={styles.codeTitle}>您的邀请码</Text>
                        <View style={styles.codeWrapper}>
                            <Text style={styles.code}>{this.state.recommend_code}</Text>
                        </View>
                        <TouchableOpacity onPress={() => this.copy()} style={[styles.button]}>
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
                                <Text style={styles.btnTxt}>复制</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <Text style={styles.leftTimes}>剩余邀请次数{this.props.userData.leftTimes}次</Text>
                        <View style={styles.totalWrapper}>
                            <Text style={styles.totalTimes}>您的邀请码总次数10次</Text>
                        </View>
                        <Image
                            source={{uri: this.state.qrcode}}
                            style={styles.qrcode}/>
                        <Text style={styles.tips}>扫码下载大师星球</Text>
                        <TouchableOpacity onPress={() => this.share()} style={[styles.button]}>
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
                                <Text style={styles.btnTxt}>邀请好友</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </ImageBackground>
                    <Modal
                        visible={this.state.modalVisible}
                        animationType={"slide"}
                        onRequestClose={() => {
                        }}
                        transparent={true}>
                        <TouchableWithoutFeedback onPress={() => this.setState({modalVisible: false})}>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'flex-end',
                                    backgroundColor: 'rgba(0,0,0,.5)'
                                }}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        padding: 15,
                                        backgroundColor: '#ddd'
                                    }}>
                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginRight: 15
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => this.shareToSession()}
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 60,
                                                height: 60,
                                                borderRadius: 8,
                                                backgroundColor: '#fff'
                                            }}>
                                            <Image
                                                style={{
                                                    width: 29,
                                                    height: 29
                                                }}
                                                source={require('../../assets/icon/weixin.png')}/>
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                marginTop: 10,
                                                fontSize: 12,
                                                color: '#303135'
                                            }}>微信好友</Text>
                                    </View>

                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginRight: 15
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => this.shareToSessionQQ()}
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 60,
                                                height: 60,
                                                borderRadius: 8,
                                                backgroundColor: '#fff'
                                            }}>
                                            <Image
                                                style={{
                                                    width: 33,
                                                    height: 33
                                                }}
                                                source={require('../../assets/icon/qq.png')}/>
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                marginTop: 10,
                                                fontSize: 12,
                                                color: '#303135'
                                            }}>QQ好友</Text>
                                    </View>

                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginRight: 15
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => this.shareToTimeline()}
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 60,
                                                height: 60,
                                                borderRadius: 8,
                                                backgroundColor: '#fff'
                                            }}>
                                            <Image
                                                style={{
                                                    width: 37,
                                                    height: 37
                                                }}
                                                source={require('../../assets/icon/friedent.png')}/>
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                marginTop: 10,
                                                fontSize: 12,
                                                color: '#303135'
                                            }}>朋友圈</Text>
                                    </View>

                                    <View
                                        style={{
                                            alignItems: 'center',
                                            marginRight: 15
                                        }}>
                                        <TouchableOpacity
                                            onPress={() => this.shareToTimelineQQ()}
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 60,
                                                height: 60,
                                                borderRadius: 8,
                                                backgroundColor: '#fff'
                                            }}>
                                            <Image
                                                style={{
                                                    width: 29,
                                                    height: 29
                                                }}
                                                source={require('../../assets/icon/qqkongjian.png')}/>
                                        </TouchableOpacity>
                                        <Text
                                            style={{
                                                marginTop: 10,
                                                fontSize: 12,
                                                color: '#303135'
                                            }}>QQ空间</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => this.setState({modalVisible: false})}
                                    style={{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: API.width,
                                        height: 60,
                                        backgroundColor: '#fff'
                                    }}>
                                    <Text
                                        style={{
                                            color: '#000'
                                        }}>取消</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </ScrollView>
            </ImageBackground>
        );
    }
}

export default connect((state) => state.reducer)(Invitation);
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    planetTxt: {
        alignSelf: 'center',
        width: API.reset(101),
        height: API.reset(64),
        marginVertical: API.reset(22)
    },
    quto: {
        alignSelf: 'center',
        fontSize: 17,
        color: '#fff'
    },
    background: {
        alignSelf: 'center',
        alignItems: 'center',
        paddingTop: API.reset(18),
        paddingBottom: API.reset(20),
        marginTop: API.reset(38),
        marginBottom: API.reset(63),
        width: API.reset(310)
    },
    codeTitle: {
        fontSize: 17,
        color: '#2052E0'
    },
    codeWrapper: {
        justifyContent: 'center',
        height: API.reset(73)
    },
    code: {
        fontWeight: 'bold',
        fontSize: 50,
        color: '#2052E0'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: API.reset(100),
        height: API.reset(35),
        borderRadius: 17
    },
    btnTxt: {
        fontSize: 15,
        color: '#fff'
    },
    leftTimes: {
        marginTop: API.reset(19),
        marginBottom: API.reset(11),
        fontSize: 17,
        color: '#7D63E0'
    },
    totalWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        height: API.reset(30),
        paddingHorizontal: API.reset(8),
        marginBottom: API.reset(50),
        borderRadius: 5,
        backgroundColor: '#FFF4CE'
    },
    totalTimes: {
        color: '#FAB115'
    },
    qrcode: {
        width: API.reset(150),
        height: API.reset(150)
    },
    tips: {
        marginTop: API.reset(10),
        marginBottom: API.reset(18),
        color: '#999'
    }
})