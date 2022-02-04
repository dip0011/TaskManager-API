const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const Task = require('../db/models/task');

router.post('/tasks', auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try{
        await task.save();
        res.status(201).send(task)
    }
    catch(error){
        res.status(400).send(error)
    }
});

// GET /tasks?compeleted=true
// GET /tasks?limit=10&skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res)=>{
    const match = {};
    const sort = {};

    if(req.query.compeleted){
        match.compeleted = req.query.compeleted === 'true';
    }

    if(req.query.sortBy){
        const part = req.query.sortBy.split(':');
        sort[part[0]] = part[1] === 'desc' ? -1 : 1
    }

    try{
        // const tasks = await Task.find({owner:req.user._id});
        await req.user.populate({
            path: 'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks)
    }
    catch(error){
        res.status(500).send(error)
    }
});

router.get('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id;

    try{
        const task = await Task.findOne({_id, owner:req.user._id});
        if(!task){
            return res.status(404).send({
                error: 'No Task Found!'
            });
        }
        res.status(200).send(task)
    }
    catch(error){
        res.status(500).send(error)
    }
});

router.patch('/tasks/:id', auth, async (req, res)=>{
    const _id = req.params.id;

    const updates = Object.keys(req.body);
    const allowedUpdate = ['description', 'compeleted'];
    const isValidOperation = updates.every((update)=> allowedUpdate.includes(update));

    if(!isValidOperation){
        return res.status(412).send({error:'Invalid Updates!'})
    }
    try{
        const task = await Task.findOne({_id, owner: req.user._id});        

        if(!task){
            return res.status(404).send({error: 'No Task Found!'});
        }
        updates.forEach((update) => task[update]=req.body[update]);
        await task.save();

        res.status(202).send(task);

    }
    catch(error){
        res.status(500).send()
    }
});

router.delete('/tasks/:id', auth, async(req, res)=>{
    const _id = req.params.id;

    try{
        const task = await Task.findOneAndDelete({_id, owner:req.user._id});

        if(!task){
            return res.status(404).send({error: 'No Task Found!'});
        }
        res.status(200).send(task);
    }
    catch(error){
        res.status(500).send();
    }
});

module.exports = router;