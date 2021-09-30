import { action, makeObservable, observable } from "mobx";
import APIError from "../connector/APIError";
import { APIResponse } from "../connector/connector";
import Users, { User, UserFilter } from "../connector/users/users";

class UsersStoreClass {
    users: {
        [key: number]: User[],
    } = {};
    currentPage: number = 1;
    filter: Partial<UserFilter>;

    usersSynched: boolean = false;
    synching: boolean = false;
    userGetError: boolean = false;
    selectedUser?: User;
    changePasswordDialogOpen: boolean = false;
    changePasswordErrorText?: string;
    changePasswordErrors?: { [key: string]: string[] };

    changingPassword: { [k: string]: boolean } = {};

    constructor() {
        makeObservable(this, {
            filter: observable,
            users: observable,
            usersSynched: observable,
            userGetError: observable,
            synching: observable,
            selectedUser: observable,
            currentPage: observable,

            changingPassword: observable,
            changePasswordErrors: observable,
            changePasswordErrorText: observable,
            changePasswordDialogOpen: observable,

            resetUsers: action,

            getUsers: action,
            getUsersSuccess: action.bound,
            getUsersError: action.bound,

            changePassword: action,
            changePasswordSuccess: action.bound,
            changePasswordError: action.bound,

            openChangePasswordDialog: action,
            closeChangePasswordDialog: action,

            selectUser: action,
            deselectUser: action,
        });
        this.filter = {
            id: "",
            login: "",
            email: "",
            created_at: "",
            updated_at: "",
            pool_year: "",
            pool_month: "",
            kind: "",
            status: "",
            primary_campus_id: "",
            first_name: "",
            last_name: "",
            "staff?": "",
        };
    }

    resetUsers() {
        this.currentPage = 0;
        this.users = {
            [this.currentPage]: this.users[this.currentPage]
        };
    }

    getUsers() {
        this.synching = true;
        const requestedPage = this.currentPage;
        Users.get()
                .setFilter(this.filter)
                .setPage(this.currentPage)
                .execute()
                .then((data) =>  this.getUsersSuccess(data, requestedPage))
                .catch(this.getUsersError);
    }

    getUsersSuccess(users: APIResponse<User[]>, page: number) {
        this.users[page] = users.data;
        this.synching = false;
        this.usersSynched = true;
    }

    getUsersError() {
        this.users = [];
        this.usersSynched = false;
        this.synching = false;
        this.userGetError = true;
    }

    selectUser(user: User) {
        this.selectedUser = user;
    }

    deselectUser() {
        this.selectedUser = undefined;
    }

    openChangePasswordDialog() {
        this.changePasswordDialogOpen = true;
    }

    closeChangePasswordDialog() {
        this.changePasswordDialogOpen = false;
    }

    changePassword(user: User, password: string) {
        this.changingPassword[user.login] = true;
        Users.changePassword(user, password)
                .then((ret) => this.changePasswordSuccess(ret, user))
                .catch((err) => this.changePasswordError(err, user));
    }

    changePasswordSuccess(ret: {}, user: User) {
        this.changingPassword[user.login] = false;
        this.changePasswordDialogOpen = false;
    }

    changePasswordError(err: APIError, user: User) {
        this.changingPassword[user.login] = false;
        if(err.code === 422) {
            this.changePasswordErrors = err.data.errors;
        }
    }
}

const UsersStore = new UsersStoreClass();

export default UsersStore;