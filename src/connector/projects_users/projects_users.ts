import Endpoint, { BaseFilter, EndpointRequest } from "../endpoint";

export interface ProjectsUser {
    id: number;
    occurence: number;
    final_mark: number | null;
    status: string;
    "validated?": boolean | null;
    current_team_id: number;
    project: {
        id: number;
        name: string;
        slug: string;
        parent_id: number | null;
    };
    cursus_ids: number[];
    user: {
        id: number;
        login: string;
        url: string;
    };
    teams: {
        id: number;
        name: string;
        url: string;
        final_mark: number | null;
        project_id: number;
        created_at: string;
        updated_at: string;
        status: string;
        terminating_at: string | null;
        users: {
            id: number;
            login: string;
            url: string;
            leader: boolean;
            occurence: number;
            validated: boolean;
            projects_user_id: number;
        }[];
        "locked?": boolean;
        "validated?": boolean | null;
        "closed?": boolean | null;
        repo_url: string | null;
        repo_uuid: string;
        locked_at: string;
        closed_at: string | null;
        project_session_id: number;
    }[];
}

export interface ProjectsUsersFilter extends BaseFilter {
    id: string;
    project_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    occurence: string;
    final_mark: string;
    retriable_at: string;
    marked_at: string;
    cursus: string;
    campus: string;
    retriable: string;
    marked: string;
}

class ProjectsUsersClass extends Endpoint<ProjectsUser, ProjectsUsersFilter> {

    constructor() {
        super("/v2/projects_users");
    }

    getFromUser(id_or_login: number | string) {
        return EndpointRequest.get<ProjectsUser[], ProjectsUsersFilter>(`/v2/users/${id_or_login}/projects_users`); 
    }

}

const ProjectsUsers = new ProjectsUsersClass();

export default ProjectsUsers;