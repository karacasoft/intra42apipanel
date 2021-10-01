import { action, computed, makeObservable, observable } from "mobx";
import { APIResponse } from "../connector/connector";
import ProjectsUsers, { ProjectsUser } from "../connector/projects_users/projects_users";
import Users, { User } from "../connector/users/users";

export type PoolMonth = "january" | "february" | "march" | "april" |
                        "may" | "june" | "july" | "august" |
                        "september" | "october" | "november" |
                        "december";

type PiscineUserReadyState = {
    user: User;
    state: "ready";
    data: ProjectsUser[];
}

type PiscineUserLoadingState = {
    state: "loading";
    user: User;
}

type PiscineUserErrorState = {
    state: "error";
    user: User;
}

export type PiscineUserState = PiscineUserReadyState |
                        PiscineUserLoadingState |
                        PiscineUserErrorState;

class GradeReportingStoreClass {
    piscineUsers: User[] = [];
    piscineUsersState: {
        [id: number]: PiscineUserState
    } = {};

    gettingPiscineUsers: boolean = false;

    constructor() {
        makeObservable(this, {
            piscineUsers: observable,
            piscineUsersState: observable,

            gettingPiscineUsers: observable,

            projects: computed,

            resetCursusUsers: action,

            getPiscineUsers: action,
            getPiscineUsersSuccess: action.bound,
            getPiscineUsersError: action.bound,

            getUserGrades: action.bound,
            getUserGradesSuccess: action.bound,
            getUserGradesError: action.bound,
        });
    }

    get projects() {
        return Object.keys(this.piscineUsersState).map(state => {
            const currState = this.piscineUsersState[parseInt(state)];
            if(currState.state === "ready") {
                return currState.data.map(data => ({
                    project_id: data.project.id,
                    project_name: data.project.name,
                    project_mark: data.final_mark,
                }));
            }
            return [];
        }).reduce((map, next) => {
            next.forEach(el => {
                map.set(el.project_id, {
                    id: el.project_id,
                    name: el.project_name,
                });
            });
            return map;
        }, new Map<number, {
            id: number,
            name: string,
        }>());
    }

    get allValuesCSV() {
        const header = `ID:login;${Array.from(this.projects.values())
            .map(project => `${project.id}:${project.name}`)
            .join(";")}`;
        const rows = this.piscineUsers.map(user => {
            const state = this.piscineUsersState[user.id];
            const data = state.state === "ready" ?
                    state.data : [];
            return `${user.id}:${user.login};${Array.from(this.projects.values())
                    .map(project => `${data.find(pu => pu.project.id === project.id)?.final_mark || 0}`)
                    .join(";")}`;
        });
        return header + "\n" +
                rows.join("\n");
    }

    resetCursusUsers() {
        this.piscineUsers = [];
    }

    getPiscineUsers(campus_id: number, pool_year: string, pool_month: PoolMonth) {
        this.gettingPiscineUsers = true;
        Users.get()
                .setFilter({
                    primary_campus_id: String(campus_id),
                    pool_year,
                    pool_month
                })
                .getAllPages()
                .then(res => {
                    console.log(res);
                    return {
                        data: res.data.flat(),
                        total: res.total,
                    }
                })
                .then(this.getPiscineUsersSuccess);
    }

    getPiscineUsersSuccess(res: APIResponse<User[]>) {
        console.log(res);
        res.data.forEach(user => this.getUserGrades(user));
        this.piscineUsers = res.data;
        this.gettingPiscineUsers = false;
    }

    getPiscineUsersError(err: Error) {
        this.gettingPiscineUsers = false;
    }

    getUserGrades(user: User) {
        this.piscineUsersState[user.id] = {
            state: "loading",
            user,
        };
        ProjectsUsers.getFromUser(user.id)
                .setItemsPerPage(100)
                .execute()
                .then(res => ({
                    data: res.data.flat(),
                    total: res.total,
                }))
                .then(res => this.getUserGradesSuccess(res, user))
                .catch(err => this.getUserGradesError(err, user));
    }

    getUserGradesSuccess(res: APIResponse<ProjectsUser[]>, user: User) {
        this.piscineUsersState[user.id] = {
            state: "ready",
            user: user,
            data: res.data,
        };
    }

    getUserGradesError(err: Error, user: User) {
        this.piscineUsersState[user.id] = {
            state: "error",
            user,
        };
    }

}

const GradeReportingStore = new GradeReportingStoreClass();

export default GradeReportingStore;