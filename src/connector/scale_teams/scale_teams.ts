import APIConnector from "../connector";
import Endpoint, { BaseFilter, EndpointRequest } from "../endpoint";

export interface ScaleTeam {
    id: number;
    scale_id: number;
    comment: string | null;
    created_at: string;
    updated_at: string;
    feedback: string | null;
    final_mark: number | null;
    flag: any;
    begin_at: string;
    correcteds: any[];
    corrector: {
        id: number;
        login: string;
        url: string;
    };
    truant: object;
    filled_at: string | null;
    questions_with_answers: any[];
    scale: any;
    team: {
        id: number;
        name: string;
        url: string;
        final_mark: number | null;
        project_id: number;
        created_at: string;
        upated_at: string;
        status: string;
        terminating_at: string;
        users: any[];
        'locked?': boolean;
        'validated?': boolean | null;
        'closed?': boolean;
        repo_url: string;
        repo_uuid: string;
        locked_at: string;
        closed_at: string;
        project_session_id: number;
        project_gitlab_path: string;
    };
    feedbacks: any[];
}

export interface ScaleTeamsFilter extends BaseFilter {
    id: string;
    user_id: string;
    begin_at: string;
    created_at: string;
    updated_at: string;
    scale_id: string;
    team_id: string;
    comment: string;
    old_feedback: string;
    feedback_rating: string;
    final_mark: string;
    truant_id: string;
    flag_id: string;
    token: string;
    ip: string;
    internship_id: string;
    filled_at: string;
    campus_id: string;
    future: string;
    filled: string;
}

class ScaleTeamsClass extends Endpoint<ScaleTeam, ScaleTeamsFilter> {

    constructor() {
        super("/v2/scale_teams");
    }

    getUserScaleTeams() {
        return EndpointRequest.get<ScaleTeam[], ScaleTeamsFilter>(`/v2/me/scale_teams`);
    }
}

const ScaleTeams = new ScaleTeamsClass();

export default ScaleTeams;