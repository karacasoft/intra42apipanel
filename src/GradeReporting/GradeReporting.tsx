import { createStyles, Theme, makeStyles, Select, TextField, MenuItem, Button, Table, TableContainer, TableHead, TableCell, TableBody, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import { useState } from "react";
import GradeReportingStore, { PoolMonth } from "./GradeReportingStore";
import GradeReportingItem from "./ReportingItem";

interface GradeReportingProps {
    
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    
}));

const GradeReporting = observer((props: GradeReportingProps) => {
    const [ campusId, setCampusId ] = useState<string>("");
    const [ year, setYear ] = useState<string>("2021");
    const [ month, setMonth ] = useState<string>("january");
    return <div>
        <TextField
                label="Campus ID"
                value={campusId}
                onChange={(ev) => setCampusId(ev.target.value)} />
        { /* TODO: rewrite this later */}
        <Select value={year}
                onChange={(ev) => {
                    setYear(ev.target.value as string);
                }}>
            <MenuItem value="2021">2021</MenuItem>
            <MenuItem value="2020">2020</MenuItem>
        </Select>
        <Select value={month}
                onChange={(ev) => setMonth(ev.target.value as string)}>
            <MenuItem value="january">January</MenuItem>
            <MenuItem value="february">February</MenuItem>
            <MenuItem value="march">March</MenuItem>
            <MenuItem value="april">April</MenuItem>
            <MenuItem value="may">May</MenuItem>
            <MenuItem value="june">June</MenuItem>
            <MenuItem value="july">July</MenuItem>
            <MenuItem value="august">August</MenuItem>
            <MenuItem value="september">September</MenuItem>
            <MenuItem value="october">October</MenuItem>
            <MenuItem value="november">November</MenuItem>
            <MenuItem value="december">December</MenuItem>
        </Select>
        <Button
                disabled={GradeReportingStore.gettingPiscineUsers}
                onClick={() => GradeReportingStore.getPiscineUsers(parseInt(campusId), year, month as PoolMonth)}>
            Go
        </Button>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableCell>ID:login</TableCell>
                    {
                        Array.from(GradeReportingStore.projects.values()) 
                            .map(project => (<TableCell>{project.id}:{project.name}</TableCell>))
                    }
                </TableHead>
                <TableBody>
                    {GradeReportingStore.piscineUsers.map(user => (
                        <GradeReportingItem
                            key={user.id}
                            user={user}
                            piscineUserState={GradeReportingStore.piscineUsersState[user.id]} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <TextField
                multiline
                minRows={4}
                maxRows={10}
                fullWidth
                value={GradeReportingStore.allValuesCSV} />
        <Button
                onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([ GradeReportingStore.allValuesCSV ], { type: "text/plain" });
                    element.href = URL.createObjectURL(file);
                    element.download = "grades.csv";
                    document.body.appendChild(element);
                    element.click();
                }}>Download CSV</Button>
    </div>;
});

export default GradeReporting;