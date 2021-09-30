import APIConnector, { APIResponse } from "./connector";

export type BaseFilter = {
    [k: string]: string;
}

export class EndpointRequest<T, V extends BaseFilter = BaseFilter> {
    private _filter: Partial<V> = {};
    private _page: number = 1;
    private _execute: (getParams: string) => Promise<APIResponse<T>>;

    constructor(executor: (getParams: string) => Promise<APIResponse<T>>) {
        this._execute = executor;
    }

    static get<T, V extends BaseFilter>(route: string): EndpointRequest<T, V> {
        return new EndpointRequest((getParams) => {
            return APIConnector.get<T>(`${route}${getParams}`);
        });
    }

    static post<T, V extends BaseFilter>(route: string, data: string | object): EndpointRequest<T, V> {
        return new EndpointRequest((getParams) => {
            return APIConnector.post<T>(`${route}${getParams}`, data);
        });
    }

    static put<T, V extends BaseFilter>(route: string, data: string | object): EndpointRequest<T, V> {
        return new EndpointRequest((getParams) => {
            return APIConnector.put<T>(`${route}${getParams}`, data);
        });
    }

    static patch<T, V extends BaseFilter>(route: string, data: string | object): EndpointRequest<T, V> {
        return new EndpointRequest((getParams) => {
            return APIConnector.patch<T>(`${route}${getParams}`, data);
        });
    }

    static delete<T, V extends BaseFilter>(route: string, data: string | object): EndpointRequest<T, V> {
        return new EndpointRequest((getParams) => {
            return APIConnector.delete<T>(`${route}${getParams}`, data);
        });
    }

    getParams() {
        const getParams = [];
        getParams.push(Object.keys(this._filter)
                .filter(a => this._filter[a] !== undefined &&
                             this._filter[a] !== null &&
                             this._filter[a]?.length !== 0)
                .reduce((a, b) => a + `&filter[${b}]=${this._filter[b]}`, "").substring(1));
        getParams.push(`page=${this._page}`);
        const str = getParams.filter((str) => str !== "").join("&");
        if(str.length > 0) return "?" + str;
        else return "";
    }

    setFilter(filter: Partial<V>) {
        this._filter = filter;
        return this;
    }

    setPage(page: number) {
        this._page = page;
        return this;
    }

    execute(): Promise<APIResponse<T>> {
        return this._execute(this.getParams());
    }
}

class Endpoint<T extends object, V extends BaseFilter = BaseFilter> {

    private _route: string;
    private _primary_key_field?: string;
    private per_page: number = 30;
    private page: number = 1;

    constructor(route: string, primary_key_field?: string) {
        this._route = route;
        this._primary_key_field = primary_key_field;
    }

    get<U = T>(): EndpointRequest<U[]>
    get<U = T>(id: string): EndpointRequest<U>
    get<U = T>(id?: string) {
        if(id !== undefined) {
            return EndpointRequest.get<U, V>(`${this._route}/${id}`);
        } else {
            return EndpointRequest.get<U, V>(`${this._route}`);
        }
    }

    post<U extends object = T>(data?: U) {
        return new EndpointRequest<U, V>((_) => APIConnector.post<U>(`${this._route}`, data));
    }

    put<U extends object = T>(id?: string, data?: string | object) {
        if(id !== undefined) {
            return new EndpointRequest<U, V>((_) => APIConnector.put<U>(`${this._route}/${id}`, data));
        } else {
            return new EndpointRequest<U, V>((getParams) => APIConnector.put<U>(`${this._route}${getParams}`, data));
        }
    }

    patch<U extends object = T>(id?: string, data?: string | object) {
        if(id !== undefined) {
            return new EndpointRequest<U, V>((_) => APIConnector.patch<U>(`${this._route}/${id}`, data));
        } else {
            return new EndpointRequest<U, V>((getParams) => APIConnector.patch<U>(`${this._route}${getParams}`, data));
        }
    }

    delete<U extends object = T>(id?: string) {
        return new EndpointRequest<U, V>((_) => APIConnector.delete<U>(`${this._route}/${id}`));
    }
}

export default Endpoint;