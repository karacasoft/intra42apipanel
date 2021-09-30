import request, { SuperAgentRequest } from "superagent";
import { BASE_URL } from "../config";
import APIError from "./APIError";
import RequestScheduler from "./request_scheduler";

export interface TokenInfo {
    access_token: string;
    token_type: 'bearer';
    expires_in: number;
    refresh_token: string;
    scope: string;
    created_at: number;
}

export interface APIResponse<T> {
    data: T;
    page?: number;
    total?: number;
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

    login(clientId: string, clientSecret: string): Promise<TokenInfo> {
        return request
                .post(`${BASE_URL}/oauth/token`)
                .type("form")
                .send({
                    grant_type: "client_credentials",
                    client_id: clientId,
                    client_secret: clientSecret,
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

    private authorize(r: SuperAgentRequest) {
        if(this.token) {
            r.set("Authorization", `Bearer ${this.token}`);
        }
    }

    send_request<T>(r: SuperAgentRequest): Promise<APIResponse<T>> {
        this.authorize(r);
        return r.then<APIResponse<T>>(data => {
                const total = data.headers["x-total"];
                const page = data.headers["x-page"];
                console.log(page);
                console.log(total);
                console.log(data.headers);
                return {
                    data: data.body as T,
                    total,
                    page,
                };
            })
            .catch(err => {
                throw new APIError(err.response.statusCode, err.response.body, err.response.text, err);
            });
    }

    get<T = {}>(url: string) {
        const r = request
                .get(this._url_beautify(url));
        return RequestScheduler.enqueue<T>(r);
    }

    post<T = {}>(url: string, data?: string | object) {
        const r = request
                .post(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return RequestScheduler.enqueue<T>(r);
    }

    put<T = {}>(url: string, data?: string | object) {
        const r = request
                .put(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return RequestScheduler.enqueue<T>(r);
    }

    patch<T = {}>(url: string, data?: string | object) {
        const r = request
                .patch(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return RequestScheduler.enqueue<T>(r);
    }

    delete<T = {}>(url: string, data?: string | object) {
        const r = request
                .delete(this._url_beautify(url))
                .type("application/json")
                .send(data)
        return RequestScheduler.enqueue<T>(r);
    }

}

const APIConnector = new API42Connector();

export default APIConnector;