const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const monk = require('monk');
const joi = require('joi');

require('dotenv').config()

const app = express();

// Middlewares
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Database logic
const db = monk(process.env.REACT_APP_DB_CONN);
const todos = db.get('todos');

db.then(() => {
  console.log('Database connected succesfully !');
}).catch(error => {
  console.log('Could not connect to Database.');
});

// Validation
const todoAddSchema = joi.object({
  title: joi.string().required(),
  userId: joi.string(),
  completed: false,
});

const todoUpdateSchema = joi.object({
  completed: joi.boolean().required(),
});

// Get all todoa
app.get('/api/todos', async (req, res) => {
  const data = await todos.find();
  res.json(data);
});

// Get todos by user id
app.get('/api/todos/:id', async (req, res) => {
  const data = await todos.find();
  const filtred = data.filter(todo => todo.userId === req.params.id);
  res.json(filtred);
});

// Add a todo
app.post('/api/todos/', async (req, res) => {
  try {
    const todo = await todoAddSchema.validateAsync({ ...req.body, completed: false });
    const inserted = await todos.insert(todo);
    res.status(201).send(inserted);
  } catch (error) {
    // res.status(400).send(error.details[0].message);
    res.status(400).send(error);
  }
});

// Edit a todo
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const reqData = await todoUpdateSchema.validateAsync(req.body);
    const updated = await todos.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $set: { completed: reqData.completed },
      }
    );
    res.status(201).send(updated);
  } catch (error) {
    res.status(400).send(error.details[0].message);
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const found = await todos.findOneAndDelete({ _id: req.params.id });
  if (found) {
    res.status(201).json({ message: `Deleted successfuly.`, found });
  } else {
    res.status(400).json({ message: `No item found with the id ${req.params.id}` });
  }
});

app.listen(9000, () => {
  console.log('Node server started on port 9000.');
});
