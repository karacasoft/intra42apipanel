import { BASE_URL } from "../../config";
import APIConnector from "../connector";
import Endpoint, { BaseFilter } from "../endpoint";

export interface User {
    id: number;
    login: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface UserFilter extends BaseFilter {
    id: string;
    login: string;
    url: string;
    created_at: string;
    updated_at: string;
}

class UsersClass extends Endpoint<User, UserFilter> {

    constructor() {
        super("/v2/users");
    }

    changePassword(user: User, pass: string) {
        return APIConnector.patch(`${BASE_URL}/v2/users/${user.id}`, {
            user: {
                password: pass,
            },
        })
    }
}

const Users = new UsersClass();

export default Users;