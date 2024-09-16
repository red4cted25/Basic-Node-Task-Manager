const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const PORT = 5000
const path = require('path')

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs')

// Load tasks from the JSON file
const getTasks = () => {
    const data = fs.readFileSync('./data/tasks.json', 'utf8')
    return JSON.parse(data)
}

const saveTasks = (tasks) => {
    fs.writeFileSync('./data/tasks.json', 'utf8', JSON.stringify(tasks, null, 2))
}

// Routes

// GET: Show all tasks
app.get('/', (req, res) => {
    const tasks = getTasks()
    res.render('index', { tasks })
})

// POST: Add a new task
app.post('/tasks', (req, res) => {
    const tasks = getTasks();
    const newTask = {
        id: tasks.length + 1,
        name: req.body.name,
        date: req.body.date,
        description: req.body.description
    };
    tasks.push(newTask);
    saveTasks(tasks);
    res.redirect('/');
})

// GET: Show a single task (for editing)
app.get('/tasks/:id/edit', (req, res) => {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === req.params.id);
    res.render('tasks', { task });
})

// PUT: Update a task
app.post('/tasks/:id', (req, res) => {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id == req.params.id);
    tasks[taskIndex].description = req.body.description
    tasks[taskIndex].name = req.params.name
    saveTasks(tasks);
    res.redirect('/');
});

// DELETE: Delete a task
app.post('/tasks/:id', (req, res) => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id != req.params.id);
    saveTasks(tasks);
    res.redirect('/');
})