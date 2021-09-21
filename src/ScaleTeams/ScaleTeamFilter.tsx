import { observer } from "mobx-react";
import { ScaleTeamsFilter } from "../connector/scale_teams/scale_teams";
import FilterForm, { FilterFormProps } from "../FilterForm/FilterForm";
import ScaleTeamStore from "./ScaleTeamStore";


class ScaleTeamFilterForm extends FilterForm<ScaleTeamsFilter> {

    get filter() {
        return ScaleTeamStore.filter;
    }

    constructor(props: FilterFormProps) {
        super(props);
        this.filterFields = [
            "id",
            "user_id",
            "begin_at",
            "created_at",
            "updated_at",
            "scale_id",
            "team_id",
            "comment",
            "old_feedback",
            "feedback_rating",
            "final_mark",
            "truant_id",
            "flag_id",
            "token",
            "ip",
            "internship_id",
            "filled_at",
            "campus_id",
            "future",
            "filled",
        ];
    }
}

export default observer(ScaleTeamFilterForm);