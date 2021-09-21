import { BASE_URL } from "../../config";
import APIConnector from "../connector";

export interface DetailedTokenInfo {
    resource_owner_id: number;
    scopes: string[];
    expires_in_seconds: number;
    application: {
        uid: string,
    };
    created_at: number;
}

export interface TokenUserInfo {
    achievements: any[];
    anonymize_date: string;
    campus: {
        active: boolean;
        address: string;
        city: string;
        country: string;
        default_hidden_phone: boolean;
        email_extension: string;
        facebook: string;
        id: number;
        name: string;
        time_zone: string;
        twitter: string;
        users_count: number;
        vogsphere_id: number;
        website: string;
        zip: string;
    }[];
    campus_users: {
        campus_id: number;
        created_at: string;
        id: number;
        is_primary: boolean;
        updated_at: string;
        user_id: number;
    }[];
    correction_point: number;
    created_at: string;
    cursus_users: {
        begin_at: string;
        blackholed_at: string | null;
        created_at: string;
        cursus: {
            created_at: string;
            id: number;
            name: string;
            slug: string;
        }
        cursus_id: number;
        end_at: string | null;
        grade: number | null;
        has_coalition: boolean;
        id: number;
        level: number;
        skills: any[];
        updated_at: string;
        user: {
            created_at: string;
            id: number;
            login: string;
            updated_at: string;
            url: string;
        }
    }[];
    displayname: string;
    email: string;
    expertises_users: {
        contact_me: boolean;
        created_at: string;
        expertise_id: number;
        id: number;
        interested: boolean;
        user_id: number;
        value: number;
    }[];
    first_name: string;
    groups: any[];
    id: number;
    image_url: string;
    languages_users: {
        created_at: string;
        id: number;
        language_id: number;
        position: number;
        user_id: number;
    }[];
    last_name: string;
    location: string | null;
    login: string;
    partnerships: any[];
    patroned: any[];
    patroning: any[];
    phone: string;
    pool_month: any;
    pool_year: any;
    projects_users: {
        created_at: string;
        current_team_id: number;
        cursus_ids: number[];
        final_mark: number | null;
        id: number;
        marked: false;
        marked_at: string | null;
        occurrence: number;
        project: {
            id: number;
            name: string;
            parent_id: number | null;
            slug: string;
        }
        retriable_at: string | null;
        status: string;
        updated_at: string;
        "validated?": boolean | null;
    }[];
    roles: {
        id: number;
        name: string;
    }[];
    "staff?": boolean;
    titles: any[];
    titles_users: any[];
    updated_at: string;
    url: string;
    usual_first_name: string | null;
    usual_full_name: string;
    wallet: number;
}

class TokenEndpointClass {

    getTokenInfo() {
        return APIConnector.get<DetailedTokenInfo>(`${BASE_URL}/oauth/token/info`);
    }

    getTokenUserInfo() {
        return APIConnector.get<TokenUserInfo>(`${BASE_URL}/v2/me`);
    }
}

const TokenEndpoint = new TokenEndpointClass();

export default TokenEndpoint;