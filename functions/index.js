const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const monk = require('monk');
const joi = require('joi');

require('dotenv').config();

const app = express();
const { mongodb } = functions.config();

// Middlewares
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Database logic
const db = monk(mongodb.conn);
const todos = db.get('todos');

// Validation
const todoAddSchema = joi.object({
  title: joi.string().required(),
  userId: joi.string(),
});

const todoUpdateSchema = joi.object({
  completed: joi.boolean().required(),
});

// Get all todos
app.get('/todos', async (req, res) => {
  const data = await todos.find();
  res.json(data);
});

// Get todos by user id
app.get('/todos/:id', async (req, res) => {
  const data = await todos.find();
  const filtred = data.filter(todo => todo.userId === req.params.id);
  res.json(filtred);
});

// Add a todo
app.post('/todos', async (req, res) => {
  try {
    const todo = await todoAddSchema.validateAsync({ ...req.body });
    const inserted = await todos.insert({ ...todo, completed: false, createdAt: Date.now() });
    res.status(201).send(inserted);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Edit a todo
app.patch('/todos/:id', async (req, res) => {
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
app.delete('/todos/:id', async (req, res) => {
  const found = await todos.findOneAndDelete({ _id: req.params.id });
  if (found) {
    res.status(201).json({ message: `Deleted successfuly.`, found });
  } else {
    res.status(400).json({ message: `No item found with the id ${req.params.id}` });
  }
});

exports.api = functions.https.onRequest(app);
