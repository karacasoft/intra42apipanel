import { observer } from "mobx-react";
import { ScaleTeamsFilter } from "../connector/scale_teams/scale_teams";
import { UserFilter } from "../connector/users/users";
import FilterForm, { FilterFormProps } from "../FilterForm/FilterForm";
import UsersStore from "./UsersStore";


class UsersFilterForm extends FilterForm<UserFilter> {

    get filter() {
        return UsersStore.filter;
    }

    constructor(props: FilterFormProps) {
        super(props);
        this.filterFields = [
            "id",
            "created_at",
            "login",
            "updated_at",
            "url",
        ];
    }
}

export default observer(UsersFilterForm);