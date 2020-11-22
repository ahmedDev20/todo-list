import { createSlice, createSelector } from '@reduxjs/toolkit';
import { apiCallBegan } from './api';

// Reducers
const slice = createSlice({
  name: 'todos',
  initialState: {
    list: [],
    loading: false,
    todoAdded: false,
    todoRemoved: false,
    todoCompleted: false,
    todoUncompleted: false,
  },
  reducers: {
    todosRequested: (todos, action) => {
      todos.loading = true;
    },

    todosReceived: (todos, action) => {
      todos.list = action.payload;
      todos.loading = false;
    },

    todosRequestFailed: (todos, action) => {
      todos.loading = false;
    },

    todoComing: (todos, action) => {
      todos.todoAdded = false;
    },

    todoAdded: (todos, action) => {
      todos.list.push(action.payload);
      todos.todoAdded = true;
    },

    todoWillComplete: (todos, action) => {
      todos.todoCompleted = false;
    },

    todoCompleted: (todos, action) => {
      const index = todos.list.findIndex(todo => todo._id === action.payload._id);
      todos.list[index].completed = action.payload.completed;
      todos.todoCompleted = true;
    },

    todoWillUncomplete: (todos, action) => {
      todos.todoUncompleted = false;
    },

    todoUncompleted: (todos, action) => {
      const index = todos.list.findIndex(todo => todo._id === action.payload._id);
      todos.list[index].completed = action.payload.completed;
      todos.todoUncompleted = true;
    },

    todoLeaving: (todos, action) => {
      todos.todoRemoved = false;
    },

    todoRemoved: (todos, action) => {
      const index = todos.list.findIndex(todo => todo._id === action.payload.found._id);
      todos.list.splice(index, 1);
      todos.todoRemoved = true;
    },
  },
});

export default slice.reducer;
export const {
  todosRequested,
  todosReceived,
  todosRequestFailed,
  todoComing,
  todoAdded,
  todoWillComplete,
  todoCompleted,
  todoWillUncomplete,
  todoUncompleted,
  todoLeaving,
  todoRemoved,
} = slice.actions;

// Action creators
export const getTodosByUser = id =>
  apiCallBegan({
    url: `todos/${id}`,
    method: 'get',
    onStart: todosRequested.type,
    onSuccess: todosReceived.type,
    onError: todosRequestFailed.type,
  });

export const addTodo = todo =>
  apiCallBegan({
    url: `/todos/`,
    method: 'post',
    data: todo,
    onStart: todoComing.type,
    onSuccess: todoAdded.type,
  });

export const completeTodo = id =>
  apiCallBegan({
    url: `/todos/${id}`,
    method: 'patch',
    data: { completed: true },
    onStart: todoWillComplete.type,
    onSuccess: todoCompleted.type,
  });

export const uncompleteTodo = id =>
  apiCallBegan({
    url: `/todos/${id}`,
    method: 'patch',
    data: { completed: false },
    onStart: todoWillUncomplete.type,
    onSuccess: todoUncompleted.type,
  });

export const removeTodo = id =>
  apiCallBegan({
    url: `/todos/${id}`,
    method: 'delete',
    onStart: todoLeaving.type,
    onSuccess: todoRemoved.type,
  });

// Selectors
export const getCompletedTodos = createSelector(
  state => state.entities.todos,
  todos => todos.list.filter(todo => todo.completed)
);

export const getTasks = createSelector(
  state => state.entities.todos,
  todos => todos.list.filter(todo => !todo.completed)
);
