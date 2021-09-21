import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, makeStyles, createStyles, Theme } from '@material-ui/core';
import LoginStore from './Login/LoginStore';
import Login from './Login/Login';
import { observer } from 'mobx-react';
import UsersTable from './Users/UsersTable';
import { Route } from 'react-router';
import Sidebar from './Sidebar/Sidebar';
import ScaleTeamTable from './ScaleTeams/ScaleTeamTable';
import APIConnector from './connector/connector';
import { runInAction } from 'mobx';

APIConnector.loadToken();
if(APIConnector.token) {
  LoginStore.getTokenUserInfo();
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {

  },
  contentPage: {
    height: "100vh",
    overflowX: "auto",
    overflowY: "scroll",
  }
}));

function App() {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={3}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} className={classes.contentPage}>
        <Route path="/scaleteams">
          <ScaleTeamTable />
        </Route>
        <Route path="/users">
          <UsersTable />
        </Route>
        <Route path="/">

        </Route>
      </Grid>
    </Grid>
  );
}

export default observer(App);
