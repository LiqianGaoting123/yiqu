import React, {Component} from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity, SectionList, FlatList, DeviceEventEmitter
} from 'react-native'
import {connect} from "react-redux";
import API from "../../static/methods";
import {showLoading} from "../../redux/actions";

let width = API.width;
let height = API.height;

class MasterCategory extends Component {
    constructor(props) {
        super(props);
        this._flatList = null;
        this._sectionList = null;
        this.state = {
            selectedRootCate: 0,
            CateData: [{
                mainType: '我是1',
                secondTypeItems: [{id: 1, value: '木雕'}, {id: 2, value: '竹雕'}]
            }],
            sectionContent: [
                {
                    key: '木雕',
                    data: [{
                        name: '张三',
                        avatarUrl: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                        id: '13700000001'
                    }]
                },
                {
                    key: '竹雕',
                    data: [{
                        name: '张三',
                        avatarUrl: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                        id: '13700000001'
                    }]
                }],
            isLoading: true

        }

    };

    componentDidMount() {
        this
            .props
            .dispatch(showLoading(true));
        // 网络请求
        this.fetchCategory();

        // 添加监听者
        this.listener = DeviceEventEmitter.addListener('searchMaster', (text) => {
            this.props.navigation.navigate('MasterList', {searchContent: text});
        });

        this
            .props
            .dispatch(showLoading(false));
    }

    async fetchCategory() {
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/user/type', formData}));
            // console.log(response);
            let responseJson = await response.json();
            if (response.status === 200) {
                await this.setState({CateData: responseJson.typeItemDtos});
                await this.fetchMastersBySecondType();
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    async fetchMastersBySecondType() {
        let newSectionData = [];
        for (let i = 0; i < this.state.CateData[this.state.selectedRootCate].secondTypeItems.length; i++) {
            let formData = {
                firstTypeId: this.state.CateData[this.state.selectedRootCate].mainType,
                secondTypeId: this.state.CateData[this.state.selectedRootCate].secondTypeItems[i].id,
            };
            try {
                let response = await API._fetch(API.GET({url: '/user/master', formData}));
                let responseJson = await response.json();
                if (response.status === 200) {
                    newSectionData.push({
                        key: this.state.CateData[this.state.selectedRootCate].secondTypeItems[i].value,
                        data: responseJson.masterItemDtos
                    })
                } else {
                    API.toastLong('操作失败');
                    return
                }
            } catch (error) {
                API.toastLong('操作失败');
                return
            }
        }

        this.setState({
            sectionContent: newSectionData,
        }, () => {
            this.setState({isLoading: false})
        });
    }

    // 每个大类里面的内容,主要是颜色变化
    _renderItem = item => {
        let index = item.index;

        // let index = item.item.key;
        let title = item.item.title;
        return (
            <TouchableOpacity
                key={index}
                style={[{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 44
                }, this.state.selectedRootCate === index ? {
                    backgroundColor: '#F5F5F5',
                    borderLeftWidth: 3,
                    borderLeftColor: '#1543de'
                } : {backgroundColor: 'white'}]}
                onPress={async () => {
                    this
                        .props
                        .dispatch(showLoading(true));

                    // 修改selectedRootCate这个state
                    this.setState({selectedRootCate: index}, () => this.fetchMastersBySecondType());

                    setTimeout(() => {
                        (this.state.CateData.length - index) * 45 > height - 65 ? this._flatList.scrollToOffset({
                            animated: true,
                            offset: index * 45
                        }) : null;
                        this._sectionList.scrollToLocation({
                            itemIndex: 0,
                            sectionIndex: 0,
                            animated: true,
                            viewOffset: 30
                        })
                    }, 100);

                    this
                        .props
                        .dispatch(showLoading(false));
                }}
            >
                <Text
                    style={{
                        fontSize: 17,
                        color: this.state.selectedRootCate === index ? '#1543de' : '#333',
                        paddingTop: 10
                    }}>{title}</Text>
            </TouchableOpacity>
        )
    };

    // 左边分类
    renderRootCate() {
        let data = [];
        // 大类
        this.state.CateData.map((item, index) => {
            data.push({key: index, title: item.mainType})
        });
        return (
            <View style={{backgroundColor: '#F5F5F5', marginTop: 4,}}>
                <FlatList
                    ref={flatList => this._flatList = flatList}
                    data={data}
                    ListHeaderComponent={() => (<View/>)}
                    ListFooterComponent={() => (<View/>)}
                    ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: '#F5F5F5'}}/>}
                    renderItem={this._renderItem}
                    onEndReachedThreshold={20}
                    showsVerticalScrollIndicator={false}
                >
                </FlatList>
            </View>
        )
    }

    // 右边标题
    sectionComp(item) {
        return (
            <View style={{backgroundColor: '#F5F5F5', justifyContent: 'center',}}>
                <Text
                    style={{color: 'black', marginBottom: 10, fontSize: 15, marginTop: 10,}}>{item.section.key}</Text>
            </View>
        )
    }

    // 右边每个小图
    renderCell(item, index) {
        return (
            <TouchableOpacity
                key={index}
                style={{
                    height: (width - 140) / 3 + 40,
                    width: (width - 140) / 3,
                    backgroundColor: 'white',
                    marginBottom: 8,
                    marginRight: 10,
                    alignItems: 'center'
                }}
                onPress={() => {
                    this.props.navigation.navigate('MasterDetail', {masterId: item.phoneNumber});
                }}
                // onPress={() => alert(`点击了第${sectionIndex}组中的第${index}个商品`)}
            >
                <Image style={{width: (width - 140) / 3, height: (width - 140) / 3, marginVertical: 10}}
                       source={{uri: item.avatarUrl}}/>
                <Text style={{color: '#333', fontSize: 13}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }

    renderItem(item) {
        let data = item.section.data;
        return item.index === 0 ?
            <View key={item.index} style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {data.map((cell, index) => this.renderCell(cell, index))}
            </View> : null
    }

    renderItemCate() {
        return (
            <View style={{flex: 1, backgroundColor: '#F5F5F5', marginLeft: 10, marginTop: 8}}>
                <SectionList
                    ref={(ref) => this._sectionList = ref}
                    renderSectionHeader={this.sectionComp}
                    renderItem={(data) => this.renderItem(data)}
                    sections={this.state.sectionContent}
                    ItemSeparatorComponent={() => <View/>}
                    ListHeaderComponent={() => <View/>}
                    ListFooterComponent={() => <View/>}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => 'key' + index + item}
                />
            </View>
        )
    }

    render() {
        return (
            <View style={{flexDirection: 'row', flex: 1, backgroundColor: '#F5F5F5'}}>
                {this.state.isLoading ? <View/> : [this.renderRootCate(), this.renderItemCate()]}
            </View>
        );
    }
}


export default connect(state => state.reducer)(MasterCategory)