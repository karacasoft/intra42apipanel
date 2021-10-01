import { createStyles, Theme, makeStyles, TableRow, TableCell, CircularProgress } from "@material-ui/core";
import { observer } from "mobx-react";
import { User } from "../connector/users/users";
import GradeReportingStore, { PiscineUserState } from "./GradeReportingStore";

interface GradeReportingItemProps {
    user: User;
    piscineUserState?: PiscineUserState;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    
}));

const GradeReportingItem = observer((props: GradeReportingItemProps) => {
    return <TableRow>
        <TableCell>{props.user.id}:{props.user.login} {
            props.piscineUserState?.state === "loading" &&
                <CircularProgress />
        }</TableCell>
        {
            props.piscineUserState &&
            Array.from(GradeReportingStore.projects.values()).map(project => (
                <TableCell>{
                    props.piscineUserState?.state === "ready" &&
                            props.piscineUserState.data.find((projectsUser) => projectsUser.project.id === project.id)
                                    ?.final_mark
                }</TableCell>
            ))
        }
    </TableRow>;
});

export default GradeReportingItem;