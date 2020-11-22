import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { auth, uiConfig } from '../firebase';
import { authRequested, getCurrentUser, userLoggedOut } from '../store/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Joi from 'joi';

import { Button, Divider, makeStyles, TextField, Typography } from '@material-ui/core';
import 'animate.css';
import spinIcon from '../assets/Rolling.svg';

import useSound from 'use-sound';
import clickedSfx from '../assets/clicked.mp3';
import errorSfx from '../assets/error.mp3';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      animation: 'fadeIn',
      animationDuration: '0.6s',
    },
  },
  form: {
    padding: '20px',
    '& > *': {
      margin: '10px 0',
    },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    textAlign: 'center',
    width: '100%',
  },
  spinner: {
    width: 40,
    animation: 'fadeIn',
    animationDuration: '0.2s',
  },
}));

function RegisterForm() {
  const { loading } = useSelector(getCurrentUser);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const classes = useStyles();

  const [playClicked] = useSound(clickedSfx, { volume: 0.75 });
  const [playError] = useSound(errorSfx, { volume: 0.75 });

  const schema = Joi.object({
    email: Joi.string()
      .label('Email')
      .email({ tlds: { allow: ['com', 'net', 'fr'] } })
      .required(),
    pass: Joi.string().label('Password').min(6).required(),
  });

  const validate = () => {
    const options = { abortEarly: false };
    const { error } = schema.validate({ email, pass }, options);
    if (error) {
      const errs = {};
      for (let item of error.details) {
        errs[item.path[0]] = item.message.replace(/['"]+/g, '');
      }
      setErrors(errs);

      return;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const valid = validate();
    if (!valid) return;

    playClicked();

    try {
      dispatch(authRequested());
      await auth.createUserWithEmailAndPassword(email, pass);
    } catch (error) {
      dispatch(userLoggedOut());
      playError();
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Sorry, this email address is already in use by another account.' });
      } else {
        dispatch({ type: 'error', payload: { message: 'sorry, network error' } });
      }
    }
  };

  return (
    <div className={classes.root}>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          error={!!errors.email}
          helperText={errors.email && errors.email}
          fullWidth
          onChange={e => setEmail(e.target.value)}
          type="email"
          label="Email"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          error={!!errors.pass}
          helperText={errors.pass && errors.pass}
          fullWidth
          onChange={e => setPass(e.target.value)}
          type="password"
          label="Password"
          InputLabelProps={{
            shrink: true,
          }}
        />
        {loading ? (
          <img src={spinIcon} alt="spin" className={classes.spinner} />
        ) : (
          <Button type="submit" variant="contained" color="secondary">
            REGISTER
          </Button>
        )}
      </form>
      <div className={classes.divider}>
        <Divider width="40%" />
        <Typography variant="body1" color="textSecondary">
          Or
        </Typography>
        <Divider width="40%" />
      </div>
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
    </div>
  );
}

export default RegisterForm;
