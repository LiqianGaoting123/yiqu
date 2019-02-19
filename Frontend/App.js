import React, {Component} from 'react';
import {
    ScrollView,
    ImageBackground,
    TextInput,
    StatusBar,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import {createSwitchNavigator} from 'react-navigation';
import Storage from "react-native-storage";
import SplashScreen from 'react-native-splash-screen';
import {connect} from 'react-redux';
import {infoUpdate} from './src/redux/actions';
import API from './src/static/methods';
import Guide from './src/view/guide/guide';
import LoginApp from './src/controller/login';
import Main from './src/controller/main';

global.storage = new Storage({
    size: 100, //最大容量
    storageBackend: AsyncStorage, //存储引擎
    defaultExpires: 1000 * 3600 * 24 * 30, //缓存时间
    enableCache: true // 读写时在内存中缓存数据。默认启用。
});
TextInput.defaultProps = {
    underlineColorAndroid: "transparent",
    placeholderTextColor: "#B5B5B5",
    selectionColor: '#2052E0'
};
ScrollView.defaultProps = {
    keyboardShouldPersistTaps: 'handled'
};
StatusBar.setHidden(true);
const RouteConfigs = {
    Guide: {
        screen: Guide
    },
    LoginApp: {
        screen: LoginApp
    },
    Main: {
        screen: Main
    }
};
const SwitchNavigatorConfig = {
    initialRouteName: 'Guide'
};
const SwitchNavigator = createSwitchNavigator(RouteConfigs, SwitchNavigatorConfig);

class App extends Component {
    static router = SwitchNavigator.router;

    componentDidMount() {
        this.loadFirst()
    }

    showScreen() {
        SplashScreen.hide();
        StatusBar.setHidden(false);
    }

    async loadFirst() {
        try {
            let response = await storage.load({key: 'firstDownload', id: '1'});
            response
                ? this.loadToken()
                : this.showScreen()
        } catch (error) {
            storage.save({key: 'firstDownload', id: '1', data: true});
            this.showScreen()
        }
    }

    async loadToken() {
        try {
            let response = '';
            await storage.load({key: 'token', id: '2'}).then(ret => {
                // 如果找到数据，则在then方法中返回
                response = ret;
            }).catch(() => {
                // 如果没有找到数据且没有sync方法，
                // 或者有其他异常，则在catch中返回
                storage.save({
                    key: 'token',  // 注意:请不要在key中使用_下划线符号!
                    id: '2',
                    data: '',
                });
                response = '';
            });
            global.token = response;
            console.log(2);
            this.initData()
        } catch (error) {
            this
                .refs
                .switch
                ._navigation
                .navigate('LoginApp');
            this.showScreen()
        }
    }

    async initData() {
        try {
            let response = await storage.getBatchData([
                {
                    key: 'userInfo',
                    id: '3'
                }, {
                    key: 'property',
                    id: '4'
                }, {
                    key: 'custom',
                    id: '5'
                }, {
                    key: 'invitation',
                    id: '6'
                }, {
                    key: 'followStatus',
                    id: '7'
                }, {
                    key: 'qrcode',
                    id: '8'
                }

            ]);
            response.forEach(data => {
                this
                    .props
                    .dispatch(infoUpdate(data))
            });
            this
                .refs
                .switch
                ._navigation
                .navigate('Main');
            this.showScreen()
        } catch (error) {
            console.log(error);
            this.showScreen()
        }
    }

    render() {
        return (
            <ImageBackground
                source={require('./src/assets/images/background.jpg')}
                style={styles.background}>
                <StatusBar
                    barStyle='light-content'
                    backgroundColor="#314eaa"
                    translucent={true}/>
                <SwitchNavigator
                    style={{
                        backgroundColor: '#314eaa'
                    }}
                    ref='switch'/>
                <ActivityIndicator
                    size={"large"}
                    // color={"#fff"}
                    style={[
                        styles.loading, {
                            display: this.props.isLoading
                                ? 'flex'
                                : 'none'
                        }
                    ]}/>
            </ImageBackground>
        )
    }
}

export default connect(state => state.reducer)(App)
const styles = StyleSheet.create({
    background: {
        flex: 1,
        height: API.height,
        width: API.width,
    },
    loading: {
        position: "absolute",
        left: API.width / 2 - API.reset(65),
        top: API.height / 2 - API.reset(65),
        width: API.reset(130),
        height: API.reset(130),
        borderRadius: 10,
        backgroundColor: "rgba(152,66,250,.3)"
    }
});