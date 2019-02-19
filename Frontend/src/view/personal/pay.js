import {
    StyleSheet,
    View,
    Text, Modal, TouchableOpacity, Image, Alert
} from "react-native";
import React, {Component} from "react";
import {connect} from "react-redux";
import API from "../../static/methods";
import SubmitBtn from "../../components/submitButton";
import RadioForm from "react-native-simple-radio-button/lib/SimpleRadioButton";
import {showLoading} from "../../redux/actions";

class Pay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedId: 0,
            radioProps: [
                {label: '艺能支付', value: 0},
                {label: '大师币支付', value: 1},
                {label: '艺能大师币混合支付', value: 2},
                // {label: '支付宝支付', value: 3},
                // {label: '微信支付', value: 4},
            ],
            modalVisible: false,
            password: [],
            price: this.props.navigation.state.params.price,
            orderId: this.props.navigation.state.params.orderId
        };
    }

    async pay() {
        let paw = '';
        for (let i = 0; i < 6; i++) {
            paw = paw + this.state.password[i];
        }

        try {
            let formData = {payCode: paw};
            this.setState({modalVisible: false});
            this.props.dispatch(showLoading(true));
            let response = await API._fetch(API.POST({url: '/account/payCode', formData}));
            
            if(response.status === 403){
                Alert.alert('支付失败', '密码错误，请重新输入密码或前往个人中心修改支付密码');
                this.setState({password: []});
                this.props.dispatch(showLoading(false));
                return;
            }

            formData = {password: paw, scheduleId: this.state.orderId, payStrategy: this.state.selectedId};
            response = await API._fetch(API.POST({url: '/profile/pay/schedule', formData}));

            this.props.dispatch(showLoading(false));
            this.setState({password: []});

            if (response.status === 200) {
                this.props.navigation.state.params.refresh();
                this.props.navigation.goBack();
            }
            else if (response.status === 201) {
                Alert.alert('支付成功', '成功发起订单，请耐心等待结果');
                this.props.navigation.state.params.refresh();
                this.props.navigation.goBack();
            }
            else if (response.status === 401) {
                Alert.alert('支付失败', '艺能余额不足，请充值后重新支付');
                this.props.navigation.goBack();
            }
            else if (response.status === 403) {
                Alert.alert('支付失败', '以太坊中余额不足，无法进行交易');
                this.props.navigation.goBack();
            }
            else if (response.status === 405) {
                Alert.alert('支付失败', '您没有绑定以太坊账户，请绑定后进行交易');
                this.props.navigation.goBack();
            }
            else
                API.toastLong('操作失败');
        }
        catch (error) {
            this.props.dispatch(showLoading(false));
            this.setState({password: []});
            API.toastLong('网络连接问题')
        }
    }

    async passwordInput(number) {
        if (this.state.modalVisible) {
            if (this.state.password.length >= 5) {
                let newPassword = [];
                newPassword = newPassword.concat(this.state.password);
                newPassword.push(number);
                this.setState({password: newPassword}, async () => await this.pay());
            }
            else {
                let newPassword = [];
                newPassword = newPassword.concat(this.state.password);
                newPassword.push(number);
                this.setState({password: newPassword});
            }
        }
    }

    deletePassword() {
        if (this.state.modalVisible) {
            if (this.state.password.length > 0) {
                let newPassword = [];
                newPassword = newPassword.concat(this.state.password);
                newPassword.splice(this.state.password.length - 1, 1);
                this.setState({password: newPassword});
            }
        }
    }

    render() {
        return (
            <View>
                <Text style={{
                    marginVertical: API.reset(20),
                    fontSize: 25,
                    marginLeft: API.reset(30),
                    fontWeight: 'bold',
                    color: '#3d3d3d'
                }}>
                    本订单共需支付
                </Text>
                <View style={[styles.box, {alignItems: 'flex-end'}]}>
                    <Text style={{
                        marginVertical: API.reset(10),
                        fontSize: 25,
                        marginRight: API.reset(30),
                        textAlign: 'right',
                        fontWeight: 'bold'
                    }}>
                        {this.state.price} GAB
                    </Text>
                </View>

                <Text style={{
                    marginVertical: API.reset(20),
                    fontSize: 25,
                    marginLeft: API.reset(30),
                    fontWeight: 'bold',
                    color: '#3d3d3d'
                }}>
                    选择支付方式
                </Text>

                <View style={styles.box}>
                    <RadioForm
                        radio_props={this.state.radioProps}
                        initial={0}
                        buttonSize={12}
                        labelStyle={{fontSize: 15, color: '#515151'}}
                        onPress={(value) => {
                            this.setState({selectedId: value});
                            // console.log(value);
                        }}
                    />

                    <SubmitBtn
                        buttonStyle={styles.submitBtn}
                        text='立即支付'
                        onPress={() => this.setState({modalVisible: true})}/>
                </View>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                >
                    <View style={{height: API.height, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <View style={{position: 'absolute', bottom: 0}}>
                            <View style={{
                                marginHorizontal: API.reset(10),
                                backgroundColor: '#f7f7f7',
                                marginVertical: API.reset(50)
                            }}>
                                <View>
                                    <Text style={{
                                        marginHorizontal: API.reset(10),
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                        marginVertical: API.reset(15)
                                    }}>密码</Text>
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    borderLeftWidth: 0.5,
                                    borderRightWidth: 0.5,
                                    borderWidth: 0.5,
                                    borderColor: '#8d8d8d',
                                    marginHorizontal: API.reset(10),
                                    marginBottom: API.reset(20),
                                    height: (API.width - API.reset(40)) / 6 + API.reset(1),
                                }}>
                                    <Text
                                        style={styles.pasPad}>{this.state.password.length > 0 ? '·' : ''}</Text>
                                    <Text
                                        style={styles.pasPad}>{this.state.password.length > 1 ? '·' : ''}</Text>
                                    <Text
                                        style={styles.pasPad}>{this.state.password.length > 2 ? '·' : ''}</Text>
                                    <Text
                                        style={styles.pasPad}>{this.state.password.length > 3 ? '·' : ''}</Text>
                                    <Text
                                        style={styles.pasPad}>{this.state.password.length > 4 ? '·' : ''}</Text>
                                    <Text
                                        style={styles.pasPad}>{this.state.password.length > 5 ? '·' : ''}</Text>
                                </View>
                            </View>

                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(1)}>
                                    <Text style={styles.numberPad}>1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(2)}>
                                    <Text style={styles.numberPad}>2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(3)}>
                                    <Text style={styles.numberPad}>3</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(4)}>
                                    <Text style={styles.numberPad}>4</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(5)}>
                                    <Text style={styles.numberPad}>5</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(6)}>
                                    <Text style={styles.numberPad}>6</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(7)}>
                                    <Text style={styles.numberPad}>7</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(8)}>
                                    <Text style={styles.numberPad}>8</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(9)}>
                                    <Text style={styles.numberPad}>9</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <TouchableOpacity activeOpacity={0.8}
                                                  onPress={() => this.setState({modalVisible: false, password: []})}>
                                    <Text
                                        style={[styles.numberPad, {
                                            fontSize: API.reset(22),
                                            paddingVertical: (API.width / 3 - API.reset(84)) / 2
                                        }]}>取消</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.passwordInput(0)}>
                                    <Text style={styles.numberPad}>0</Text>
                                </TouchableOpacity>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => this.deletePassword()}
                                                  style={[styles.numberPad]}>
                                    <Image source={require('../../assets/icon/deleteOne.png')}
                                           style={{
                                               marginTop: API.reset(-2),
                                               marginLeft: (API.width / 3 - API.reset(40)) / 2,
                                               width: API.reset(40),
                                               height: API.reset(40)
                                           }}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        marginVertical: API.reset(10),
        marginHorizontal: API.reset(30),
        padding: API.reset(20),
        backgroundColor: '#fff',
        borderRadius: 10,
        alignItems: 'center',
    },
    choice: {
        textAlign: 'center',
        marginVertical: API.reset(10),
        fontSize: 50,
    },
    submitBtn: {
        marginTop: API.reset(10),
        marginBottom: API.reset(10),
    },
    pasPad: {
        width: (API.width - API.reset(40)) / 6,
        height: (API.width - API.reset(40)) / 6,
        fontSize: API.reset(45),
        // paddingVertical: ((API.width - API.reset(40)) / 6 - API.reset(55)) / 2,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        color: '#444444',
        borderColor: '#8d8d8d',
        backgroundColor: '#fff'
    },
    numberPad: {
        width: API.width / 3,
        height: API.width / 3 - API.reset(60),
        fontSize: API.reset(30),
        paddingVertical: (API.width / 3 - API.reset(95)) / 2,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0.5,
        color: '#444444',
        borderColor: '#8d8d8d',
        backgroundColor: '#fff'
    }
});

export default connect(state => state.reducer)(Pay);