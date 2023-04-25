import React, { Component } from 'react';
import Routes from '../src/components/Routes';
import TopNavigation from './components/topNavigation';
import SideNavigation from './components/sideNavigation';
import Footer from './components/Footer';
import './index.css';
 
import * as Keycloak from 'keycloak-js';

//keycloak init options
let initOptions = {
    // url: 'https://13.69.242.34/keycloak/auth', realm: 'SDK4ED', clientId: 'account', onLoad: 'login-required'
    // url: 'https://gitlab.seis.iti.gr:2443/keycloak/auth', realm: 'SDK4ED', clientId: 'account', onLoad: 'login-required'
    
    // PROD
    url: process.env.REACT_APP_USER_MANAGEMENT_SERVER_IP, realm: 'SDK4ED', clientId: 'account', onLoad: 'login-required'
}

let keycloak = Keycloak(initOptions);

keycloak.init({ onLoad: initOptions.onLoad, "checkLoginIframe" : false }).success((auth) => {
    if (!auth) {
        window.location.reload();
    } else {
        console.info("Authenticated");
    }

    localStorage.setItem("react-token", keycloak.token);
    localStorage.setItem("react-refresh-token", keycloak.refreshToken);

    setTimeout(() => {
        keycloak.updateToken(70).success((refreshed) => {
            if (refreshed) {
                console.debug('Token refreshed' + refreshed);
            } else {
                console.warn('Token not refreshed, valid for '
                    + Math.round(keycloak.tokenParsed.exp + keycloak.timeSkew - new Date().getTime() / 1000) + ' seconds');
            }
        }).error(() => {
            console.error('Failed to refresh token');
        });
    }, 60000)

}).error(() => {
    console.error("Authenticated Failed");
}); 

class App extends Component {
    render() {
        return (
            <div className="flexible-content">
                <TopNavigation />
                <main id="content" className="ml-0 p-5">
                    <Routes />
                </main>
                <Footer />
            </div>
        );
    }
}

export default App;
