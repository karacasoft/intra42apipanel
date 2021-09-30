import { action, makeObservable, observable } from "mobx";
import { APIResponse } from "../connector/connector";
import ScaleTeams, { ScaleTeam, ScaleTeamsFilter } from "../connector/scale_teams/scale_teams";

class ScaleTeamStoreClass {

    filter: Partial<ScaleTeamsFilter>;
    scaleTeams: ScaleTeam[] = [];

    currentPage: number = 0;

    gettingScaleTeams: boolean = false;

    constructor() {
        makeObservable(this, {
            scaleTeams: observable,
            filter: observable,
            gettingScaleTeams: observable,

            getScaleTeams: action,
            getUserScaleTeams: action,
            getScaleTeamsSuccess: action.bound,
            getScaleTeamsError: action.bound,
        });
        this.filter = {
            "id" : "",
            "user_id" : "",
            "begin_at" : "",
            "created_at" : "",
            "updated_at" : "",
            "scale_id" : "",
            "team_id" : "",
            "comment" : "",
            "old_feedback" : "",
            "feedback_rating" : "",
            "final_mark" : "",
            "truant_id" : "",
            "flag_id" : "",
            "token" : "",
            "ip" : "",
            "internship_id" : "",
            "filled_at" : "",
            "campus_id" : "",
            "future" : "",
            "filled" : "",
        };
    }

    getScaleTeams() {
        this.gettingScaleTeams = true;
        ScaleTeams.get()
                .setFilter(this.filter)
                .execute()
                .then(this.getScaleTeamsSuccess)
                .catch(this.getScaleTeamsError);
    }

    getUserScaleTeams() {
        this.gettingScaleTeams = true;
        ScaleTeams.getUserScaleTeams()
                .setFilter(this.filter)
                .execute()
                .then(this.getScaleTeamsSuccess)
                .catch(this.getScaleTeamsError);
    }

    getScaleTeamsSuccess(res: APIResponse<ScaleTeam[]>) {
        this.gettingScaleTeams = false;
        this.scaleTeams = res.data;
    }

    getScaleTeamsError(err: Error) {
        this.gettingScaleTeams = false;
        console.log(err);
    }

}

const ScaleTeamStore = new ScaleTeamStoreClass();

export default ScaleTeamStore;