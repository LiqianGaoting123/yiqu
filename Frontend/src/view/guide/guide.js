import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import API from '../../static/methods'
import Swiper from 'react-native-swiper'
class Guide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showsPagination: true
        };

        global.token = '';
    }

    render() {
        return (
            <Swiper
                height={API.height}
                width={API.width}
                style={styles.swiper}
                loop={false}
                showsPagination={this.state.showsPagination}
                onIndexChanged={(index) => {
                    this.setState({ showsPagination: index !== 2 })
                }}>
                <View style={styles.item}><Image source={require('../../assets/images/guide_first.png')} style={styles.img} /></View>
                <View style={styles.item}><Image source={require('../../assets/images/guide_second.png')} style={styles.img} /></View>
                <View style={styles.item}>
                    <ImageBackground source={require('../../assets/images/guide_third.png')} style={styles.img}>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('LoginApp')}>
                            <Text style={styles.text}>
                                马上探索
                            </Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </Swiper>
        );
    }
}

export default Guide;

const styles = StyleSheet.create({
    item: {
        flex: 1,
    },
    img: {
        width: API.width,
        height: API.height
    },
    button: {
        position: 'absolute',
        bottom: 30,
        left: (API.width - 115) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        width: 115,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#c4000f'
    },
    text: {
        color: '#c4000f'
    }
});