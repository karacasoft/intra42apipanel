import { Table, TableCell, TableRow } from "@material-ui/core";
import { observer } from "mobx-react";
import { ScaleTeam } from "../connector/scale_teams/scale_teams";

interface ScaleTeamItemProps {
    item: ScaleTeam;
}

const ScaleTeamItem = observer((props: ScaleTeamItemProps) => {
    return <TableRow>
        <TableCell>{props.item.id}</TableCell>
        <TableCell>{props.item.team.name}</TableCell>
        <TableCell>{props.item.corrector.login}</TableCell>
        <TableCell>{new Date(props.item.begin_at).toTimeString()}</TableCell>
    </TableRow>;
});

export default ScaleTeamItem;