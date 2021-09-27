import { observer } from "mobx-react";
import { ScaleTeamsFilter } from "../connector/scale_teams/scale_teams";
import { UserFilter } from "../connector/users/users";
import FilterForm, { FilterFormProps } from "../FilterForm/FilterForm";
import UsersStore from "./UsersStore";


class UsersFilterForm extends FilterForm<UserFilter> {

    get filter() {
        return UsersStore.filter;
    }
//id, login, email, created_at, updated_at, pool_year, pool_month, kind, status, primary_campus_id, first_name, last_name, staff?
    constructor(props: FilterFormProps) {
        super(props);
        this.filterFields = [
            "id",
            "login",
            "email",
            "created_at",
            "updated_at",
            "pool_year",
            "pool_month",
            "kind",
            "status",
            "primary_campus_id",
            "first_name",
            "last_name",
            "staff?",
        ];
    }
}

export default observer(UsersFilterForm);