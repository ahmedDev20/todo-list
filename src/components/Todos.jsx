import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { addTodo, getTasks, getCompletedTodos, getTodosByUser } from '../store/todos';
import Todo from './Todo';
import NavBar from './NavBar';

import { createMuiTheme, makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { List, Typography, Box, useMediaQuery, Grid } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { blue } from '@material-ui/core/colors';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import useSound from 'use-sound';
import addedSfx from '../assets/added.mp3';
import removedSfx from '../assets/removed.mp3';
import completedSfx from '../assets/completed.mp3';
import uncompletedSfx from '../assets/uncompleted.mp3';

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
    minHeight: '90vh',
    margin: '20px auto',
    backgroundColor: '#f6f6f6',
  },
  rootMobile: {
    margin: 0,
    width: '100%',
    height: '100%',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(3),
    height: '150px',
    marginBottom: '30px',
  },
  todosSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '5px',
  },
}));

function Todos() {
  const store = useStore();
  const dispatch = useDispatch();
  const { uid } = store.getState().auth.currentUser;
  const {
    loading,
    todoAdded,
    todoRemoved,
    todoCompleted,
    todoUncompleted,
  } = store.getState().entities.todos;

  const tasks = useSelector(getTasks);
  const completed = useSelector(getCompletedTodos);
  const [todoTitle, setTodoTitle] = useState('');
  const titleInput = useRef();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();

  const [playAdded] = useSound(addedSfx, { volume: 0.25 });
  const [playRemoved] = useSound(removedSfx, { volume: 0.25 });
  const [playCompleted] = useSound(completedSfx, { volume: 0.25 });
  const [playUncompleted] = useSound(uncompletedSfx, { volume: 0.25 });

  const handleAddTodo = e => {
    e.preventDefault();
    if (!todoTitle.trim().length) return e.target.reset();

    setTodoTitle('');
    titleInput.current.value = '';

    dispatch(
      addTodo({
        userId: uid,
        title: todoTitle,
      })
    );
  };

  useEffect(() => {
    if (todoAdded) playAdded();
  }, [todoAdded, playAdded]);

  useEffect(() => {
    if (todoRemoved) playRemoved();
  }, [todoRemoved, playRemoved]);

  useEffect(() => {
    if (todoCompleted) playCompleted();
  }, [todoCompleted, playCompleted]);

  useEffect(() => {
    if (todoUncompleted) playUncompleted();
  }, [todoUncompleted, playUncompleted]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(getTodosByUser(uid));
    }
    fetchData();
  }, [dispatch, uid]);

  return (
    <MuiThemeProvider theme={theme}>
      <Paper elevation={3} className={`${classes.root} ${isMobile ? classes.rootMobile : ''}`}>
        <NavBar />

        <Grid container>
          <Grid item xs={12} sm={6} style={{ margin: 'auto' }}>
            <form className={classes.form} onSubmit={handleAddTodo}>
              <Paper className={classes.formContainer}>
                <TextField
                  placeholder="what are you up to ?"
                  variant="outlined"
                  fullWidth
                  inputRef={titleInput}
                  onChange={e => setTodoTitle(e.currentTarget.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<AddCircleOutline />}
                >
                  Add
                </Button>
              </Paper>
            </form>
          </Grid>

          <Grid container>
            <Grid item xs={12} sm={6} className={classes.todosSection}>
              <Typography variant="h5">Tasks 📃</Typography>

              {!loading && tasks.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                  No tasks added yet.
                </Typography>
              ) : (
                <List>
                  {(loading ? Array.from(new Array(3)) : tasks).map(todo => (
                    <Box key={todo?._id} width={400} mb={3}>
                      {todo ? (
                        <Todo
                          _id={todo._id}
                          userId={todo.userId}
                          title={todo.title}
                          createdAt={todo.createdAt}
                        />
                      ) : (
                        <Skeleton variant="rect" width={400} height={100} />
                      )}
                    </Box>
                  ))}
                </List>
              )}
            </Grid>

            <Grid item xs={12} sm={6} className={classes.todosSection}>
              <Typography variant="h5">Completed 👑</Typography>

              {!loading && completed.length === 0 ? (
                <Typography variant="h6" color="textSecondary">
                  No completed tasks.
                </Typography>
              ) : (
                <List>
                  {(loading ? Array.from(new Array(3)) : completed).map(todo => (
                    <Box key={todo?._id} width={400} mb={3}>
                      {todo ? (
                        <Todo
                          _id={todo._id}
                          userId={todo.userId}
                          title={todo.title}
                          completed={todo.completed}
                          createdAt={todo.createdAt}
                        />
                      ) : (
                        <Skeleton variant="rect" width={400} height={100} />
                      )}
                    </Box>
                  ))}
                </List>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </MuiThemeProvider>
  );
}

export default Todos;
