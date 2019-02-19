import React, {Component} from 'react'
import {TouchableOpacity, View, Text, Image, StyleSheet, ImageBackground} from 'react-native'
import {connect} from 'react-redux'
import {follow, authentication, infoUpdate} from '../../redux/actions';
import LinearGradient from 'react-native-linear-gradient'
import API from '../../static/methods'

class GetLeadership extends Component {
    constructor() {
        super();
        this.state = {
            data: {
                friend: 0, // 邀请一位好友获得的领导力
                //login: 0,  // 每日登陆可获得的领导力
                public: 0, // 关注微信可获得的领导力
                surplus_friend: 0, //剩余邀请次数
                authentication: 0, // 实名认证可以获得的领导力
                is_authentication: false,
            }
        }
    }

    componentDidMount() {
        this.fetchParams()
    }

    async fetchParams() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/mission/leadership', formData})); // 完成任务得到的领导力数量
            let response1 = await API._fetch(API.GET({url: '/mission/leadership/remain', formData})); // 剩余邀请次数
            let response2 = await API._fetch(API.GET({url: '/mission/leadership/check', formData})); // 判断是否完成任务
            let json = await response.json();
            let json1 = await response1.json();
            let json2 = await response2.json();

            if (response.status === 200 && response1.status === 200 && response2.status === 200) {
                this
                    .props
                    .dispatch(follow(json2.wechat));
                this
                    .props
                    .dispatch(authentication(json2.identification));
                this.setState({
                    data: {
                        friend: json.invitation,
                        public: json.wechat,
                        surplus_friend: json1.remain,
                        authentication: json.identification
                    }
                })
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <ImageBackground source={require('../../assets/images/background.jpg')} style={{flex: 1}}>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.props.navigation.navigate('Invitation')}>
                        <View style={styles.imgWrapper}>
                            <Image
                                source={require('../../assets/icon/invite.png')}
                                style={{
                                    width: API.reset(18),
                                    height: API.reset(18)
                                }}/>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.title}>邀请{this.state.data.surplus_friend}位好友</Text>
                            <Text style={styles.brief}>邀请好友获得{this.state.data.friend}创造力</Text>
                        </View>
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
                            style={styles.reward}>
                            <Text
                                style={styles.rewardText}>+{parseInt(this.state.data.friend) * parseInt(this.state.data.surplus_friend)}领导力</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <View style={styles.item}>
                        <View style={styles.imgWrapper}>
                            <Image
                                source={require('../../assets/icon/daily.png')}
                                style={{
                                    width: API.reset(20),
                                    height: API.reset(18)
                                }}/>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.title}>每日登录</Text>
                            <Text style={styles.brief}>登录获取创造力</Text>
                        </View>
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
                            style={styles.reward}>
                            <Text style={styles.rewardText}>已完成</Text>
                        </LinearGradient>
                    </View>
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => this.props.navigation.navigate(this.props.userData.is_attention_public
                            ? 'SuccessBind'
                            : 'PublicAccount')}>
                        <View style={styles.imgWrapper}>
                            <Image
                                source={require('../../assets/icon/wechat.png')}
                                style={{
                                    width: API.reset(20),
                                    height: API.reset(17)
                                }}/>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.title}>关注微信公众号</Text>
                            <Text style={styles.brief}>关注获取创造力</Text>
                        </View>
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
                            style={styles.reward}>
                            <Text style={styles.rewardText}>{!this.props.userData.is_attention_public
                                ? '+' + this.state.data.public + '创造力'
                                : '已完成'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => !this.props.userData.is_authentication
                            ? this.props.navigation.navigate('Authentication')
                            : ''}>
                        <View style={styles.imgWrapper}>
                            <Image
                                source={require('../../assets/icon/verified.png')}
                                style={{
                                    width: API.reset(20),
                                    height: API.reset(17)
                                }}/>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.title}>完成实名认证</Text>
                            <Text style={styles.brief}>认证获取创造力</Text>
                        </View>
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
                            style={styles.reward}>
                            <Text style={styles.rewardText}>{!this.props.userData.is_authentication
                                ? '+' + this.state.data.authentication + '领导力'
                                : '已完成'}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(GetLeadership)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: API.reset(40)
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: API.reset(20),
        paddingRight: API.reset(17),
        marginHorizontal: API.reset(23),
        marginBottom: API.reset(15),
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    imgWrapper: {
        width: API.reset(53),
        paddingLeft: API.reset(20)
    },
    title: {
        marginBottom: API.reset(10),
        color: '#333'
    },
    brief: {
        fontSize: 12,
        color: '#999'
    },
    content: {
        flex: 1
    },
    reward: {
        justifyContent: 'center',
        alignItems: 'center',
        width: API.reset(88),
        height: API.reset(24),
        borderRadius: 5
    },
    rewardText: {
        fontSize: 11,
        color: '#fff'
    }
});