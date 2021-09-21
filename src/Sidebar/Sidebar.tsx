import { Link, List, ListItem, ListItemText, makeStyles, Paper, Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router";
import Login from "../Login/Login";
import LoginStore from "../Login/LoginStore";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        minHeight: "100vh",
    }
}));

interface SidebarProps {

}

const Sidebar = observer((props: SidebarProps) => {
    const classes = useStyles();
    const history = useHistory();

    return <Paper className={classes.root}>
        <Login />
        <List>
            <ListItem button
                    onClick={() => history.push("/")}>
                <ListItemText primary="Home" />
            </ListItem>
            <ListItem button
                    onClick={() => history.push("/users")}>
                <ListItemText primary="Users" />
            </ListItem>
            <ListItem button
                    onClick={() => history.push("/scaleteams")}>
                <ListItemText primary="Scale-teams" />
            </ListItem>
        </List>
    </Paper>;
});

export default Sidebar;