import Endpoint, { BaseFilter, EndpointRequest } from "../endpoint";

export interface Campus {
    id: number;
    name: string;
    time_zone: string;
    language: {
        id: number;
        name: string;
        identifier: string;
    };
    users_count: number;
    vogsphere_id: number | null;
    endpoint: string | null;
}

export interface CampusFilter extends BaseFilter {
    
}

class CampusClass extends Endpoint<Campus, CampusFilter> {

    constructor() {
        super("/v2/campus");
    }

}

const Campus = new CampusClass();

export default Campus;