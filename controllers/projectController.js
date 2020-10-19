const Project = require('../models/Project');
const { validationResult } = require('express-validator');

exports.createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;

    try {
        // Crear un nuev
        const project = new Project(req.body);
        project.createdBy = req.user.id;

        project.save();
        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id }).sort({createdAt: -1});
        res.json({ projects });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo algun error');
    }
}

exports.updateProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;
    const newProject = {};

    if (name) newProject.name = name;

    try {

        let project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ "msg": "Projecto no encontrado" });

        if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ "msg": "No autorizado" });

        project = await Project.findByIdAndUpdate({_id: req.params.id}, { $set: newProject }, { new: true });

        res.json(project);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo algun error');
    }
}

exports.deleteProject = async (req, res) => {
    try {

        let project = await Project.findById(req.params.id);

        if (!project) return res.status(404).json({ "msg": "Projecto no encontrado" });

        if (project.createdBy.toString() !== req.user.id) return res.status(401).json({ "msg": "No autorizado" });

        await Project.findOneAndRemove({ _id : req.params.id });

        res.json({ msg: 'Proyecto Eliminado' });
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo algun error');
    }
}