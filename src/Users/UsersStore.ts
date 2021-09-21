import { action, makeObservable, observable } from "mobx";
import Users, { User, UserFilter } from "../connector/users/users";

class UsersStoreClass {
    users: User[] = [];
    filter: Partial<UserFilter>;

    usersSynched: boolean = false;
    synching: boolean = false;
    userGetError: boolean = false;

    constructor() {
        makeObservable(this, {
            filter: observable,
            users: observable,
            usersSynched: observable,
            userGetError: observable,
            synching: observable,

            getUsers: action,
            getUsersSuccess: action.bound,
            getUsersError: action.bound,
        });
        this.filter = {
            id: "",
            created_at: "",
            login: "",
            updated_at: "",
            url: "",
        };
    }

    getUsers() {
        this.synching = true;
        Users.filter = this.filter;
        Users.get()
                .then(this.getUsersSuccess)
                .catch(this.getUsersError);
    }

    getUsersSuccess(users: User[]) {
        this.users = users;
        this.synching = false;
        this.usersSynched = true;
    }

    getUsersError() {
        this.users = [];
        this.usersSynched = false;
        this.synching = false;
        this.userGetError = true;
    }

    changePassword(user: User) {
        Users.changePassword(user, `${user.login}.42istanbul`)
                .then(ret => console.log(ret))
                .catch(err => console.log(err));
    }
}

const UsersStore = new UsersStoreClass();

export default UsersStore;