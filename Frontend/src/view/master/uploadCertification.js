import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Alert
} from "react-native";
import React, {Component} from "react";
import LinearGradient from "react-native-linear-gradient";
import API from "../../static/methods";
import {connect} from "react-redux";
import {showLoading} from "../../redux/actions";
import Picker from "react-native-picker/index";
import DatePicker from "react-native-datepicker";

import area from './area.json';
import ReactNative from "react-native";


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

class UploadCertification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            certificationImg: [], // 图片的url
            certificationNum: 0,

            avatar:
                <TouchableOpacity onPress={() => {
                    this.launchAvatarPicker();
                }}>
                    <Image source={require('../../assets/icon/bupload.png')} style={styles.promptPic}/>
                </TouchableOpacity>,
            avatarUrl: '',

            abstract: '',
            detail: '',
            city: '江苏 南京 鼓楼区',
            firstDomain: '',
            secondDomain: '',
            index: [0, 0],
            expertiseArea: '',

            artworks: [], // 界面！！！
            artworkList: [], // 作品集合
            // artworkDescriptions: [], // 作品的文字集合
            artworkUrl: '', // 图片的url
            description: 'first',
            artworkNum: 0,

            history: [],
            historyRecord: [],
            historyNum: 0,
            historyItem: [],//保存的编号集合

            category: [
                {
                    A1: [1, 2, 3, 4]
                },
                {
                    A2: [5, 6, 7, 8]
                },
                {
                    A3: [9, 10, 11, 12]
                }
            ],
            categoryList: []
        };
    }

    componentDidMount() {
        this.fetchCategory();
    };

    changeList(list) {
        let category = [];
        for (let i = 0; i < list.length; i++) {
            let secondList = [];
            for (let j = 0; j < list[i].secondTypeItems.length; j++) {
                secondList.push(list[i].secondTypeItems[j].value);
            }
            let type1 = list[i].mainType;
            let tempJson = {};
            tempJson[type1] = secondList;
            category.push(tempJson);
            // category[i][type1] = secondList;
        }

        this.setState({
            category: category,
            firstDomain: list[0].mainType,
            secondDomain: list[0].secondTypeItems[0].value,
        });
    }

    async fetchCategory() {
        let formData = {};

        try {
            let response = await API._fetch(API.GET({url: '/user/type', formData}));
            let responseJson = await response.json();
            if (response.status === 200) {
                this.setState({categoryList: responseJson.typeItemDtos});
                this.changeList(responseJson.typeItemDtos);
            } else {
                API.toastLong(responseJson.info)
            }
        } catch (error) {
            API.toastLong('上传失败')
        }
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
                console.log('User cancelled image picker');
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
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

    async uploadAvatarImage(file) {
        try {
            let response = await API._fetch(API.upload(file));

            let responseJson = await response.json();

            this
                .props
                .dispatch(showLoading(false));

            if (response.status === 200) {
                this.setState({
                    avatar:
                        <TouchableOpacity onPress={() => {
                            this.launchAvatarPicker();
                        }}><Image source={{uri: responseJson.url}} style={{
                            backgroundColor: '#ffffff',
                            width: API.width - 30,
                            height: API.reset(148),
                            marginLeft: 15,
                            marginBottom: 15
                        }}/>
                        </TouchableOpacity>,
                    // certificationImg: url,
                });
                this.setState({
                    avatarUrl: responseJson.url,
                });
            }
            else
                API.toastLong('操作失败');
        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('网络连接失败')
        }
    }

    async launchAvatarPicker() {
        this
            .props
            .dispatch(showLoading(true));

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else {
                let file = {uri: response.uri, type: 'multipart/form-data', name: response.fileName};
                this.uploadAvatarImage(file);


            }
        });
    }

    async uploadArtworkImage(file) {
        try {
            let response = await API._fetch(API.upload(file));

            let responseJson = await response.json();

            let tempIndex = this.state.artworkNum;
            if (response.status === 200) {
                this.setState({
                    artworkList: this.state.artworkList.concat({
                        'description': '',
                        'url': responseJson.url,
                        'abstract': ''
                    }),
                    artworks: this.state.artworks.concat(
                        <View style={{
                            flexDirection: 'row',
                            backgroundColor: '#ffffff',
                            width: API.width - 30,
                            height: API.width * 0.35,
                            marginLeft: 15,
                            marginBottom: 15,
                        }}>
                            <Image source={{uri: responseJson.url}} style={{
                                height: API.width * 0.35,
                                width: API.width * 0.35,
                                marginRight: 15,
                                // marginTop: 15,
                            }}/>
                            <TextInput
                                style={{
                                    width: '55%',
                                    height: API.width * 0.40,
                                    fontSize: 14,
                                    color: '#000000',
                                    marginRight: 15,
                                    // marginTop: 15,
                                }}
                                placeholder='请输入艺术品简介（不得少于20字）'
                                placeholderTextColor='#858585'
                                //keyboardType='email-address'
                                onChangeText={(text) => {
                                    let record = [];
                                    record = record.concat(this.state.artworkList);
                                    record[tempIndex].description = text;
                                    record[tempIndex].abstract = text;
                                    this.setState({artworkList: record});
                                    // this.setState({description: text})
                                }}
                                underlineColorAndroid="transparent"
                                padding={0}
                                multiline={true}
                            />
                        </View>),
                    artworkNum: this.state.artworkNum + 1,
                })
            }
        }
        catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('网络连接失败')
        }

        this
            .props
            .dispatch(showLoading(false));
    }

    deleteArtwork() {
        // 删除该条记录(包括界面和数据)
        let newArtworkList = [];
        newArtworkList = newArtworkList.concat(this.state.artworkList);
        newArtworkList.splice(this.state.artworkNum - 1, 1);
        let newArtworks = [];
        newArtworks = newArtworks.concat(this.state.artworks);
        newArtworks.splice(this.state.artworkNum - 1, 1);

        this.setState({
            artworks: newArtworks,
            artworkList: newArtworkList,
            artworkNum: this.state.artworkNum - 1,
        });
    }

    launchArtworkPicker() {
        // if (this.state.description === '')
        //     alert('对不起，上一个艺术品详情尚未填写');
        // else {
        //     if (this.state.description !== 'first') {
        //         // 保存上一个信息
        //         this.setState({
        //             artworkList: this.state.artworkList.concat({
        //                 'description': this.state.description,
        //                 'url': this.state.artworkUrl,
        //                 'abstract': this.state.description
        //             }),
        //         })
        //     }
        //
        //     this.setState({
        //         description: '',
        //     });
        this
            .props
            .dispatch(showLoading(true));

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
                this
                    .props
                    .dispatch(showLoading(false));
            }
            else {
                let file = {uri: response.uri, type: 'multipart/form-data', name: response.fileName};
                this.uploadArtworkImage(file);
            }
        });
        // }
    }

    deleteHistory() {
        // 然后删除该条记录(包括界面和数据)
        // 删除historyItem中的记录
        let newHistory = [];
        newHistory = newHistory.concat(this.state.history);
        newHistory.splice(this.state.historyNum - 1, 1);
        let newRecord = [];
        newRecord = newRecord.concat(this.state.historyRecord);
        newRecord.splice(this.state.historyNum - 1, 1);
        let newHistoryItem = [];
        newHistoryItem = newHistoryItem.concat(this.state.historyItem);
        newHistoryItem.splice(this.state.historyNum - 1, 1);

        this.setState({
            history: newHistory,
            historyRecord: newRecord,
            historyNum: this.state.historyNum - 1,
            historyItem: newHistoryItem
        });
    }

    getIndex(num) {
        let tempIndex = -1;
        for (let i = 0; i < this.state.historyItem.length; i++) {
            if (this.state.historyItem[i] === num)
                return i;
        }
        return tempIndex;
    }

    addHistory() {
        // let tempIndex = this.state.historyItem.length === 0 ? 0 : this.state.historyItem[this.state.historyItem.length - 1] + 1;

        let newRecord = [];
        newRecord = newRecord.concat(this.state.historyRecord);
        newRecord = newRecord.concat({
            'artworkName': '',
            'time': '2018-01-01',
            'location': '',
            'price': '',
            'key': this.state.historyNum
        });
        this.setState({
            historyRecord: newRecord,
            // historyItem: this.state.historyItem.length === 0 ? [0] : this.state.historyItem.concat(tempIndex),
            historyNum: this.state.historyNum + 1,
        })
    }

    isDateValid() {
        let historyRecord = this.state.historyRecord;
        for (let i = 0; i < historyRecord.length; i++) {
            if (!/(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/.test(historyRecord[i].time))
                return false
        }
        return true
    }

    historyHasNull() {
        let historyRecord = this.state.historyRecord;
        for (let i = 0; i < historyRecord.length; i++) {
            if (historyRecord[i].artworkName === '' || historyRecord[i].location === '' || historyRecord[i].time === '' || historyRecord[i].price === '')
                return true
        }
        return false
    }

    isDetailValid() {
        let artworkList = this.state.artworkList;
        for (let i = 0; i < artworkList.length; i++) {
            if (artworkList[i].description.length < 20)
                return false
        }
        return true
    }

    artworkListHasNull() {
        let artworkList = this.state.artworkList;
        for (let i = 0; i < artworkList.length; i++) {
            if (artworkList[i].description === '')
                return true
        }
        return false
    }

    _createAreaData() {
        let data = [];
        let len = area.length;
        for (let i = 0; i < len; i++) {
            let city = [];
            for (let j = 0, cityLen = area[i]['city'].length; j < cityLen; j++) {
                let _city = {};
                _city[area[i]['city'][j]['name']] = area[i]['city'][j]['area'];
                city.push(_city);
            }

            let _data = {};
            _data[area[i]['name']] = city;
            data.push(_data);
        }
        return data;
    }

    areaPicker() {
        Picker.init({
            pickerConfirmBtnText: '确认',
            pickerCancelBtnText: '取消',
            pickerTitleText: '选择所在区域',
            pickerData: this._createAreaData(),
            selectedValue: ['江苏', '南京', '玄武区'],
            onPickerConfirm: pickedValue => {
                this.setState({city: pickedValue[0] + ' ' + pickedValue[1] + ' ' + pickedValue[2]});
            },
            onPickerCancel: pickedValue => {
                console.log('cancel')
            },
            onPickerSelect: pickedValue => {
                this.setState({city: pickedValue[0] + ' ' + pickedValue[1] + ' ' + pickedValue[2]});
            }
        });
        Picker.show();
    }

    async submit() {
        let artworkList = this.state.artworkList;

        // 证书
        if (this.state.avatarUrl === '') {
            Alert.alert('信息不完整', '请添加头像');
            return
        }

        // 证书
        if (this.state.certificationNum === 0) {
            Alert.alert('信息不完整', '请添加职称证书');
            return
        }

        // 代表作品
        if (this.state.artworkNum === 0) {
            Alert.alert('信息不完整', '请上传代表作品');
            return
        }
        else if (this.artworkListHasNull()) {
            Alert.alert('信息不完整', '对不起，艺术品详情尚未填写完整');
            return
        }
        else if (!this.isDetailValid()) {
            Alert.alert('信息不完整', '对不起，艺术品详情描述请多于20字');
            return
        }

        // 简介
        if (this.state.abstract === '') {
            Alert.alert('信息不完整', '请填写个人简介');
            return
        }

        // 详细介绍
        if (this.state.detail === '') {
            Alert.alert('信息不完整', '请填写详细介绍');
            return
        }

        // 擅长领域
        if (this.state.detail === '') {
            Alert.alert('信息不完整', '请填写擅长领域');
            return
        }

        // 城市
        if (this.state.city === '') {
            Alert.alert('信息不完整', '请选择所在城市');
            return
        }

        // 拍卖纪录
        if (this.historyHasNull()) {
            Alert.alert('信息不完整', '对不起，拍卖纪录尚未填写完整');
            return
        }
        else if (!this.isDateValid()) {
            Alert.alert('格式错误', '对不起，拍卖纪录日期请以 2018-01-01 的格式给出');
            return
        }

        try {
            this
                .props
                .dispatch(showLoading(true));

            let formData = {
                'certificate': this.state.certificationImg,
                'representativeWorkDtos': artworkList,
                'mainType': this.state.firstDomain,
                'secondTypeId': this.state.categoryList[this.state.index[0]].secondTypeItems[this.state.index[1]].id,
                'expertiseArea': this.state.expertiseArea,

                'abstract': this.state.abstract,
                'description': this.state.detail,
                'city': this.state.city,

                'auctionRecordDtos': this.state.historyRecord,
            };

            console.log(formData);

            let response = await
                API._fetch(API.PUT({url: '/user/profile', formData}));

            console.log(response);

            formData = {'avatarUrl': this.state.avatarUrl};
            let response1 = await
                API._fetch(API.POST({url: '/profile/avatar', formData}));

            console.log(response);
            this
                .props
                .dispatch(showLoading(false));
            if (response.status === 200 && response1.status === 200) {
                // API.toastLong(responseJson.info);
                this
                    .props
                    .navigation
                    .goBack();
            } else {
                API.toastLong('您已认证过，不要重复进行信息认证');
            }

        } catch (error) {
            this
                .props
                .dispatch(showLoading(false));
            API.toastLong('操作失败')
        }
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
            <View style={styles.container}>

                <ScrollView style={styles.container} ref="scrollView">
                    <Text style={styles.title}>头像</Text>
                    {this.state.avatar}

                    <Text style={styles.title}>职称证书</Text>
                    <FlatList
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

                    <Text style={styles.title}>代表作品</Text>
                    {this.state.artworks}
                    <TouchableOpacity onPress={() => {
                        this.launchArtworkPicker();
                    }}>
                        <Image source={require('../../assets/icon/bupload.png')} style={styles.promptPic}/>
                    </TouchableOpacity>
                    {this.state.artworkNum === 0 ? [] : <TouchableOpacity onPress={() => {
                        this.deleteArtwork();
                    }}>
                        <View style={styles.deleteView}>
                            <Image source={require('../../assets/icon/bdelete.png')} style={styles.deletePic}/>
                        </View>
                    </TouchableOpacity>}

                    <Text style={styles.title}>拍卖记录（选填）</Text>
                    <FlatList
                        data={this.state.historyRecord}
                        renderItem={({item, index}) => <View style={{
                            backgroundColor: '#ffffff',
                            width: API.width - 30,
                            height: 148,
                            marginLeft: 15,
                            marginBottom: 15,
                        }}>
                            {/*<TouchableOpacity onPress={() => {*/}
                            {/*console.log(this.state.historyItem);*/}
                            {/*this.deleteHistory(tempIndex);*/}
                            {/*}}>*/}
                            {/*<Image source={require('../../assets/icon/delete.png')}*/}
                            {/*style={{width: 18, height: 18, marginTop: -5, marginLeft: -5}}/>*/}
                            {/*</TouchableOpacity>*/}
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../../assets/icon/artwork.png')}
                                       style={styles.historyIcon}/>
                                <Text style={styles.historyTitle}>名称</Text>
                                <TextInput
                                    style={styles.historyContent}
                                    placeholder='请输入艺术品名称'
                                    placeholderTextColor='#858585'
                                    //keyboardType='email-address'
                                    onChangeText={(text) => {
                                        let record = this.state.historyRecord;
                                        record[index].artworkName = text;
                                        this.setState({historyRecord: record})
                                    }}
                                    underlineColorAndroid="transparent"
                                    padding={0}
                                />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../../assets/icon/time.png')}
                                       style={styles.historyIcon}/>
                                <Text style={styles.historyTitle}>拍卖时间</Text>
                                <DatePicker style={{
                                    flex: 1,
                                    marginRight: 15,
                                    height: 30,
                                    marginTop: 3,
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    alignContent: 'flex-end'
                                }}
                                    // hideText={true}
                                            locale={'zh-cn'}
                                            date={item.time}
                                            mode="date"
                                            format="YYYY-MM-DD"
                                            confirmBtnText="确定"
                                            cancelBtnText="取消"
                                            showIcon={false}
                                            customStyles={{
                                                dateInput: {
                                                    width: API.width * 0.5,
                                                    fontSize: 14,
                                                    color: '#191919',
                                                    // marginLeft: API.reset(100),
                                                    marginTop: 3,
                                                    marginBottom: -5,
                                                    borderWidth: 0,
                                                    alignSelf: 'flex-end',
                                                    // justifyContent: 'flex-end'
                                                    textAlign: 'right',
                                                    alignItems: 'flex-end',
                                                    alignContent: 'flex-end'
                                                }
                                            }}
                                            onDateChange={(datetime) => {
                                                let record = [];
                                                record = record.concat(this.state.historyRecord);
                                                record[index].time = datetime;

                                                this.setState({historyRecord: record});
                                            }}/>
                                {/*<Text style={{*/}
                                {/*flex: 1,*/}
                                {/*fontSize: 14,*/}
                                {/*color: '#191919',*/}
                                {/*marginRight: 15,*/}
                                {/*marginTop: 3,*/}
                                {/*textAlign: 'right',*/}
                                {/*borderWidth: 0*/}
                                {/*}}>*/}
                                {/*{item.time}*/}
                                {/*</Text>*/}
                                {/*<TextInput*/}
                                {/*style={styles.historyContent}*/}
                                {/*placeholder='请输入拍卖时间'*/}
                                {/*placeholderTextColor='#858585'*/}
                                {/*//keyboardType='email-address'*/}
                                {/*onChangeText={(text) => {*/}
                                {/*let record = this.state.historyRecord;*/}
                                {/*record[this.getIndex(tempIndex)].time = text;*/}
                                {/*this.setState({historyRecord: record})*/}
                                {/*}}*/}
                                {/*underlineColorAndroid="transparent"*/}
                                {/*padding={0}*/}
                                {/*/>*/}
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../../assets/icon/place.png')}
                                       style={styles.historyIcon}/>
                                <Text style={styles.historyTitle}>拍卖地点</Text>
                                <TextInput
                                    style={styles.historyContent}
                                    placeholder='请输入拍卖地点'
                                    placeholderTextColor='#858585'
                                    //keyboardType='email-address'
                                    onChangeText={(text) => {
                                        let record = this.state.historyRecord;
                                        record[index].location = text;
                                        this.setState({historyRecord: record})
                                    }}
                                    underlineColorAndroid="transparent"
                                    padding={0}
                                />
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../../assets/icon/price.png')}
                                       style={styles.historyIcon}/>
                                <Text style={styles.historyTitle}>拍卖价格</Text>
                                <TextInput
                                    style={styles.historyContent}
                                    placeholder='请输入拍卖价格'
                                    placeholderTextColor='#858585'
                                    keyboardType={'phone-pad'}
                                    onChangeText={(text) => {
                                        let record = this.state.historyRecord;
                                        record[index].price = text;
                                        this.setState({historyRecord: record})
                                    }}
                                    underlineColorAndroid="transparent"
                                    padding={0}
                                />
                            </View>
                        </View>}
                    />
                    <TouchableOpacity onPress={() => {
                        this.addHistory();
                    }}>
                        <Image source={require('../../assets/icon/bupload.png')} style={styles.promptPic}/>
                    </TouchableOpacity>
                    {this.state.historyNum === 0 ? [] : <TouchableOpacity onPress={() => {
                        this.deleteHistory();
                        // console.log(this.state.historyRecord);
                    }}>
                        <View style={styles.deleteView}>
                            <Image source={require('../../assets/icon/bdelete.png')} style={styles.deletePic}/>
                        </View>
                    </TouchableOpacity>}

                    <Text style={styles.title}>个人简介</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='请输入个人简介'
                        placeholderTextColor='#858585'
                        //keyboardType='email-address'
                        ref="abstract"
                        // onBlur={this._reset.bind(this)}
                        onFocus={this._onFocus.bind(this, 'abstract')}
                        onChangeText={(text) => this.setState({abstract: text})}
                        underlineColorAndroid="transparent"
                        padding={0}
                    />
                    <Text style={styles.title}>详细介绍</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='请输入个人详细介绍(不得少于20字)'
                        placeholderTextColor='#858585'
                        ref="detail"
                        // onBlur={this._reset.bind(this)}
                        onFocus={this._onFocus.bind(this, 'detail')}
                        //keyboardType='email-address'
                        onChangeText={(text) => this.setState({detail: text})}
                        underlineColorAndroid="transparent"
                        padding={0}
                    />
                    <Text style={styles.title}>擅长领域</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder='请输入个人擅长领域'
                        placeholderTextColor='#858585'
                        ref="input"
                        // onBlur={this._reset.bind(this)}
                        onFocus={this._onFocus.bind(this, 'input')}
                        //keyboardType='email-address'
                        onChangeText={(text) => this.setState({expertiseArea: text})}
                        underlineColorAndroid="transparent"
                        padding={0}
                    />
                    <Text style={styles.title}>分类</Text>
                    <TouchableOpacity onPress={() => {
                        Picker.init({
                            pickerConfirmBtnText: '确认',
                            pickerCancelBtnText: '取消',
                            pickerTitleText: '选择擅长领域',
                            pickerData: this.state.category,
                            selectedValue: [this.state.firstDomain, this.state.secondDomain],
                            onPickerConfirm: (data, index) => {
                                this.setState({
                                    firstDomain: data[0],
                                    secondDomain: data[1],
                                    index: index,
                                });
                            },
                            onPickerCancel: data => {
                                API.toastLong('操作取消');
                            },
                            onPickerSelect: (data, index) => {
                                this.setState({
                                    firstDomain: data[0],
                                    secondDomain: data[1],
                                    index: index,
                                });
                            },
                        });

                        Picker.show();
                    }}>
                        <Text style={{
                            fontSize: 14,
                            margin: 14, color: '#000000'
                        }}>{this.state.firstDomain} {this.state.secondDomain}</Text>
                    </TouchableOpacity>

                    <Text style={styles.title}>所在地区</Text>
                    <Text style={{
                        width: API.width,
                        height: 40,
                        fontSize: 14,
                        color: '#000000',
                        marginLeft: 15,
                        marginRight: 15,
                        marginTop: 17
                    }} onPress={() => this.areaPicker()}>{this.state.city}</Text>
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
    },
    picture: {
        width: API / 3 - 20,
        margin: 15,
    },
    title: {
        fontSize: 20,
        margin: 15,
    },
    historyTitle: {
        fontSize: 14,
        margin: 5,
        marginLeft: 0,
        marginTop: 12,
        color: '#4b4b4b'
    },
    historyContent: {
        flex: 1,
        fontSize: 14,
        color: '#191919',
        marginRight: 15,
        marginTop: 3,
        textAlign: 'right',
        borderWidth: 0,
    },
    historyIcon: {
        width: 25,
        height: 25,
        marginLeft: 12,
        marginTop: 6,
        marginBottom: 4,
        marginRight: 12
    },
    button: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    input: {
        width: API.width,
        height: 49,
        fontSize: 14,
        color: '#000000',
        marginLeft: 15,
        marginRight: 15,
    },
    textInput: {
        width: API.width - 30,
        height: 30,
        fontSize: 14,
        color: '#000000',
        marginLeft: 15,
        marginRight: 15,
    },
    promptPic: {
        width: API.width - 30,
        height: (API.width - 30) / 7,
        marginLeft: 15,
        marginBottom: 15,
        resizeMode: 'stretch'
// borderWidth: 2,
        // borderColor: '#737373',
        // borderStyle: 'dashed'
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

export default connect(state => state.reducer)(UploadCertification);