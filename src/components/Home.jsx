import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

import {
  AppBar,
  createMuiTheme,
  makeStyles,
  MuiThemeProvider,
  Paper,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import useSound from 'use-sound';
import switchedSfx from '../assets/switched.mp3';

const theme = createMuiTheme({
  typography: {
    fontFamily: "'Open Sans', sans-serif",
  },
  palette: {
    primary: {
      main: blue[500],
    },
  },
});

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: '30px',
    width: '80vw',
    margin: '20px auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
  },
  rootMobile: {
    margin: 0,
    width: '100%',
    height: '100vh',
  },
  appBar: {
    backgroundColor: 'dodgerblue',
    marginBottom: 50,
    '&  h6': {
      fontFamily: "'Racing Sans One', cursive",
      fontSize: '30px',
      flexGrow: 1,
    },
  },
  formsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > *': {
      marginBottom: '10px',
    },
  },
  switch: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  switchItem: {
    fontWeight: '700',
    flex: '1 0 auto',
    height: '64px',
    textAlign: 'center',
    lineHeight: '64px',
    pointerEvent: 'none',
  },
  switchItemInactive: {
    color: '#5f7d95',
    backgroundColor: 'rgba(248,250,251,0.5)',
    boxShadow: 'inset 0px -3px 10px 0px rgba(34,34,34,0.25)',
    cursor: 'pointer',
    pointerEvent: 'all',
  },
  spinner: {
    width: 40,
    animation: 'fadeIn',
    animationDuration: '0.2s',
  },
}));

function Home() {
  const [formTab, setFormTab] = useState('login');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const classes = useStyles();

  const [playSwitched] = useSound(switchedSfx, { volume: 0.75 });

  return (
    <MuiThemeProvider theme={theme}>
      <Paper elevation={3} className={`${classes.root} ${isMobile ? classes.rootMobile : ''}`}>
        <AppBar position="static" elevation={0} className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6">TodoList App</Typography>
          </Toolbar>
        </AppBar>
        <Paper className={classes.formsContainer} xs={12}>
          <div className={classes.switch}>
            <Typography
              variant="h5"
              className={`${classes.switchItem} ${
                formTab === 'register' ? classes.switchItemInactive : ''
              }`}
              gutterBottom
              onClick={() => {
                if(formTab === 'register')  playSwitched();
                setFormTab('login');
              }}
            >
              Login
            </Typography>
            <Typography
              variant="h5"
              className={`${classes.switchItem} ${
                formTab === 'login' ? classes.switchItemInactive : ''
              }`}
              gutterBottom
              onClick={() => {
                if(formTab === 'login')   playSwitched();
                setFormTab('register');
              }}
            >
              Register
            </Typography>
          </div>

          {formTab === 'login' ? <LoginForm /> : <RegisterForm />}
        </Paper>
      </Paper>
    </MuiThemeProvider>
  );
}

export default Home;
