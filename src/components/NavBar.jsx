import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../store/auth';
import { auth } from '../firebase';

import {
  AppBar,
  Avatar,
  Button,
  Hidden,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import useSound from 'use-sound';
import loggedOutSfx from '../assets/loggedOut.mp3';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: 'dodgerblue',
    marginBottom: 30,
    '&  h6': {
      fontFamily: "'Racing Sans One', cursive",
      fontSize: '30px',
      flexGrow: 1,
    },
  },
  menuButton: {
    marginLeft: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function NavBar() {
  const { currentUser } = useSelector(getCurrentUser);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const classes = useStyles();

  const [playLoggedOut] = useSound(loggedOutSfx, { volume: 0.75 });

  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';

  return (
    <AppBar position="static" elevation={0} className={classes.root}>
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          TodoList App
        </Typography>
        <Hidden xsDown>
          <Avatar
            className={classes.menuButton}
            alt={currentUser.displayName}
            src={currentUser.photoURL}
          />
          <Typography className={classes.menuButton}>
            {currentUser.displayName || currentUser.email}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            className={classes.menuButton}
            onClick={() => {
              auth.signOut();
              playLoggedOut();
            }}
          >
            Log out
          </Button>
        </Hidden>

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={menuId}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose} style={{ backgroundColor: 'transparent' }}>
            <Avatar
              className={classes.menuButton}
              alt={currentUser.displayName}
              src={currentUser.photoURL}
            />
            <Typography className={classes.menuButton}>
              {currentUser.displayName || currentUser.email}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} style={{ backgroundColor: 'transparent' }}>
            <Button
              color="secondary"
              variant="contained"
              className={classes.menuButton}
              onClick={() => {
                auth.signOut();
                playLoggedOut();
              }}
            >
              Log out
            </Button>
          </MenuItem>
        </Menu>

        <Hidden smUp>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
            edge="start"
            className={classes.menuButton}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
