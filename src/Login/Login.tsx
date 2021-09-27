import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@material-ui/core";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useState } from "react";
import { ASK_FOR_APP_CREDENTIALS, CLIENT_ID, REDIRECT_URI } from "../config";
import LoginStore from './LoginStore';

interface LoginProps {

}

interface APICredentialsDialogProps {
    open: boolean;
    onClose: () => void;
    onLogin: () => void;
}

const APICredentialsDialog = observer((props: APICredentialsDialogProps) => {
    return <Dialog
        open={props.open}
        onClose={props.onClose}
    >
        <DialogTitle>API Credentials</DialogTitle>
        <DialogContent>
            <DialogContentText>Enter the credentials of your Intra 42 API application</DialogContentText>
            <TextField
                    fullWidth
                    label="API Client ID"
                    value={LoginStore.apiClientId}
                    onChange={(ev) => runInAction(() => LoginStore.apiClientId = ev.target.value)}
            />
            <TextField
                    fullWidth
                    label="API Client Secret"
                    value={LoginStore.apiClientSecret}
                    onChange={(ev) => runInAction(() => LoginStore.apiClientSecret = ev.target.value)}
            />
            <p>{LoginStore.loginErrorMessage}</p>
        </DialogContent>
        <DialogActions>
            <Button onClick={props.onLogin}>Login</Button>
        </DialogActions>
    </Dialog>
});

const Login = observer((props: LoginProps) => {
    const [ dialogOpen, setDialogOpen ] = useState(false);
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    if(code && !LoginStore.loggingIn && !LoginStore.loggedIn && !LoginStore.loginErrorMessage) {
        LoginStore.login();
    }

    const onClickLogin = () => {
        if(ASK_FOR_APP_CREDENTIALS) {
            setDialogOpen(true);
        } else {
            LoginStore.login();
        }
    };

    if(LoginStore.loggingIn) {
        return <CircularProgress />;
    }

    if(LoginStore.loggedIn) {
        return <div>
            <Typography>Logged in as {LoginStore.tokenUserInfo?.usual_full_name}</Typography>
            <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => { LoginStore.logout() }}>
                Logout
            </Button>
        </div>
    }

    return <div>
        <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onClickLogin}>
            Login
        </Button>
        <p>{LoginStore.loginErrorMessage}</p>
        <APICredentialsDialog open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onLogin={() => {
                    LoginStore.login();
                    setDialogOpen(false);
                }}/>
    </div>;
});

export default Login;