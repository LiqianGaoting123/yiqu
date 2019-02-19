import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from "react-native";
import React, {Component} from "react";
import LinearGradient from "react-native-linear-gradient";
import API from "../../static/methods";
import {connect} from "react-redux";
import {infoUpdate, showLoading} from "../../redux/actions";


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

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */

class MyCertifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certifications:
                <TouchableOpacity onPress={() => {
                    this.launchCertificationPicker();
                }}>
                    <Image source={require('../../assets/icon/bupload.png')} style={styles.promptPic}/>
                </TouchableOpacity>,
            certificationImg: ['https://facebook.github.io/react-native/docs/assets/favicon.png'], // 图片的url
            certificationNum: 1,
        };
    }

    componentDidMount() {
        this.fetchDetail();
    };

    async fetchDetail() {
        let formData = {};
        try {
            let response = await
                API._fetch(API.GET({url: '/master/certificate', formData}));

            let responseJson = await response.json();
            if (response.status === 200) {
                let cer = responseJson.certificate;

                for(let i = 0; i < cer.length; i++){
                    if(cer[i] === ''){
                        cer.splice(i, 1);
                    }
                }

                this.setState({
                    certificationImg: cer,
                    certificationNum: cer.length
                })
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('网络连接失败')
        }
    }

    async uploadCertificationImage(file) {
        try {
            let response = await API._fetch(API.upload(file));

            let responseJson = await response.json();

            this
                .props
                .dispatch(showLoading(false));

            if (response.status === 200) {
                let newCertificants = [];
                newCertificants = newCertificants.concat(this.state.certificationImg);
                newCertificants = newCertificants.concat(responseJson.url);

                this.setState({
                    certificationImg: newCertificants,
                    certificationNum: this.state.certificationNum + 1
                })
            }
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('网络连接失败')
        }
    }

    async launchCertificationPicker() {
        this
            .props
            .dispatch(showLoading(true));

        ImagePicker.launchImageLibrary(options, (response) => {
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
                this.uploadCertificationImage(file);
            }
        });
    }

    deleteCertification() {
        let newCertificants = [];
        newCertificants = newCertificants.concat(this.state.certificationImg);
        newCertificants.splice(this.state.certificationNum - 1, 1);

        this.setState({
            certificationImg: newCertificants,
            certificationNum: this.state.certificationNum - 1
        });
    }

    async submit() {
        // 证书
        if (this.state.certificationImg === '') {
            alert('请添加职称证书');
            return
        }

        try {
            this
                .props
                .dispatch(showLoading(true));

            let formData = {
                'certificate': this.state.certificationImg,
            };

            let response = await
                API._fetch(API.POST({url: '/master/certificate', formData}));

            if (response.status === 200)
                this.props.navigation.goBack();

            this
                .props
                .dispatch(showLoading(false));
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('操作失败')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <FlatList
                        style={{marginTop: 15}}
                        data={this.state.certificationImg}
                        renderItem={({item}) => <View style={{
                            backgroundColor: '#ffffff',
                            width: API.width - 30,
                            height: API.reset(148),
                            marginLeft: 15,
                            marginBottom: 15,
                        }}>
                            <Image source={{uri: item}} style={styles.bigPic}/>
                        </View>}
                    />
                    <TouchableOpacity onPress={() => {
                        this.launchCertificationPicker();
                    }}>
                        <Image source={require('../../assets/icon/bupload.png')} style={styles.promptPic}/>
                    </TouchableOpacity>
                    {this.state.certificationNum === 0 ? [] : <TouchableOpacity onPress={() => {
                        this.deleteCertification();
                    }}>
                        <View style={styles.deleteView}>
                            <Image source={require('../../assets/icon/bdelete.png')} style={styles.deletePic}/>
                        </View>
                    </TouchableOpacity>}
                </ScrollView>
                <View style={{height: 50}}>
                    <LinearGradient
                        start={{
                            x: 0,
                            y: 1
                        }}
                        end={{
                            x: 2,
                            y: 6
                        }}
                        locations={[0, 1]}
                        colors={['#881feb', '#1543de']}
                        style={styles.button}
                    >

                        <Text
                            onPress={() => this.submit()}
                            style={{
                                color: '#fff',
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                justifyContent: 'center',
                            }}>
                            确认
                        </Text>
                    </LinearGradient>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        width: API.width,
        // marginTop: 15,
    },
    button: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    promptPic: {
        width: API.width - 30,
        height: (API.width - 30) / 7,
        marginLeft: 15,
        marginBottom: 15,
        resizeMode: 'stretch'
    },
    deleteView: {
        width: API.width - 30,
        height: (API.width - 30) / 7,
        marginLeft: 15,
        marginTop: -5,
        marginBottom: 15,
        backgroundColor: '#cd371b',
        alignItems: 'center',
        justifyContent: 'center'
    },
    deletePic: {
        height: API.reset(30),
        width: API.reset(30),
        // borderWidth: 2,
        // borderColor: '#737373',
        // borderStyle: 'dashed'
    },
    bigPic: {
        width: API.width - 30,
        marginBottom: 15,
        height: API.reset(148),
    }
});

export default connect(state => state.reducer)(MyCertifications);