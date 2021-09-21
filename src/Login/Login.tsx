import { Button, CircularProgress, Typography } from "@material-ui/core";
import { observer } from "mobx-react";
import { useParams, useHistory } from 'react-router-dom';
import { CLIENT_ID, REDIRECT_URI } from "../config";
import APIConnector from "../connector/connector";
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
        <a href={`https://api.intra.42.fr/oauth/authorize?${encoded}`}>
            <Button
                    variant="contained"
                    color="primary"
                    fullWidth>
                Login
            </Button>
        </a>
        <p>{LoginStore.loginErrorMessage}</p>
    </div>;
});

export default Login;