import React, {Component} from 'react'
import {
    View,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
} from 'react-native'
import ReactNative from 'react-native';
import {connect} from 'react-redux'
import {showLoading} from '../../redux/actions';
import API from '../../static/methods'
import SubmitBtn from '../../components/submitButton';

let ImagePicker = require('react-native-image-picker');

// More info on all the options is below in the README...just some common use cases shown here
let options = {
    title: '选择图片',
    customButtons: [
        {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};


class FeedBack extends Component {
    constructor() {
        super();
        this.state = {
            uploadImg: require('../../assets/icon/smallupload.png'),
            category: [],
            activeIndex: 0,
            content: '',
            contact: '',
            photo: null
        }
    }

    componentDidMount() {
        this.fetchCategory()
    }

    async fetchCategory() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/profile/feedback/type', formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({category: responseJson.types})
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('网络请求失败')
        }
    }

    async uploadImg() {
        this
            .props
            .dispatch(showLoading(true));

        ImagePicker.launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.error) {
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.customButton) {
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else {
                let file = {uri: response.uri, type: 'multipart/form-data', name: response.fileName};
                try {
                    let response = await API._fetch(API.upload(file));

                    let responseJson = await response.json();

                    this
                        .props
                        .dispatch(showLoading(false));

                    if (response.status === 200) {
                        this.setState({
                            uploadImg: {uri: responseJson.url},
                            photo: responseJson.url
                        })
                    }
                } catch (error) {
                    this
                        .props
                        .dispatch(showLoading(false));
                    API.toastLong('网络连接失败')
                }
            }
        });
    }

    async submit() {
        if (this.state.content === '') {
            Alert.alert('内容不完整', '请输入问题描述');
            return;
        }
        if (this.state.photo === null) {
            Alert.alert('内容不完整','请上传问题截图');
            return;
        }
        if (this.state.contact === '') {
            Alert.alert('内容不完整','请输入您的联系方式');
            return;
        }
        if (!/^1[34578]\d{9}$/.test(this.state.contact)) {
            Alert.alert('格式错误','请输入正确的电话号码');
            return
        }

        let formData = {
            'type': this.state.category[this.state.activeIndex],
            'content': this.state.content,
            'url': this.state.photo,
            'tel': this.state.contact
        };
        try {
            this.props.dispatch(showLoading(true));
            let response = await API._fetch(API.POST({url: '/profile/feedback', formData}));
            this.props.dispatch(showLoading(false));
            if (response.status === 200) {
                this.props.navigation.goBack();
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            this.props.dispatch(showLoading(false));
            API.toastLong('操作失败')
        }
    }

    renderCategory(item, index) {
        return (
            <TouchableOpacity
                key={index}
                onPress={() => this.setState({activeIndex: index})}
                style={[
                    styles.type, {
                        backgroundColor: this.state.activeIndex === index
                            ? '#2052e0'
                            : '#fff'
                    }
                ]}>
                <Text
                    style={{
                        color: this.state.activeIndex === index
                            ? '#fff'
                            : '#2052e0'
                    }}>{item}</Text>
            </TouchableOpacity>
        )
    }

    _reset() {
        this.refs.scrollView.scrollTo({y: API.reset(0)});
    }

    _onFocus(refName) {
        setTimeout(()=> {
            let scrollResponder = this.refs.scrollView.getScrollResponder();
            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                ReactNative.findNodeHandle(this.refs[refName]), API.reset(100), true);
        }, 100);
    }

    render() {
        return (
            <ScrollView style={styles.container} ref="scrollView">
                <Text style={styles.title}>我的反馈</Text>
                <View style={styles.typeWrapper}>
                    {this
                        .state
                        .category
                        .map((item, index) => this.renderCategory(item, index))}
                </View>
                <TextInput
                    multiline
                    placeholder='请详细描述问题，以便我们帮您解决'
                    placeholderTextColor='#999999'
                    textAlignVertical='top'
                    style={styles.textAera}
                    onChangeText={(text) => this.setState({content: text})}/>
                <Text style={styles.title}>上传问题截图</Text>
                <View style={styles.uploadWrapper}>
                    <TouchableOpacity style={styles.uploadBtn} onPress={() => this.uploadImg()}>
                        <Image source={this.state.uploadImg} style={styles.uploadImg}/>
                    </TouchableOpacity>
                </View>
                <TextInput
                    ref="textInput"
                    placeholder='请输入您的联系方式'
                    placeholderTextColor='#999999'
                    style={styles.input}
                    maxLength={11}
                    keyboardType={'phone-pad'}
                    onBlur={this._reset.bind(this)}
                    onFocus={this._onFocus.bind(this, 'textInput')}
                    onChangeText={(text) => this.setState({contact: text})}/>
                <SubmitBtn
                    text='提交'
                    buttonStyle={styles.submit}
                    onPress={() => this.submit()}/>
            </ScrollView>
        )
    }
}

export default connect((state => state.reducer))(FeedBack)
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
        borderRadius: API.reset(5)
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
        height: API.reset(54),
        paddingHorizontal: (18),
        backgroundColor: '#fff'
    },
    submit: {
        marginTop: API.reset(59)
    }
});