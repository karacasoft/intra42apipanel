import { Button, CircularProgress, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import { CLIENT_ID, REDIRECT_URI } from "../config";
import LoginStore from './LoginStore';

interface LoginProps {

}

const Login = observer((props: LoginProps) => {

    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    if(code && !LoginStore.loggingIn && !LoginStore.loggedIn && !LoginStore.loginErrorMessage) {
        LoginStore.login(code);
    }

    const encoded = encodeURI(`client_id=${CLIENT_ID}&redirect_uri=`)
    + encodeURIComponent(REDIRECT_URI) + encodeURI("&response_type=code&scope=public profile projects");
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
                onClick={() => LoginStore.login("")}>
            Login
        </Button>
        <p>{LoginStore.loginErrorMessage}</p>
    </div>;
});

export default Login;