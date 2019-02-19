import React, {Component} from 'react'
import {
    TouchableOpacity,
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView, ImageBackground, Platform, StatusBar, Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import API from '../../static/methods';
import {follow, authentication} from '../../redux/actions';
import Dynamic from "./dynamic";

class Task extends Component {
    constructor() {
        super();
        this.state = {
            data: {
                friend: 0, // 邀请一位好友获得的创造力
                //login: 0,  // 每日登陆可获得的创造力
                public: 0, // 关注微信可获得的创造力
                surplus_friend: 0, //剩余邀请次数
                authentication: 0, // 实名认证可以获得的创造力
            },
            is_authentication: false,
        }
    }

    componentDidMount() {
        this.fetchParams();
    }

    async fetchParams() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/mission/leadership', formData})); // 完成任务得到的创造力数量
            let response1 = await API._fetch(API.GET({url: '/mission/leadership/remain', formData})); // 剩余邀请次数
            let response2 = await API._fetch(API.GET({url: '/mission/leadership/check', formData})); // 判断是否完成任务
            // let response3 = await API._fetch(API.POST({url: '/user/profile/access', formData})); // 判断能否进入认证
            // console.log(response3);
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
                        authentication: json.identification,
                    }
                });
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <ImageBackground
                source={require('../../assets/icon/background.jpg')}
                style={styles.container}>
                <ScrollView>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Decryption')}>
                            <ImageBackground
                                source={require('../../assets/images/decryption.png')}
                                style={styles.decryption}>
                                <Text style={styles.decryptionTitle}>星球解密</Text>
                                <Text style={styles.decryptionBrief}>揭开大师星球神秘面纱</Text>
                            </ImageBackground>
                        </TouchableOpacity>


                        <View style={styles.task}>
                            {/*<View style={styles.baseTask}>*/}
                                {/*<View style={styles.titleWapper}>*/}
                                    {/*<Text style={styles.title}>艺术品商城</Text>*/}
                                {/*</View>*/}
                                {/*<View style={styles.baseWapper}>*/}
                                    {/*<TouchableOpacity*/}
                                        {/*style={[styles.item]}*/}
                                        {/*onPress={() => this.props.navigation.navigate('MasterCategory')}>*/}
                                        {/*<View style={styles.imgWrapper}>*/}
                                            {/*<Image*/}
                                                {/*source={require('../../assets/icon/name.png')}*/}
                                                {/*style={{*/}
                                                    {/*width: API.reset(18),*/}
                                                    {/*height: API.reset(18)*/}
                                                {/*}}/>*/}
                                        {/*</View>*/}
                                        {/*<Text style={styles.itemTitle}>查看艺术家</Text>*/}
                                    {/*</TouchableOpacity>*/}
                                    {/*<TouchableOpacity*/}
                                        {/*style={[styles.item]}*/}
                                        {/*onPress={() => this.props.navigation.navigate('ArtworkCategory')}>*/}
                                        {/*<View style={styles.imgWrapper}>*/}
                                            {/*<Image*/}
                                                {/*source={require('../../assets/icon/artwork.png')}*/}
                                                {/*style={{*/}
                                                    {/*width: API.reset(18),*/}
                                                    {/*height: API.reset(18)*/}
                                                {/*}}/>*/}
                                        {/*</View>*/}
                                        {/*<Text style={styles.itemTitle}>查看艺术品</Text>*/}
                                    {/*</TouchableOpacity>*/}
                                    {/*<TouchableOpacity*/}
                                        {/*style={[styles.item]}*/}
                                        {/*onPress={async () => {*/}
                                            {/*let formData = {};*/}
                                            {/*let response3 = await API._fetch(API.POST({*/}
                                                {/*url: '/user/profile/access',*/}
                                                {/*formData*/}
                                            {/*})); // 判断能否进入认证*/}
                                            {/*// console.log(response3);*/}
                                            {/*response3.status === 403 ? Alert.alert('温馨提示', '对不起，您已进行认证过') : this.props.navigation.navigate('UploadCertification')*/}
                                        {/*}}>*/}
                                        {/*<View style={styles.imgWrapper}>*/}
                                            {/*<Image*/}
                                                {/*source={require('../../assets/icon/verified.png')}*/}
                                                {/*style={{*/}
                                                    {/*width: API.reset(18),*/}
                                                    {/*height: API.reset(18)*/}
                                                {/*}}/>*/}
                                        {/*</View>*/}
                                        {/*<Text style={styles.itemTitle}>艺术家认证</Text>*/}
                                    {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                            {/*</View>*/}

                            <View style={styles.baseTask}>
                                <View style={{
                                    // justifyContent: 'center',

                                    height: API.reset(47),
                                    paddingLeft: API.reset(26),
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    borderBottomColor: '#e6e6e6',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <Text style={{
                                        fontWeight: 'bold',
                                        fontSize: 17,
                                        color: '#333',
                                        flex: 1
                                    }}>基础任务</Text>

                                    <Text
                                        style={{
                                            fontSize: 16,
                                            flex: 1,
                                            color: '#818181',
                                            textAlign: 'right',
                                            marginRight: API.reset(26)
                                        }}
                                        onPress={() => this.props.navigation.navigate('Dynamic')}
                                    >创造力排行榜</Text>
                                </View>
                                <View style={styles.baseWapper}>
                                    <TouchableOpacity
                                        style={[styles.item, styles.itemBorder]}
                                        onPress={() => this.props.navigation.navigate('Invitation')}>
                                        <View style={styles.imgWrapper}>
                                            <Image
                                                source={require('../../assets/icon/invite.png')}
                                                style={{
                                                    width: API.reset(18),
                                                    height: API.reset(18)
                                                }}/>
                                        </View>
                                        <Text style={styles.itemTitle}>邀请{this.state.data.surplus_friend}位好友</Text>
                                        <View style={styles.briefWrapper}>
                                            <Text style={styles.itemBrief}>邀请一位好友</Text>
                                            <Text style={styles.itemBrief}>获得{this.state.data.friend}创造力</Text>
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
                                                style={styles.rewardText}>{this.state.data.surplus_friend === 0 ? '已完成' : '+' + parseInt(this.state.data.friend) * parseInt(this.state.data.surplus_friend) + '创造力'}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    <TouchableOpacity disabled style={[styles.item, styles.itemBorder]}>
                                        <View style={styles.imgWrapper}>
                                            <Image
                                                source={require('../../assets/icon/daily.png')}
                                                style={{
                                                    width: API.reset(20),
                                                    height: API.reset(18)
                                                }}/>
                                        </View>
                                        <Text style={styles.itemTitle}>每日登录</Text>
                                        <View style={styles.briefWrapper}>
                                            <Text style={styles.itemBrief}>登录获取创造力</Text>
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
                                    </TouchableOpacity>
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
                                        <Text style={styles.itemTitle}>关注微信公众号</Text>
                                        <View style={styles.briefWrapper}>
                                            <Text style={styles.itemBrief}>关注获取创造力</Text>
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
                                                style={styles.rewardText}>{this.props.userData.is_attention_public
                                                ? '已完成'
                                                : `+${this.state.data.public}创造力`}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>

                                <View
                                    style={[
                                        styles.baseWapper, {
                                            justifyContent: 'flex-start',
                                            width: '100%'
                                        }
                                    ]}>
                                    <TouchableOpacity
                                        style={[styles.item, styles.itemBorder, styles.itemBorderTop]}
                                        onPress={() => this.props.userData.is_authentication
                                            ? '' : this.props.navigation.navigate('Authentication')}>
                                        <View style={styles.imgWrapper}>
                                            <Image
                                                source={require('../../assets/icon/verified.png')}
                                                style={{
                                                    width: API.reset(18),
                                                    height: API.reset(18)
                                                }}/>
                                        </View>
                                        <Text style={styles.itemTitle}>完成实名认证</Text>
                                        <View style={styles.briefWrapper}>
                                            <Text style={styles.itemBrief}>认证获取创造力</Text>
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
                                                style={styles.rewardText}>{this.props.userData.is_authentication
                                                ? '已完成'
                                                : '+' + this.state.data.authentication + '创造力'}</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <View style={[styles.item, styles.itemBorderTop]}/>

                                    <View style={[styles.item, styles.itemBorderTop]}/>
                                </View>
                            </View>


                            <View style={styles.ownTask}>
                                <View style={styles.titleWapper}>
                                    <Text style={styles.title}>独家任务</Text>
                                </View>
                                <View style={styles.ownTaskContainer}>
                                    <Text style={styles.empty}>大量任务来袭，敬请期待...</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(Task)
const styles = StyleSheet.create({
    decryption: {
        width: API.reset(322),
        height: API.reset(143),
        paddingHorizontal: API.reset(19),
        paddingVertical: API.reset(28),
        marginTop: API.reset(14),
        marginBottom: API.reset(14),
        marginHorizontal: API.reset(25),
        borderRadius: API.reset(15)
    },
    decryptionTitle: {
        marginBottom: API.reset(24),
        fontWeight: 'bold',
        fontSize: 28,
        color: '#fff'
    },
    decryptionBrief: {
        fontSize: 17,
        color: '#fff'
    },
    itemBorder: {
        borderRightWidth: StyleSheet.hairlineWidth,
        borderColor: '#e6e6e6'
    },
    itemBorderTop: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#e6e6e6'
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        marginTop: Platform.OS === 'android' && Platform.Version > 20
            ? -StatusBar.currentHeight
            : -0,
        // backgroundColor: '#314eaa',
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: API.reset(62),
        marginTop: API.reset(25)
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: API.reset(26)
    },
    text: {
        fontSize: 17,
        lineHeight: API.reset(36),
        color: '#fff'
    },
    particle: {
        width: API.reset(112),
        height: API.reset(112)
    },
    task: {
        flex: 1,
        backgroundColor: '#f3f3f3',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    titleWapper: {
        justifyContent: 'center',
        height: API.reset(47),
        paddingLeft: API.reset(26),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e6e6e6',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#333'
    },
    baseTask: {
        marginBottom: API.reset(10),
        backgroundColor: '#fff'
    },
    baseWapper: {
        flexDirection: 'row'
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: API.reset(15)
    },
    imgWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        height: API.reset(33)
    },
    itemTitle: {
        fontWeight: 'bold',
        color: '#333'
    },
    briefWrapper: {
        justifyContent: 'space-between',
        height: API.reset(45),
        paddingVertical: API.reset(7)
    },
    itemBrief: {
        fontSize: 12,
        color: '#999'
    },
    reward: {
        alignItems: 'center',
        justifyContent: 'center',
        width: API.reset(88),
        height: API.reset(24),
        borderRadius: 5
    },
    rewardText: {
        fontSize: 11,
        color: '#fff'
    },
    ownTask: {
        flex: 1,
        backgroundColor: '#fff'
    },
    ownTaskContainer: {
        //flex: 1,
        width: '100%',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center'
    },
    empty: {
        fontSize: 15,
        color: '#999'
    },
    baseFlex: {
        flex: 1
    }
});
