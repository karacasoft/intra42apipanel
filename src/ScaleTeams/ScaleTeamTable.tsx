import { Button, TableRow, Table, TableBody, TableHead, TableContainer, Theme, TableCell, LinearProgress, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/styles';
import { observer } from "mobx-react";
import ScaleTeamFilterForm from "./ScaleTeamFilter";
import ScaleTeamItem from './ScaleTeamItem';
import ScaleTeamStore from './ScaleTeamStore';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(2),
    }
}));

interface ScaleTeamTableProps {

}

const ScaleTeamTable = observer((props: ScaleTeamTableProps) => {
    const classes = useStyles();

    return <div className={classes.root}>
        <ScaleTeamFilterForm />
        <Button variant="contained"
                onClick={() => ScaleTeamStore.getScaleTeams()}>Search All</Button>
        <Button variant="contained"
                onClick={() => ScaleTeamStore.getUserScaleTeams()}>Search My Scale Teams</Button>
        {
            ScaleTeamStore.gettingScaleTeams &&
                <LinearProgress />
        }
        <TableContainer>
            <Table>
                <TableHead>
                    <TableCell>ID</TableCell>
                    <TableCell>Corrected Name</TableCell>
                    <TableCell>Corrector Login</TableCell>
                </TableHead>
                <TableBody>
                {
                    ScaleTeamStore.scaleTeams.map(scaleTeam => (
                        <ScaleTeamItem item={scaleTeam} />
                    ))
                }
                
                {
                    ScaleTeamStore.scaleTeams.length === 0 &&
                        <TableRow>
                            <TableCell rowSpan={4} colSpan={3} align="center">
                                <Typography>No data :/</Typography>
                            </TableCell>
                        </TableRow>
                }
                </TableBody>
            </Table>
        </TableContainer>
    </div>;
});

export default ScaleTeamTable;