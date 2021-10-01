import { observer } from "mobx-react";
import { DataGrid, GridCellProps } from '@mui/x-data-grid';
import UsersStore from "./UsersStore";
import UsersFilter from "./UsersFilter";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";
import { ChangeEvent, useState } from "react";
import { runInAction } from "mobx";

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        
    },
    errorText: {
        color: "red",
    }
}));

interface UsersTableProps {

}

const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "login", headerName: "Login", width: 150 },
    { field: "url", headerName: "URL", width: 300 },
    { field: "created_at", headerName: "Created At", width: 250 },
    { field: "updated_at", headerName: "Updated At", width: 250 },
    { field: "", headerName: "Action", disableClickEventBubbling: true,
        renderCell: (params: any) => <Button onClick={
            () => {
                UsersStore.selectUser(params.row);
                UsersStore.openChangePasswordDialog();
            }
        }>Change Password</Button>, width: 250 }
];

const UsersTable = observer((props: UsersTableProps) => {
    const classes = useStyles();
    const [ newPasswordInDialog, setNewPasswordInDialog ] = useState("");

    if(!UsersStore.synching && UsersStore.users[UsersStore.currentPage] === undefined) {
        UsersStore.getUsers();
    }

    return <div style={{ height: "100vh" }}>
        <UsersFilter />
        <Button onClick={() => {
                    UsersStore.resetUsers();
                    UsersStore.getUsers();
                }}
                disabled={UsersStore.synching}>
            {UsersStore.synching ? <CircularProgress /> : "Refresh"}
        </Button>
        <DataGrid
                rows={UsersStore.users[UsersStore.currentPage] ? [ ...UsersStore.users[UsersStore.currentPage] ] : []}
                columns={columns}
                paginationMode="server"
                page={UsersStore.currentPage - 1}
                pageSize={30}
                rowCount={1000}
                pagination
                loading={UsersStore.synching}
                onPageChange={(newPage) => runInAction(() => UsersStore.currentPage = newPage + 1)}
                />

        <Dialog open={UsersStore.changePasswordDialogOpen}
                onClose={() => {
                    UsersStore.closeChangePasswordDialog();
                    UsersStore.deselectUser();
                }}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Change the password of user {UsersStore.selectedUser?.login} by typing the password below.
                    { (UsersStore.changePasswordErrors) && <Typography
                            className={classes.errorText}>You have errors with the following fields:</Typography> }
                    { UsersStore.changePasswordErrors ?
                            Object.keys(UsersStore.changePasswordErrors).map(errorKey => (<Typography
                                    className={classes.errorText}>
                        <b>{errorKey}: </b>
                        {UsersStore.changePasswordErrors && UsersStore.changePasswordErrors[errorKey].join(", ")}
                    </Typography>)) : null }
                </DialogContentText>
                <TextField
                        autoFocus
                        id="password"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={newPasswordInDialog}
                        onChange={(ev: ChangeEvent<HTMLInputElement>) => setNewPasswordInDialog(ev.target.value)}
                        />
                <DialogActions>
                    <Button onClick={() => UsersStore.changePassword(UsersStore.selectedUser!!, newPasswordInDialog)}
                            disabled={UsersStore.selectedUser && UsersStore.changingPassword[UsersStore.selectedUser.login]}>
                        { (UsersStore.selectedUser && UsersStore.changingPassword[UsersStore.selectedUser.login]) ? <CircularProgress /> : "Confirm" }
                    </Button>
                    <Button onClick={() => {
                        UsersStore.closeChangePasswordDialog();
                        UsersStore.deselectUser();
                    }}>Cancel</Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    </div>
});

export default UsersTable;