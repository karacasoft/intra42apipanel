import { observer } from "mobx-react";
import { DataGrid, GridCellProps } from '@mui/x-data-grid';
import UsersStore from "./UsersStore";
import UsersFilter from "./UsersFilter";
import { Button } from "@material-ui/core";

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
            () => { UsersStore.changePassword(params.row); }
        }>Change Password</Button>, width: 250 }
];

const UsersTable = observer((props: UsersTableProps) => {
    return <div style={{ height: "100vh", width: "100vw" }}>
        <UsersFilter />
        <Button onClick={() => UsersStore.getUsers()}>Refresh</Button>
        <DataGrid
                rows={[ ...UsersStore.users ]}
                columns={columns}
                />
            </div>
});

export default UsersTable;