import Endpoint from "../endpoint";

export interface Team {
    id: number;
    login: string;
    url: string;
    created_at: string;
    updated_at: string;
}

class TeamsClass extends Endpoint<Team> {

    constructor() {
        super("/v2/teams");
    }
}

const Teams = new TeamsClass();

export default Teams;