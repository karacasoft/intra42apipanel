import { action, computed, makeObservable, observable } from "mobx";
import APIError from "../connector/APIError";
import APIConnector from "../connector/connector";
import TokenEndpoint, { DetailedTokenInfo, TokenUserInfo } from "../connector/tokeninfo/token_endpoint";

class LoginStoreClass {

    loggedIn: boolean = false;
    loggingIn: boolean = false;
    loginErrorMessage?: string;

    tokenUserInfo?: TokenUserInfo;
    detailedTokenInfo?: DetailedTokenInfo;

    constructor() {
        makeObservable(this, {
            loggedIn: observable,
            loggingIn: observable,
            loginErrorMessage: observable,
            tokenUserInfo: observable,
            detailedTokenInfo: observable,
            
            getTokenUserInfo: action.bound,
            getTokenUserInfoSuccess: action.bound,
            getTokenUserInfoError: action.bound,

            invalidateToken: action.bound,

            login: action,
            logout: action,
            loginSuccess: action.bound,
            loginError: action.bound,
        });
    }

    logout() {
        this.invalidateToken();
    }

    getTokenUserInfo() {
        TokenEndpoint.getTokenUserInfo()
                .then(this.getTokenUserInfoSuccess)
                .catch(err => {
                    if(err.data.message === "The access token expired") {
                        // TODO should refresh instead..
                        this.invalidateToken();
                    } else {
                        this.getTokenUserInfoError(err);
                    }
                });
    }

    getTokenUserInfoSuccess(info: TokenUserInfo) {
        this.tokenUserInfo = info;
        this.loggedIn = true;
    }

    getTokenUserInfoError(err: Error) {
        console.log(err);
        this.loggedIn = false;
    }

    invalidateToken() {
        this.loggedIn = false;
        APIConnector.removeToken();
    }

    login(code: string) {
        this.loggingIn = true;
        APIConnector.login(code)
                .then(this.loginSuccess)
                .catch(this.loginError);
        
    }

    loginSuccess() {
        this.loggingIn = false
        this.loggedIn = true;
        this.getTokenUserInfo();
        APIConnector.saveToken();
    }

    loginError(err: APIError) {
        console.error(err);
        this.loggingIn = false;
        // TODO act according to err.code
        this.loginErrorMessage = "Bir hata oluştu: " + err.cause;
    }
}

const LoginStore = new LoginStoreClass();

export default LoginStore;