const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/', auth,  [
    check('name', 'Necesita de un nombre').not().isEmpty(),
    check('createdTo', 'Necesita de un projecto').not().isEmpty()
] ,taskController.createTask);
    
router.get('/', auth, taskController.getTasks);

router.put('/:id', auth, taskController.udpateTask);

router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;