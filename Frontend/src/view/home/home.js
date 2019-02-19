import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ImageBackground,
    Platform,
    Animated,
    Easing,
    StyleSheet,
    UIManager,
    AppState
} from 'react-native'
import {SafeAreaView} from 'react-navigation'
import Sound from 'react-native-sound'
import {connect} from 'react-redux'
import {infoUpdate} from '../../redux/actions';
import API from '../../static/methods'
import MasterCategory from "../master/masterCategory";
import ArtworkList from "../artwork/artworkList";

let disabledClick = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
];

class Home extends Component {
    constructor() {
        super();
        this.AnimationNote = new Animated.Value(0);
        this.clickBtn = new Sound(require('../../audio/click.mp3'), err => {
        });
        this.state = {
            article: [],
            articleIndex: 0,
            portrait: require('../../assets/images/portrait_home.png'),
            nick_name: '星球居民',
            originX: 0,
            originY: 0,
            particle: 0,
            leadership: 0,
            transition: false,
            page: 0,
            tips: '正在聚集中...',
            position: [
                {
                    top: API.reset(192),
                    left: API.reset(46)
                }, {
                    top: API.reset(117),
                    left: API.reset(30)
                }, {
                    top: -10,
                    left: -10
                }, {
                    top: API.reset(-35),
                    left: API.reset(76)
                }, {
                    top: 10,
                    left: API.reset(165)
                }, {
                    top: API.reset(77),
                    left: API.reset(-40)
                }, {
                    top: API.reset(77),
                    left: API.reset(199)
                }, {
                    top: API.reset(157),
                    left: API.reset(170)
                }, {
                    top: API.reset(23),
                    left: API.reset(40)
                }, {
                    top: API.reset(95),
                    left: API.reset(120)
                }
            ],
            values: [],
            totalAmount: 0,
            clickTimes: 0,
            dataFetched: false
        }
    }

    componentDidMount() {
        this.fetchData();

        this.focusListener = this
            .props
            .navigation
            .addListener('didFocus', () => {
                this.dailyTask();
                this.fetchData();
                this.fetchArticle()
            });
        this.appStateListener = AppState.addListener('appStateDidChange', (state) => {
            if (state.app_state === 'active') {
                this.dailyTask();
                this.fetchData();
                this.fetchArticle();
            }
        });
    }

    componentWillUnmount() {
        this
            .focusListener
            .remove();
        this
            .appStateListener
            .remove();
    }

    async dailyTask() {
        // let formData = {};
        // try {
        //     let response = await API._fetch(API.POST({url: 'Api/User/loginGet', formData}));
        //     let responseJson = await response.json();
        //     if (responseJson.status) {
        //         API.toastLong(responseJson.info)
        //     }
        // } catch (error) {
        //     API.toastLong('操作失败')
        // }
    }

    async fetchData() {
        disabledClick = [
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false
        ];
        try {
            let formData = {};
            let response = await API._fetch(API.GET({url: '/grain/', formData}));
            let responseJson = await response.json();

            let response1 = await API._fetch(API.GET({url: '/profile/abstract', formData}));
            let responseJson1 = await response1.json();

            if (response.status === 200) {
                // responseJson.data.user.head_pic = {
                //     uri: `http://${responseJson.data.user.head_pic}`
                // };
                this.setState({
                    values: responseJson.grainDtos,
                    totalAmount: responseJson.grainDtos.length,
                    clickTimes: 0,
                    // portrait: responseJson.data.user.head_pic,
                    nick_name: responseJson1.username,
                    particle: responseJson1.balance,
                    leadership: responseJson1.leadership,
                    tips: responseJson.grainDtos.length
                        ? '48小时后消失'
                        : '正在聚集中...',
                    dataFetched: true,
                });
                this
                    .props
                    .dispatch(infoUpdate({nick_name: responseJson1.username}));
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    getParticle(e) {
        UIManager.measure(e.target, (a, b, c, d, pageX, pageY) => {
            this.particle = {
                pageX: pageX,
                pageY: pageY
            }
        })
    }

    getPlanet(e) {
        UIManager.measure(e.target, (a, b, c, d, pageX, pageY) => {
            this.planet = {
                pageX: pageX,
                pageY: pageY
            }
        })
    }

    async fetchArticle() {
        // this.setState({article: [{title: '艺能可在"数字星球学院"小程序购买课程', id: '1'}]});
        let formData = {};
        try {
            // 得到公告列表
            let response = await API._fetch(API.GET({url: '/profile/bulletin', formData}));
            let responseJson = await response.json();
            console.log(response);
            if (response.status) {
                this.setState({article: [{title: responseJson.title, content: responseJson.bulletin, id: '1'}]});
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    renderArticle(item, index) {
        return (
            <TouchableOpacity
                key={index}
                style={{
                    marginRight: API.reset(30)
                }}
                onPress={() => {
                    this.props.navigation.navigate('Article', {id: item.title, content: item.content});
                }}>
                <Text style={styles.noteText}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    noteOnLayout(e) {
        UIManager.measure(e.target, (a, b, width, d, pageX, pageY) => {
            if (width > 0) {
                this.noteSlide(width)
            }
        })
    }

    noteSlide(width) {
        Animated
            .timing(this.AnimationNote, {
                toValue: -width,
                duration: width * 30,
                easing: Easing.linear
            })
            .start(() => {
                this
                    .AnimationNote
                    .setValue(width);
                this.noteSlide(width)
            })
    }

    // 收获艺能
    async fetchParticleAPI(id) {
        let formData = {};
        try {
            let response = await API._fetch(API.POST({url: '/grain/' + id, formData}));
            if (response.status) {
                if (this.state.clickTimes === this.state.totalAmount - 1) {
                    // 重新获得艺能
                    this.fetchData();
                    this.setState({clickTimes: 0})
                } else {
                    // 仅仅设置点击次数加1
                    this.setState((previousStatus) => {
                        return {
                            clickTimes: previousStatus.clickTimes + 1
                        }
                    })
                }
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    getValue(AnimationLeft, AnimationTop, AnimationScale, index, item) {
        if (disabledClick[index]) {
        } else {
            disabledClick[index] = true;
            this
                .clickBtn
                .stop(() => {
                    this
                        .clickBtn
                        .play()
                });
            Animated
                .timing(AnimationLeft, {
                    toValue: this.particle.pageX - this.planet.pageX,
                    duration: 500,
                    easing: Easing.linear
                })
                .start(() => {
                });
            Animated
                .timing(AnimationTop, {
                    toValue: this.particle.pageY - this.planet.pageY,
                    duration: 500,
                    easing: Easing.linear
                })
                .start();
            Animated
                .timing(AnimationScale, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.linear
                })
                .start(() => {
                    this.setState((previousStatus) => {
                        let [...newValue] = previousStatus.values;
                        newValue[index] = null;
                        let particle = (parseFloat(previousStatus.particle) + parseFloat(item.value));
                        return {values: newValue, particle: particle}
                    });
                    this.fetchParticleAPI(item.id)
                })
        }
    }

    // 艺能排列
    renderItem(item, index) {
        const position = this.state.position;
        const AnimationLeft = new Animated.Value(position[index].left);
        const AnimationTop = new Animated.Value(position[index].top);
        const AnimationScale = new Animated.Value(1);
        return <Animated.View
            key={index}
            style={{
                position: 'absolute',
                left: AnimationLeft,
                top: AnimationTop,
                transform: [
                    {
                        scale: AnimationScale
                    }
                ]
            }}>
            <TouchableOpacity
                style={[styles.item]}
                onPress={() => this.getValue(AnimationLeft, AnimationTop, AnimationScale, index, item)}>
                <Image source={require('../../assets/icon/particle.png')} style={styles.itemIcon}/>
                <Text style={styles.itemValue}>
                    {item.value}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    }

    render() {
        const navigation = this.props.navigation;
        return (
            <ImageBackground
                source={require('../../assets/images/background.jpg')}
                style={styles.background}>
                <SafeAreaView style={{
                    flex: 1
                }}>
                    {/*公告*/}
                    <View style={styles.note}>
                        <View style={styles.noteBtn}>
                            <Image source={require('../../assets/icon/note.png')} style={styles.noteIcon}/>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flex: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    backgroundColor: 'transparent'
                                }}>
                                <Animated.View
                                    onLayout={(e) => this.noteOnLayout(e)}
                                    style={{
                                        flexDirection: 'row',
                                        transform: [
                                            {
                                                translateX: this.AnimationNote
                                            }
                                        ]
                                    }}>
                                    {this
                                        .state
                                        .article
                                        .map((item, index) => this.renderArticle(item, index))}
                                </Animated.View>
                            </View>
                        </View>
                    </View>
                    {/*左上角个人中心和右上角我的艺能和创造力*/}
                    <View style={styles.info}>
                        <TouchableOpacity
                            style={styles.personal}
                            onPress={() => navigation.navigate('Center')}>
                            <Image source={this.state.portrait} style={styles.portrait}/>
                            <Text style={styles.name}>{this.state.nick_name}</Text>
                        </TouchableOpacity>
                        <View style={styles.value}>
                            <Text style={styles.particleName}>我的艺能</Text>
                            <TouchableOpacity
                                style={styles.particle}
                                onLayout={e => this.getParticle(e)}
                                onPress={() => navigation.navigate('Record')}>
                                <Image source={require('../../assets/icon/particle.png')} style={styles.particleImg}/>
                                <Text style={styles.particleNum}>{this.state.particle.toFixed(5)}</Text>
                            </TouchableOpacity>
                            <Text style={styles.leadingName}>我的创造力</Text>
                            <TouchableOpacity
                                style={styles.leading}
                                onPress={() => navigation.navigate('Leadership', {total: this.state.leadership})}>
                                <Image source={require('../../assets/icon/leading.png')} style={styles.leadingImg}/>
                                <Text style={styles.leadingNum}>{this.state.leadership}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/*艺能图标展示*/}
                    <ImageBackground
                        onLayout={e => this.getPlanet(e)}
                        resizeMode='stretch'
                        source={require('../../assets/icon/planet.png')}
                        style={styles.planetBackgound}>
                        {this.state.dataFetched ?
                            this
                                .state
                                .values
                                .map((item, index) => {
                                    if (item) {
                                        return this.renderItem(item, index)
                                    } else {
                                    }
                                }) : <View/>}
                    </ImageBackground>
                    {/*艺能提示字*/}
                    <View style={styles.message}>
                        <ImageBackground
                            source={require('../../assets/icon/status.png')}
                            style={styles.messageBackground}>
                            <Text style={styles.msgText}>{this.state.tips}</Text>
                        </ImageBackground>
                    </View>
                    {/*下面的导航栏*/}
                    <View style={styles.nav}>
                        <TouchableOpacity
                            style={styles.task}
                            onPress={() => navigation.navigate('MasterCategory')}>
                            <Image source={require('../../assets/icon/data.png')} style={styles.navItemImg}/>
                            <Text style={styles.navItemTxt}>预约大师</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.dynamic}
                            onPress={() => navigation.navigate('ArtworkCategory')}>
                            <Image source={require('../../assets/icon/shoppingcenter.png')} style={styles.navItemImg}/>
                            <Text style={styles.navItemTxt}>星球商城</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.invitation}
                            onPress={() => navigation.navigate('Task')}>
                            <Image
                                source={require('../../assets/icon/find.png')}
                                style={styles.navItemImg}/>
                            <Text style={styles.navItemTxt}>星球探索</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.invitation}
                            onPress={() => navigation.navigate('ShoppingCenter')}>
                            <Image
                                source={require('../../assets/icon/people.png')}
                                style={styles.navItemImg}/>
                            <Text style={styles.navItemTxt}>我的星球</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(Home)
const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    note: {
        paddingTop: Platform.OS === 'android' && Platform.Version >= 20
            ? API.reset(30)
            : API.reset(16),
        paddingBottom: API.reset(21),
        paddingLeft: API.reset(15),
        paddingRight: API.reset(15)

    },
    noteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: API.reset(12),
        paddingRight: API.reset(12),
        height: API.reset(33),
        borderRadius: API.reset(17),
        backgroundColor: 'rgba(255,255,255,.2)'
    },
    noteIcon: {
        width: API.reset(21),
        height: API.reset(17),
        marginRight: API.reset(9)
    },
    noteText: {
        fontSize: 12,
        color: '#fff'
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    personal: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: API.reset(18)
    },
    portrait: {
        width: API.reset(55),
        height: API.reset(55),
        marginRight: API.reset(11)
    },
    name: {
        flex: 1,
        fontSize: 17,
        color: '#fff'
    },
    value: {
        width: API.reset(122)
    },
    particleName: {
        paddingTop: API.reset(5),
        paddingLeft: API.reset(4),
        fontSize: 11,
        color: '#fff'
    },
    particle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: API.reset(3)
    },
    particleImg: {
        width: API.reset(30),
        height: API.reset(30),
        marginRight: API.reset(7)
    },
    particleNum: {
        fontSize: 11,
        color: '#df1bf1'
    },
    leadingName: {
        paddingLeft: API.reset(4),
        marginTop: API.reset(12),
        marginBottom: API.reset(8),
        fontSize: 11,
        color: '#fff'
    },
    leading: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: API.reset(4)
    },
    leadingImg: {
        width: API.reset(30),
        height: API.reset(30),
        marginRight: API.reset(7),
        marginLeft: API.reset(-4)
    },
    leadingNum: {
        fontSize: 11,
        color: '#ffc000'
    },
    planetBackgound: {
        position: 'relative',
        alignSelf: 'center',
        width: API.reset(227),
        height: API.reset(227),
        marginTop: API.reset(21)
    },
    item: {
        alignItems: 'center'
    },
    itemIcon: {
        width: API.reset(57),
        height: API.reset(57)
    },
    itemValue: {
        fontSize: 11,
        color: '#df1bf1'
    },
    message: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    messageBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        width: API.reset(167),
        height: API.reset(46)
    },
    msgText: {
        color: '#fff'
    },
    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: API.width,
        height: API.reset(55),
        backgroundColor: 'rgba(95, 65, 204, 0.4)',
        paddingRight: API.reset(25),
        paddingLeft: API.reset(25)
    },
    task: {
        alignItems: 'center',
        paddingTop: API.reset(2)
    },
    dynamic: {
        alignItems: 'center',
        paddingTop: API.reset(2)
    },
    invitation: {
        alignItems: 'center',
        paddingTop: API.reset(2)
    },
    navItemImg: {
        width: API.reset(24),
        height: API.reset(24),
        marginTop: API.reset(4),
        marginBottom: API.reset(4)
    },
    navItemTxt: {
        marginTop: API.reset(6),
        fontSize: 12,
        color: '#ae8dff'
    }
});
