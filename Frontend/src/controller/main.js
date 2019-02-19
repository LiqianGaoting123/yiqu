import React, {Component} from 'react'
import {
    TouchableOpacity,
    Text,
    ImageBackground,
    StyleSheet,
    StatusBar,
    Platform,
    DeviceEventEmitter
} from 'react-native'
import {createStackNavigator} from 'react-navigation'
import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
import API from '../static/methods'
import BackButton from '../components/backButton'
import Home from '../view/home/home';
import Task from '../view/personal/task';
import Authentication from '../view/login/authentication';
import Dynamic from '../view/personal/dynamic';
import Center from '../view/personal/center';
import Record from '../view/personal/record';
import Leadership from '../view/personal/leadership';
import GetLeadership from '../view/personal/getLeadership';
import Account from '../view/personal/account';
import Setting from '../view/personal/setting';
import AboutUs from '../view/personal/aboutUs';
import FeedBack from '../view/personal/feedback';
import PublicAccount from '../view/personal/publicAccount';
import SuccessBind from '../view/personal/successBind';
import Invitation from '../view/personal/invitation';
import Article from '../view/personal/article';
import FeedbackList from '../view/personal/feedbackList';
import FeedbackDetail from '../view/personal/feedbackDetail';
import Decryption from '../view/about/decryption';
import modifyNickname from '../view/personal/modifyNickname';
import modifyPassword from '../view/personal/modifyPassword';
import modifyPaycode from '../view/personal/modifyPaycode';
import MasterCategory from '../view/master/masterCategory';
import MasterDetail from '../view/master/masterDetail';
import MasterList from '../view/master/masterList';
import UploadCertification from '../view/master/uploadCertification';
import UploadArtwork from '../view/master/uploadArtwork';
import MakeAppointment from '../view/master/makeAppointment';
import AppointmentList from '../view/master/appointmentList';
import DatableSetting from '../view/master/datableSetting';
import ArtworkCategory from '../view/artwork/artworkCategory';
import ArtworkList from '../view/artwork/artworkList';
import ArtworkDetail from '../view/artwork/artworkDetail';
import Search from "../components/search";
import ShoppingCenter from "../view/personal/shoppingCenter";
import MyCertifications from '../view/master/myCertifications';
import UploadPrompt from '../view/master/uploadPrompt';
import BindEthereum from '../view/personal/bindEthereum'
import ModifyThereumAddress from '../view/personal/modifyEthereumAddress'
import Order from '../view/personal/order'
import Pay from '../view/personal/pay'

const RouteConfig = {
    Home: {
        screen: Home,
        navigationOptions: {
            header: null
        }
    },
    Task: {
        screen: Task,
        navigationOptions: ({navigation}) => ({
            headerTitle: '星球探索',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Authentication: {
        screen: Authentication,
        navigationOptions: ({navigation}) => ({
            headerTitle: '实名认证',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Dynamic: {
        screen: Dynamic,
        navigationOptions: ({navigation}) => ({
            headerTitle: '创造力排行榜',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Decryption: {
        screen: Decryption,
        navigationOptions: ({navigation}) => ({
            headerTitle: '星球解密',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Center: {
        screen: Center,
        navigationOptions: ({navigation}) => ({
            headerTitle: '个人中心',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Record: {
        screen: Record,
        navigationOptions: ({navigation}) => ({
            headerTitle: '艺能记录',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Leadership: {
        screen: Leadership,
        navigationOptions: ({navigation}) => ({
            headerTitle: '创造力记录',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    GetLeadership: {
        screen: GetLeadership,
        navigationOptions: ({navigation}) => ({
            headerTitle: '获取创造力',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Account: {
        screen: Account,
        navigationOptions: ({navigation}) => ({
            headerTitle: '账户',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Setting: {
        screen: Setting,
        navigationOptions: ({navigation}) => ({
            headerTitle: '设置',
            headerLeft: (<BackButton onPress={() => {
                navigation.state.params.refresh();
                navigation.goBack()
            }}/>)
        })
    },
    AboutUs: {
        screen: AboutUs,
        navigationOptions: ({navigation}) => ({
            headerTitle: '关于我们',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    FeedBack: {
        screen: FeedBack,
        navigationOptions: ({navigation}) => ({
            headerTitle: '意见反馈', headerLeft: (<BackButton onPress={() => navigation.goBack()}/>), headerRight: (
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        height: API.reset(46)
                    }} onPress={() => navigation.navigate('FeedBackList')}>
                    <Text
                        style={{
                            paddingRight: API.reset(18),
                            color: 'rgba(255,255,255,.6)'
                        }}>我的反馈</Text>
                </TouchableOpacity>
            )
        })
    },
    FeedBackList: {
        screen: FeedbackList,
        navigationOptions: ({navigation}) => ({
            headerTitle: '我的反馈',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    FeedbackDetail: {
        screen: FeedbackDetail,
        navigationOptions: ({navigation}) => ({
            headerTitle: '反馈详情',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    PublicAccount: {
        screen: PublicAccount,
        navigationOptions: ({navigation}) => ({
            headerTitle: '关注微信公众号',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    SuccessBind: {
        screen: SuccessBind
    },
    Invitation: {
        screen: Invitation,
        navigationOptions: ({navigation}) => ({
            headerTitle: '邀请好友',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    Article: {
        screen: Article,
        navigationOptions: ({navigation}) => ({
            headerTitle: '公告详情',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    modifyNickname: {
        screen: modifyNickname,
        navigationOptions: ({navigation}) => ({
            headerTitle: '修改昵称',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    modifyPassword: {
        screen: modifyPassword,
        navigationOptions: ({navigation}) => ({
            headerTitle: '修改密码',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    modifyPaycode: {
        screen: modifyPaycode,
        navigationOptions: ({navigation}) => ({
            headerTitle: '修改支付码',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },

    MasterCategory: {
        screen: MasterCategory,
        navigationOptions: ({navigation}) => ({
            headerTitle: (<Search placeholder='搜索艺术家' onSubmitEditing={(event) => {
                DeviceEventEmitter.emit('searchMaster', event.nativeEvent.text)
            }}/>), headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    MasterDetail: {
        screen: MasterDetail,
        navigationOptions: ({navigation}) => ({
            headerTitle: '艺术家详情',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    MasterList: {
        screen: MasterList,
        navigationOptions: ({navigation}) => ({
            headerTitle: (<Search placeholder='搜索艺术家' onSubmitEditing={(event) => {
                DeviceEventEmitter.emit('searchMasterInList', event.nativeEvent.text)
            }}/>), headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    MyCareMaster: {
        screen: MasterList,
        navigationOptions: ({navigation}) => ({
            headerTitle: '我关注的艺术家',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    UploadCertification: {
        screen: UploadCertification,
        navigationOptions: ({navigation}) => ({
            headerTitle: '艺术家认证',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    UploadArtwork: {
        screen: UploadArtwork,
        navigationOptions: ({navigation}) => ({
            headerTitle: '上传艺术品',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    MakeAppointment: {
        screen: MakeAppointment,
        navigationOptions: ({navigation}) => ({
            headerTitle: '预约',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    AppointmentList: {
        screen: AppointmentList,
        navigationOptions: ({navigation}) => ({
            headerTitle: '预约列表',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    DatableSetting: {
        screen: DatableSetting,
        navigationOptions: ({navigation}) => ({
            headerTitle: '设置空闲时间',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    ArtworkCategory: {
        screen: ArtworkCategory,
        navigationOptions: ({navigation}) => ({
            headerTitle: (<Search placeholder='搜索艺术品' onSubmitEditing={(event) => {
                DeviceEventEmitter.emit('searchArtwork', event.nativeEvent.text)
            }}/>), headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    ArtworkList: {
        screen: ArtworkList,
        navigationOptions: ({navigation}) => ({
            headerTitle: (<Search placeholder='搜索艺术品' onSubmitEditing={(event) => {
                DeviceEventEmitter.emit('searchArtworkInList', event.nativeEvent.text)
            }}/>), headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    ArtworkDetail: {
        screen: ArtworkDetail,
        navigationOptions: ({navigation}) => ({
            headerTitle: '艺术品详情',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    MyArtwork: {
        screen: ArtworkList,
        navigationOptions: ({navigation}) => ({
            headerTitle: '我的艺术品',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    MyCareArtwork: {
        screen: ArtworkList,
        navigationOptions: ({navigation}) => ({
            headerTitle: '我关注的艺术品',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    ShoppingCenter: {
        screen: ShoppingCenter,
        navigationOptions: ({navigation}) => ({
            headerTitle: '我的星球',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    MyCertifications: {
        screen: MyCertifications,
        navigationOptions: ({navigation}) => ({
            headerTitle: '我的证书',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    UploadPrompt: {
        screen: UploadPrompt,
        navigationOptions: ({navigation}) => ({
            headerTitle: '上传艺术品',
            headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
        })
    },
    ModifyEthereumAddress: {
        screen: ModifyThereumAddress,
        navigationOptions: ({navigation}) => ({
                headerTitle: '修改地址', headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
            }
        )
    },
    EthereumAccount: {
        screen: BindEthereum,
        navigationOptions: ({navigation}) => ({
            headerTitle: '以太坊钱包', headerLeft: (<BackButton onPress={() => navigation.goBack()}/>),
            headerRight: (
                <TouchableOpacity
                    style={{
                        justifyContent: 'center',
                        height: API.reset(46)
                    }} onPress={() => navigation.navigate('ModifyEthereumAddress')}>
                    <Text
                        style={{
                            paddingRight: API.reset(18),
                            color: 'rgba(255,255,255,.6)'
                        }}>修改地址</Text>
                </TouchableOpacity>)
        })
    },
    Order: {
        screen: Order,
        navigationOptions: ({navigation}) => ({
                headerTitle: '我的订单', headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
            }
        )
    },
    Pay: {
        screen: Pay,
        navigationOptions: ({navigation}) => ({
                headerTitle: '订单支付', headerLeft: (<BackButton onPress={() => navigation.goBack()}/>)
            }
        )
    },
};
const StackNavigatorConfig = {
    initialRouteName: 'Home',
    mode: 'none',
    headerMode: 'float',
    gesturesEnabled: true,
    onTransitionStart: () => {
        dismissKeyboard()
    },
    navigationOptions: {
        headerLeft: (
            <Text></Text>
        ),
        headerRight: (
            <Text></Text>
        ),
        cardStyle: {
            backgroundColor: "transparent"
        },
        headerStyle: {
            height: Platform.OS === 'android' && Platform.Version > 20
                ? StatusBar.currentHeight + API.resetHeight(46)
                : API.resetHeight(46),
            paddingTop: Platform.OS === 'android' && Platform.Version > 20
                ? StatusBar.currentHeight
                : 0,
            // backgroundColor: 'rgb(3, 0, 32)' ,
            backgroundColor: '#242048',
            borderBottomWidth: 0,
            elevation: 0
        },
        headerBackTitleStyle: {
            color: '#fff'
        },
        headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            fontSize: 20,
            color: '#fff'
        }
    }
};
MainStack = createStackNavigator(RouteConfig, StackNavigatorConfig);
export default class Main extends Component {
    static router = MainStack.router;

    render() {
        return (
            <ImageBackground
                source={require('../assets/images/background.jpg')}
                style={styles.background}>
                <MainStack navigation={this.props.navigation}/>
            </ImageBackground>
        )
    }
}
const styles = StyleSheet.create({
    background: {
        flex: 1
    }
});