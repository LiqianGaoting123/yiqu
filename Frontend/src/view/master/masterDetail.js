import React, {Component} from 'react';
import {
    FlatList,
    Image, ListView, Modal,
    ScrollView,
    StyleSheet,
    Text, TouchableOpacity,
    View,
    Alert
} from 'react-native';

import LinearGradient from "react-native-linear-gradient";
import {connect} from "react-redux";
import API from "../../static/methods";
import {ImageViewer} from "react-native-image-zoom-viewer";

class MasterDetail extends Component {
    componentDidMount() {
        this.fetchDetail()
    }

    async fetchDetail() {
        // 根据id活动艺术家详情
        this.setState({
            masterId: this.props.navigation.state.params.masterId
        });
        let formData = {};
        let ds = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });
        try {
            let response = await API._fetch(API.GET({
                url: '/user/master/' + this.props.navigation.state.params.masterId,
                formData
            }));
            let response1 = await API._fetch(API.GET({
                url: '/user/profile/master/' + this.props.navigation.state.params.masterId,
                formData
            }));
            let responseJson = await response.json();
            let responseJson1 = await response1.json();

            if (response.status === 200) {
                let cer = responseJson1.certificate;

                for(let i = 0; i < cer.length; i++){
                    if(cer[i] === ''){
                        cer.splice(i, 1);
                    }
                }

                let urls = [];
                for (let i = 0; i < cer.length; i++) {
                    urls = urls.concat({url: cer[i]})
                }

                this.setState({
                    isStar: responseJson.isStar,
                    starIcon: responseJson.isStar ? require('../../assets/icon/star.png') : require('../../assets/icon/unstar.png'),
                    starPrompt: responseJson.isStar ? '已关注' : '关注',
                    // 人物信息
                    avatarUri: responseJson.avatarUrl,
                    name: responseJson.name,
                    location: responseJson.location,
                    artworkItem: responseJson.artworkItemDtos,
                    detail: responseJson.detail,
                    abstract: responseJson.abstract,
                    certificationUrl: cer,
                    // 预约相关
                    isDatable: responseJson.datable,
                    dataSource: ds.cloneWithRows(responseJson.artworkItemDtos),
                    imageViews: urls,
                    isLoaded: true
                });
            } else {
                API.toastLong('操作失败')
            }
        } catch (error) {
            API.toastLong('操作失败')
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            modalVisible: false,
            imageViews: [],

            masterId: 1,

            // 关注相关
            starIcon: require('../../assets/icon/unstar.png'),
            isStar: false,
            starPrompt: '关注',

            // 人物信息
            avatarUri: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
            name: '',
            location: '',
            certificationUrl: ['https://facebook.github.io/react-native/docs/assets/favicon.png', 'https://facebook.github.io/react-native/docs/assets/favicon.png'],
            artworkItem: [],
            detail: '',
            abstract: '',
            // 预约相关
            isDatable: true,

            // 是否加载完毕
            isLoaded: false,

            dataSource: [],
        };
        this._renderRow = this._renderRow.bind(this);
        this.showDetail = this.showDetail.bind(this);
        this.starMaster = this.starMaster.bind(this);
        this.render = this.render.bind(this);
        this.fetchDetail = this.fetchDetail.bind(this);
    }

    _renderRow(rowData) {
        return (
            <TouchableOpacity style={loadMoreStyles.cellStyle} onPress={() => this.showDetail(rowData.id)}>
                <Image style={loadMoreStyles.artworkPic} source={{uri: rowData.coverUrl}}/>
                <Text style={loadMoreStyles.artworkName}>{rowData.name}</Text>
            </TouchableOpacity>
        );
    }

    showDetail(id) {
        this.props.navigation.navigate('ArtworkDetail', {id: id})
    }

    async starMaster() {
        let formData = {};
        try {
            let response = this.state.isStar ? await API._fetch(API.POST({
                url: '/user/star/' + this.props.navigation.state.params.masterId,
                formData
            })) : await API._fetch(API.GET({
                url: '/user/star/' + this.props.navigation.state.params.masterId,
                formData
            }));

            if (response.status === 200) {
                // this.setState({
                //     isStar: !this.state.isStar
                // });
            } else {
                API.toastLong('操作失败');
            }
        } catch (error) {
            API.toastLong('操作失败');
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isLoaded ? [<ScrollView style={{flex: 1, marginBottom: API.reset(50)}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <Image style={styles.avatar} source={{uri: this.state.avatarUri}}/>
                        <View style={styles.titleRight}>
                            <Text style={styles.name}>{this.state.name}</Text>
                            <Text style={styles.titleContent}>{this.state.location}</Text>
                        </View>
                    </View>

                    <View style={{margin: API.reset(10)}}>
                        <Text style={styles.small_title}>
                            代表作品
                        </Text>
                    </View>
                    <ListView
                        ref={(listView) => {
                            this._listView = listView
                        }}
                        style={styles.container}
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        enableEmptySections={true}
                        onEndReachedThreshold={-1}
                    />
                    {/*<LoadMore type='typical_artwork' dataArray={this.state.artworkItem}/>*/}

                    {/*<View style={{margin: 10}}>*/}
                    {/*<Text style={styles.small_title}>*/}
                    {/*作品分类*/}
                    {/*</Text>*/}
                    {/*</View>*/}
                    {/*<LoadMore type='artwork_classification'/>*/}

                    <View style={styles.cardContainer}>
                        <View style={{
                            flexDirection: 'column',
                            flex: 0.2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.cardTitle}>
                                职
                            </Text>
                            <Text style={styles.cardTitle}>
                                称
                            </Text>
                            <Text style={styles.cardTitle}>
                                证
                            </Text>
                            <Text style={styles.cardTitle}>
                                书
                            </Text>
                        </View>
                        <FlatList
                            style={{
                                flex: 0.8,
                                margin: API.reset(5)
                            }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.certificationUrl}
                            renderItem={({item, index}) =>
                                <TouchableOpacity onPress={() => {
                                    this.setState({
                                        index: index,
                                        modalVisible: true
                                    });
                                }}><Image
                                    style={{
                                        height: API.reset(200),
                                        width: API.reset(254),
                                        marginHorizontal: API.reset(8)
                                    }}
                                    source={{uri: item}}
                                />
                                </TouchableOpacity>}
                        />
                    </View>

                    <View style={styles.cardContainer}>
                        <View style={{
                            flexDirection: 'column',
                            flex: 0.2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.cardTitle}>
                                简
                            </Text>
                            <Text style={styles.cardTitle}>
                                介
                            </Text>
                        </View>
                        <Text style={styles.cardContent}>
                            {this.state.abstract}
                        </Text>
                    </View>

                    <View style={styles.cardContainer}>
                        <View style={{
                            flexDirection: 'column',
                            flex: 0.2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Text style={styles.cardTitle}>
                                详
                            </Text>
                            <Text style={styles.cardTitle}>
                                细
                            </Text>
                            <Text style={styles.cardTitle}>
                                信
                            </Text>
                            <Text style={styles.cardTitle}>
                                息
                            </Text>
                        </View>
                        <Text style={styles.cardContent}>
                            {this.state.detail}
                        </Text>
                    </View>
                </ScrollView>,

                    <View style={{height: 50, flexDirection: 'row', position: 'absolute', bottom: 0}}>
                        <TouchableOpacity
                            style={styles.button1}
                            onPress={() => {
                                let state = !this.state.isStar;
                                this.setState({
                                    isStar: state,
                                    starIcon: state ? require('../../assets/icon/star.png') : require('../../assets/icon/unstar.png'),
                                    starPrompt: state ? '已关注' : '关注',
                                });
                                // TODO 发送关注请求
                                this.starMaster();
                            }}
                        >
                            <Image source={this.state.starIcon}
                                   style={{
                                       width: API.reset(23),
                                       height: API.reset(23),
                                       marginLeft: API.reset(32),
                                       marginBottom: API.reset(3)
                                   }}/>
                            <Text style={{
                                fontSize: 12,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                justifyContent: 'center',
                                color: this.state.isStar ? '#ff3b19' : '#737373',
                            }}>{this.state.starPrompt}</Text>
                        </TouchableOpacity>

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
                            colors={['#1543de', '#881feb']}
                            style={styles.button2}>
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={() => this.state.isDatable ? this.props.navigation.navigate('MakeAppointment', {
                                    masterId: this.state.masterId,
                                }) : Alert.alert('预约失败','对不起，该艺术家尚未开通预约功能')}
                            >预约</Text>
                        </LinearGradient>
                    </View>] : <View/>}
                <Modal
                    visible={this.state.modalVisible}
                    transparent={true}
                    enableImageZoom={true}
                    onRequestClose={() => this.setState({modalVisible: false})}>
                    <ImageViewer
                        enableImageZoom={true}
                        onClick={() => {
                            this.setState({modalVisible: false})
                        }}
                        imageUrls={this.state.imageViews}
                        index={this.state.index}/>
                </Modal>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f1f1',
        width: API.width,
        // height: 700,
        // backgroundImage: "url(" + require('../../../src/images/background.jpg') + ")"
    },
    background: {
        width: API.width,
        height: API.height,
    },
    avatar: {
        width: API.reset(150),
        height: API.reset(150),
        margin: API.reset(15),
        borderRadius: 5
    },
    titleRight: {
        flex: 1,
    },
    name: {
        textAlign: 'right',
        fontSize: 24,
        margin: API.reset(15),
        fontWeight: 'bold',
        color: '#000000'
    },
    titleContent: {
        textAlign: 'right',
        fontSize: 15,
        marginRight: API.reset(20),
        color: '#000'
    },
    artwork_pic: {
        width: API.reset(90),
        height: API.reset(90),
        margin: API.reset(10),
        borderRadius: 5
    },
    small_title: {
        flex: 0.2,
        margin: API.reset(10),
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    artwork_name: {
        textAlign: 'center',
        marginTop: API.reset(-3),
        fontSize: 12,
        color: '#000'
    },
    button1: {
        width: API.reset(100),
        padding: API.reset(5),
        borderTopWidth: 1,
        borderTopColor: '#c3c3c3',
        backgroundColor: '#f7f7f7'
    },
    button2: {
        width: API.width * 0.8,
        justifyContent: 'center',
        padding: API.reset(10)
    },
    text: {
        color: '#000',
        fontSize: 30,
        fontWeight: 'bold',
    },
    cardContainer: {
        padding: API.reset(2),
        margin: API.reset(15),
        borderRadius: 5,
        // borderColor: '#000',
        // borderWidth: 2,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.8)'
    },
    cardTitle: {
        margin: API.reset(10),
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        justifyContent: 'center',
    },
    cardContent: {
        flex: 0.8,
        color: '#000',
        fontSize: 12,
        margin: API.reset(15),
        letterSpacing: 1.2,
        lineHeight: API.reset(17)
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: API.reset(40),
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    navName: {
        flex: 1,
        color: '#212121',
        textAlign: 'center',
        fontSize: 15,
        padding: API.reset(10)
    }
});

const loadMoreStyles = StyleSheet.create({
    cellStyle: {
        flex: 1,
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 5,
    },
    artworkPic: {
        width: 90,
        height: 90,
        borderRadius: 5
    },
    artworkName: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: 12,
        color: '#000'
    },
});

export default connect(state => state.reducer)(MasterDetail);