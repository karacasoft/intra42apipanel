import APIConnector from "./connector";

export type BaseFilter = {
    [k: string]: string;
}

class Endpoint<T extends object, V extends BaseFilter = BaseFilter> {

    private _route: string;
    private _primary_key_field?: string;
    private per_page: number = 30;
    private page: number = 1;
    filter: Partial<V> = {};

    constructor(route: string, primary_key_field?: string) {
        this._route = route;
        this._primary_key_field = primary_key_field;
    }

    protected get filterString() {
        const str = Object.keys(this.filter)
                .filter(a => this.filter[a] !== undefined && this.filter[a] !== null && this.filter[a]?.length !== 0)
                .reduce((a, b) => a + `&filter[${b}]=${this.filter[b]}`, "").substring(1);
        if(str.length > 0) return "?" + str;
        else return "";
    }

    get<U = T>(): Promise<U[]>
    get<U = T>(id: string): Promise<U>
    get<U = T>(id?: string) {
        if(id !== undefined) {
            return APIConnector.get<U>(`${this._route}/${id}`);
        } else {
            return APIConnector.get<U[]>(`${this._route}${this.filterString}`);
        }
    }

    post<U extends object = T>(data?: U) {
        return APIConnector.post<U>(`${this._route}`, data);
    }

    put<U extends object = T>(id?: string, data?: string | object) {
        if(id !== undefined) {
            return APIConnector.put<U>(`${this._route}/${id}`, data);
        } else {
            return APIConnector.put<U>(`${this._route}${this.filterString}`, data);
        }
    }

    patch<U extends object = T>(id?: string, data?: string | object) {
        if(id !== undefined) {
            return APIConnector.patch<U>(`${this._route}/${id}`, data);
        } else {
            return APIConnector.patch<U>(`${this._route}${this.filterString}`, data);
        }
    }

    delete<U extends object = T>(id?: string) {
        return APIConnector.delete<U>(`${this._route}/${id}`);
    }
}

export default Endpoint;