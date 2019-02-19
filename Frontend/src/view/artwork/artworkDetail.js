import React, {Component} from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    WebView, TouchableOpacity, Modal
} from 'react-native';

import Swiper from 'react-native-swiper';
import LinearGradient from "react-native-linear-gradient";
import {connect} from "react-redux";
import API from "../../static/methods";
import {ImageViewer} from "react-native-image-zoom-viewer";

class ArtworkDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStar: false,
            title: '',
            money: 0,
            description: ``,
            swiperImageUri: [],
            swiperImage: [],
            isLoaded: false,
            modalVisible: false,
            imageViews: [],
        };
    }

    componentDidMount() {
        this.fetchDetail()
    }

    async fetchDetail() {
        let id = this.props.navigation.state.params.id;
        let formData = {};
        try {
            let response = await API._fetch(API.GET({url: '/user/artwork/' + id, formData}));

            let responseJson = await response.json();
            if (response.status === 200) {
                let urls = [];
                for (let i = 0; i < responseJson.imageUrls.length; i++) {
                    urls = urls.concat({url: responseJson.imageUrls[i]})
                }

                this.setState({
                    title: responseJson.name,
                    money: responseJson.price,
                    // artworkAbstract: '鸮尊此鸮尊是商代鸟兽形青铜器中的精品,1976年出土于河南安阳殷墟妇好墓。原物现存于中国国家博物馆。',
                    description: responseJson.description,
                    swiperImageUri: responseJson.imageUrls,
                    isStar: responseJson.isStar,
                    imageViews: urls
                });

                // 设置swiper
                let tempSwiper = [];
                for (let i = 0; i < this.state.swiperImageUri.length; i++) {
                    tempSwiper = tempSwiper.concat(
                        <TouchableOpacity style={styles.slide} onPress={() => {
                            this.setState({
                                index: i,
                                modalVisible: true
                            });
                        }}><Image source={{uri: this.state.swiperImageUri[i]}} style={styles.slidePic}/>
                        </TouchableOpacity>
                    );
                }

                this.setState({
                    swiperImage: tempSwiper,
                }, this.setState({
                    isLoaded: true
                }));

            } else {
                API.toastLong('操作失败');
            }
        } catch (error) {
            API.toastLong('操作失败');
        }
    }

    async starArtwork() {
        let id = this.props.navigation.state.params.id;
        let formData = {};
        try {
            let response = this.state.isStar ? await API._fetch(API.POST({
                url: '/user/star/artwork/' + id,
                formData
            })) : await API._fetch(API.GET({url: '/user/star/artwork/' + id, formData}));

            if (response.status === 200) {
                this.setState({
                    isStar: !this.state.isStar
                });
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
                {this.state.isLoaded ? [
                    <View style={{height: 220, borderTopWidth: 1, borderTopColor: '#474747'}}>
                        <Swiper
                            showsButtons={false}
                            autoplay={true}
                            showsPagination={true}
                            autoplayTimeout={3}>
                            {this.state.swiperImage}
                        </Swiper>
                    </View>,

                    <ScrollView style={{borderWidth: 0, borderColor: 'white'}}>
                        <View style={{flexDirection: 'row', height: API.reset(70)}}>
                            <Text style={{
                                fontSize: 24,
                                margin: API.reset(20),
                                color: '#4132de',
                                fontWeight: 'bold',
                                flex: 1
                            }}>
                                {this.state.title}
                            </Text>
                            <Text style={{
                                fontSize: 24,
                                margin: API.reset(20),
                                textAlign: 'right',
                                color: 'red',
                                flex: 1
                            }}>￥{this.state.money}</Text>
                        </View>
                        {/*<View style={styles.cardContainer}>*/}
                        {/*<View style={{flexDirection: 'row'}}>*/}
                        {/*<Image source={require('../../assets/icon/name.png')} style={styles.cardPicture}/>*/}
                        {/*<Text style={styles.cardTitle}>*/}
                        {/*艺术家简介*/}
                        {/*</Text>*/}
                        {/*</View>*/}
                        {/*<Text style={styles.cardContent}>*/}
                        {/*{this.state.masterAbstract}*/}
                        {/*</Text>*/}
                        {/*</View>*/}
                        <View style={{
                            flex: 1,
                            height: API.height - API.reset(118) - 220,
                            backgroundColor: 'white',
                            paddingTop: API.reset(20),
                            marginLeft: API.reset(20),
                            borderColor: 'white'
                        }}>
                            <WebView
                                style={{borderWidth: 0, width: API.width - API.reset(40)}}
                                originWhitelist={['*']}
                                automaticallyAdjustContentInsets={true}
                                source={{
                                    html: `<!DOCTYPE html>
                                           <html>
                                            <body style="-webkit-text-size-adjust: 300%;">` + this.state.description + `</body>
                                           </html>`
                                }}
                                scalesPageToFit={true}
                                allowFontScaling={true}
                            />
                        </View>
                    </ScrollView>,

                    <View style={{height: API.reset(50)}}>
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
                            style={styles.button}>
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                }}
                                onPress={() => {
                                    // 关注之后请求
                                    this.starArtwork();
                                }}
                            >
                                {this.state.isStar ? '已关注' : '关注'}
                            </Text>
                        </LinearGradient>
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
                ] : []}
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: API.height - API.reset(68),
        backgroundColor: 'white',
        borderWidth: 0
    },
    slide1: {
        flex: 1,
    },
    slidePic: {
        width: API.width,
        height: 220,
    },
    text: {
        color: '#4132de',
        fontSize: 30,
        fontWeight: 'bold',
    },
    cardContainer: {
        marginHorizontal: API.reset(20),
        // borderRadius: 5,
        // backgroundColor: '#fff',
        // backgroundColor: 'rgba(175,175,175,0.3)',
        // borderTopWidth: 1
    },
    cardPicture: {
        width: API.reset(20),
        height: API.reset(20),
        marginTop: API.reset(20),
        marginRight: API.reset(3),
        // flex: 0.1
    },
    cardTitle: {
        paddingTop: API.reset(10),
        margin: API.reset(10),
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    cardContent: {
        // flex: 0.8,
        fontSize: 12,
        marginVertical: API.reset(10),
        letterSpacing: 1.2,
        lineHeight: API.reset(17),
        color: '#252525',
    },
    button: {
        flex: 1,
        height: API.reset(50),
        justifyContent: 'center',
    },
    title_view: {
        flexDirection: 'row',
        height: 50,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#27b5ee',
    },
    title_text: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    },
});

export default connect(state => state.reducer)(ArtworkDetail);