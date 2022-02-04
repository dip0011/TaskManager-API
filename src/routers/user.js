const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const User = require('../db/models/user');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancleEmail} = require('../emails/account');

router.post('/users', async (req, res)=>{
    const user = new User(req.body);

    try{
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({user, token});
    }
    catch(error){
        res.status(400).send(error)
    }
    // ...Using Promise-then method...
    // user.save().then((result)=>{
    //     res.status(201).send(result)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // });
});

router.post('/users/login', async (req, res)=>{
    try{
        const user = await User.findByCredential(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.status(200).send({user, token});
    }
    catch(error){
        res.status(400).send(error)
    }
});

router.get('/users/me', auth, async (req, res)=>{
    res.status(200).send(req.user)
});

const upload = multer({
    limits:{
        dataSize: 100000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an Image!'));
        }
        cb(undefined, true);
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{

    const buffer = await sharp(req.file.buffer).resize({height:250, width:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();

    res.status(200).send(req.user);

}, (error, req, res, next)=>{
    res.status(400).send({error:error.message});
});

router.get('/users/:id/avatar', async (req, res)=>{
    const _id = req.params.id;
    const user = await User.findById({_id});

    res.set('content-type','image/png');
    res.status(200).send(user.avatar);
});

router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined;
    await req.user.save();

    res.status(200).send();
});

router.get('/users/:id', async (req, res)=>{
    const _id = req.params.id;

    try{
        const user = await User.findOne({name:_id});
        if(!user){
            return res.status(404).send({
                error: 'No user Found!'
            });
        }
        res.status(200).send(user)
    }
    catch(error){
        res.status(500).send()
    }
});

router.post('/users/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        });
        await req.user.save();
        res.status(200).send();
    }
    catch(error){
        res.status(500).send(error);
    }
});

router.post('/users/logoutAll', auth, async(req, res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.status(200).send();
    }
    catch(error){
        res.status(500).send(error);
    }
});

router.patch('/users/me', auth, async (req, res)=>{

    const updates = Object.keys(req.body);
    const allowedUpdate = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update)=> allowedUpdate.includes(update));

    if(!isValidOperation){
        return res.status(412).send({error:'Invalid Updates!'})
    }
    try{
        updates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save();
        res.status(202).send(req.user);

    }
    catch(error){
        res.status(500).send()
    }
});

router.delete('/users/me', auth, async(req, res)=>{

    try{
        await req.user.remove();
        sendCancleEmail(req.user.email, req.user.name);
        res.status(200).send(req.user);
    }
    catch(error){
        res.status(500).send();
    }
});

module.exports = router;