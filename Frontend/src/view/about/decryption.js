import React, {Component} from 'react';
import {ScrollView, Image} from 'react-native';
import API from '../../static/methods';

class Decryption extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <ScrollView>
                <Image
                    source={require('../../assets/images/decode.jpg')}
                    resizeMode='contain'
                    style={{
                        width: API.width,
                        height: API.width * 2332 / 749
                    }}/>
            </ScrollView>
        );
    }
}

export default Decryption;
