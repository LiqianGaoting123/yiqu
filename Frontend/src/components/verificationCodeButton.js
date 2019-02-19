import React, {Component} from 'react'
import {TouchableOpacity, Text} from 'react-native'
export default class VerificationCodeButton extends Component {
    static defaultProps = {
        color: '#333',
        changeColor: '#B5B5B5'
    }
    constructor() {
        super()
        this.state = {
            seconds: 60,
            send: false
        }
    }
    async setTimer() {
        this.setState({send: true})
        this.timer = setInterval(() => {
            this.setState(previousState => {
                return {
                    seconds: previousState.seconds - 1
                }
            })
        }, 1000)
        this.outtimer = setTimeout(() => {
            clearInterval(this.timer)
            this.setState({send: false, seconds: 59})
        }, 59000);
        let status = await this
            .props
            .fetchCode()
        if (!status) {
            clearTimeout(this.outtimer)
            clearInterval(this.timer)
            this.setState({send: false, seconds: 59})
        }
    };
    render() {
        return (
            <TouchableOpacity
                disabled={this.state.send
                ? true
                : false}
                onPress={() => {
                this.setTimer()
            }}
                style={this.props.buttonStyle}>
                {/* <Text style={this.props.textStyle}>{this.state.send
                        ? this.state.seconds + 's后再次发送'
                        : this.props.text}</Text> */}
                <Text style={this.props.textStyle}>{this.state.send
                        ? this.state.seconds + 's后重发'
                        : this.props.text}</Text>
            </TouchableOpacity>
        )
    }
}