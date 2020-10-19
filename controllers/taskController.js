const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createTask = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { createdTo } = req.body;

    try {

        const project = await Project.findById(createdTo);
        
        if (!project) return res.status(400).json({ msg: 'Proyecto no encontrado' });

        if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ "msg": "No autorizado" });

        const task = new Task(req.body);
        await task.save();

        res.json(task);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.getTasks = async (req, res) => {

    const { createdTo } = req.query;

    try {

        const project = await Project.findById(createdTo);
        
        if (!project) return res.status(400).json({ msg: 'Proyecto no encontrado' });

        if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ "msg": "No autorizado" });

        const tasks = await Task.find({ createdTo });

        res.json(tasks);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.udpateTask = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, state } = req.body;

    try {

        const existTask = await Task.findById(req.params.id);
        
        if (!existTask) return res.status(404).json({ msg: 'La tarea no encontrado' });

        const project = await Project.findById(existTask.createdTo);

        if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ "msg": "No autorizado" });

        const newTask = {};

        newTask.name = name;
        newTask.state = state;

        const task = await Task.findOneAndUpdate({_id: req.params.id}, newTask, { new: true });

        res.json(task);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.deleteTask = async (req, res) => {
    try {

        const existTask = await Task.findById(req.params.id);
        
        if (!existTask) return res.status(404).json({ msg: 'La tarea no encontrado' });

        const project = await Project.findById(existTask.createdTo);

        if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ "msg": "No autorizado" });

        await Task.findOneAndRemove({ _id : req.params.id });

        res.json({ msg: 'Tarea Eliminado' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}