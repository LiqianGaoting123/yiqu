
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import React, { Component } from 'react'
import { Provider } from 'react-redux';
import store from './src/redux/store';
import API from './src/static/methods'
API.backhandler();
class ReduxApp extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}
console.disableYellowBox = true;
AppRegistry.registerComponent(appName, () => ReduxApp);
