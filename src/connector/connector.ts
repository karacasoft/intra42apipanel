import request, { SuperAgentRequest } from "superagent";
import { BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } from "../config";
import APIError from "./APIError";

export interface TokenInfo {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
}

class API42Connector {
    private _token_info?: TokenInfo;

    get token() {
        return this._token_info?.access_token;
    }

    get refresh_token() {
        return this._token_info?.refresh_token;
    }

    saveToken() {
        localStorage.setItem("tokenInfo", JSON.stringify(this._token_info));
    }

    loadToken() {
        const tokenInfoStr = localStorage.getItem("tokenInfo");
        if(tokenInfoStr) this._token_info = JSON.parse(tokenInfoStr);
    }

    removeToken() {
        localStorage.removeItem("tokenInfo");
        this._token_info = undefined;
    }

    private _url_beautify(url: string) {
        if(url.startsWith("https://")) {
            return url;
        } else {
            return BASE_URL + url;
        }
    }

    login(code: string): Promise<TokenInfo> {
        return request
                .post(`${BASE_URL}/oauth/token`)
                .type("form")
                .send({
                    grant_type: "client_credentials",
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    scope: "public projects",
                })
                .then(data => {
                    console.log(data.body);
                    this._token_info = data.body;
                    return data.body as TokenInfo;
                })
                .catch(err => {
                    throw new APIError(err.response.statusCode, err.response.text, err);
                });
    }

    private authorize<T>(r: SuperAgentRequest) {
        if(this.token) {
            r.set("Authorization", `Bearer ${this.token}`);
        }
    }

    private send_request<T>(r: SuperAgentRequest) {
        this.authorize<T>(r);
        return r.then<T>(data => {
                return data.body as T;
            })
            .catch(err => {
                throw new APIError(err.response.statusCode, err.response.body, err.response.text, err);
            });
    }

    private enqueue<T>(r: SuperAgentRequest) {
        this.authorize<T>(r);
        
    }

    get<T = {}>(url: string) {
        const r = request
                .get(this._url_beautify(url));
        return this.send_request<T>(r);
    }

    post<T extends object = {}>(url: string, data?: string | object) {
        const r = request
                .post(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return this.send_request<T>(r);
    }

    put<T extends object = {}>(url: string, data?: string | object) {
        const r = request
                .put(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return this.send_request<T>(r);
    }

    patch<T extends object = {}>(url: string, data?: string | object) {
        const r = request
                .patch(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return this.send_request<T>(r);
    }

    delete<T extends object = {}>(url: string, data?: string | object) {
        const r = request
                .delete(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return this.send_request<T>(r);
    }

}

const APIConnector = new API42Connector();

export default APIConnector;