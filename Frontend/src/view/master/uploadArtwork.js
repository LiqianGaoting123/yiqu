import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    ScrollView, TouchableOpacity,
} from "react-native";
import React, {Component} from "react";
import LinearGradient from "react-native-linear-gradient";
import {connect} from "react-redux";
import API from "../../static/methods";

let ImagePicker = require('react-native-image-picker');

// More info on all the options is below in the README...just some common use cases shown here
let options = {
    title: 'Select Avatar',
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

class UploadArtwork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            picUri: '',
            picNumber: 0,
            sources: [],
            imgNumber: 0,
            images: []
        };
    }

    pickImage() {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                this.setState({
                    // sources: this.state.imgNumber === 0 ? [{uri: response.uri}] : [this.state.sources, {uri: response.uri}],
                    // images: this.state.imgNumber === 0 ? [<Image source={this.state.sources[this.state.imgNumber]}
                    //                                              style={styles.picture}/>] : [this.state.images,
                    //     <Image source={this.state.sources[this.state.imgNumber]} style={styles.picture}/>],
                    sources: this.state.sources.concat({uri: response.uri}),
                    images: this.state.images.concat(<Image source={{uri: response.uri}}
                                                            style={styles.picture}/>),
                    imgNumber: this.state.imgNumber + 1,
                });
            }
        })
    }

    render() {
        let test = [];
        for (let i = 0; i < 3; i++)
            test.push(<Image source={require('../../assets/icon/smallupload.png')} style={styles.picture}/>);

        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>
                    <Text style={styles.title}>艺术品名称</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='请输入艺术品名称'
                        placeholderTextColor='#858585'
                        //keyboardType='email-address'
                        onChangeText={(text) => this.setState({nick_name: text})}
                        underlineColorAndroid="transparent"
                        padding={0}
                    />
                    <Text style={styles.title}>价格</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='请输入艺术品价格'
                        placeholderTextColor='#858585'
                        //keyboardType='email-address'
                        onChangeText={(text) => this.setState({nick_name: text})}
                        underlineColorAndroid="transparent"
                        padding={0}
                    />
                    <Text style={styles.title}>简介(100字以内)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='请输入艺术品简介(100字以内)'
                        placeholderTextColor='#858585'
                        //keyboardType='email-address'
                        onChangeText={(text) => this.setState({nick_name: text})}
                        underlineColorAndroid="transparent"
                        // padding={0}
                        multiline={true}
                        maxLength={100}
                    />
                    <Text style={styles.title}>详细介绍</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='请输入艺术品详细介绍'
                        placeholderTextColor='#858585'
                        //keyboardType='email-address'
                        onChangeText={(text) => this.setState({nick_name: text})}
                        underlineColorAndroid="transparent"
                        padding={0}
                        multiline={true}
                    />
                    <Text style={styles.title}>图片</Text>
                    <View style={{flexDirection: 'row'}}>
                        {this.state.images}
                        <TouchableOpacity onPress={() => this.pickImage()}>
                            <Image source={require('../../assets/icon/smallupload.png')} style={styles.picture}/>
                        </TouchableOpacity>
                    </View>
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
                        style={styles.button}>
                        <Text
                            style={{
                                color: '#fff',
                                fontSize: 20,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                justifyContent: 'center',
                            }}>确认上传</Text>
                    </LinearGradient>
                </View>
            </View>
        )
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
    picture: {
        width: API.width / 4 - 20,
        height: API.width / 4 - 20,
        marginLeft: 15,
    },
    title: {
        fontSize: 20,
        margin: 15,
    },
    button: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
    },
    input: {
        width: API.width - 30,
        height: 30,
        fontSize: 14,
        color: '#000000',
        marginLeft: 15,
        marginRight: 15,
        borderBottomWidth: 1,
    }
});

export default connect(state => state.reducer)(UploadArtwork);