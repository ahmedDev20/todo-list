import React from 'react';
import { useDispatch } from 'react-redux';
import { completeTodo, removeTodo, uncompleteTodo } from '../store/todos';
import moment from 'moment';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import { green, red, orange } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core';
import 'animate.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
      contrastText: 'white',
    },
    secondary: {
      main: red[500],
    },
  },
});

const useStyles = makeStyles(theme => ({
  todoShow: {
    animation: 'fadeIn',
    animationDuration: '0.4s',
  },
  completed: {
    backgroundColor: 'lightgray',
    '&  h2': {
      textDecoration: 'line-through',
    },
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

function Todo({ _id, title, completed, createdAt }) {
  const dispatch = useDispatch();
  const classes = useStyles();

  return (
    <Card className={`${completed && classes.completed} ${classes.todoShow}`}>
      <CardContent className={classes.cardContent}>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>
        <Typography style={{ fontSize: '10px' }} color="textSecondary">
          {moment(createdAt).format('dddd, MMMM Do YYYY')}
        </Typography>
      </CardContent>
      <CardActions>
        <MuiThemeProvider theme={theme}>
          {completed ? (
            <Button
              variant="contained"
              style={{ backgroundColor: orange[500], color: 'white' }}
              onClick={() => dispatch(uncompleteTodo(_id))}
              className={classes.button}
            >
              Mark as uncompleted
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(completeTodo(_id))}
              className={classes.button}
            >
              Mark as completed
            </Button>
          )}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => dispatch(removeTodo(_id))}
            startIcon={<DeleteIcon />}
          >
            DELETE
          </Button>
        </MuiThemeProvider>
      </CardActions>
    </Card>
  );
}

export default Todo;
