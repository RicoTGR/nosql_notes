const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');

// http://localhost:5000/api/reg (POST)
router.post('/reg', async (req, res) => {
  if(await User.findOne({login: req.body.login})) {
    res.status(409).json({message: 'User already exist'});
  } else {
    const userData = {
      login: req.body.login,
      password: saltHashPassword(req.body.password)
    };

    let user = User(userData);
    await user.save();
    res.status(201).json(user.notes);
  }
});

// http://localhost:5000/api/auth (POST)
router.post('/auth', async (req, res) => {
  let user = await User.findOne({login: req.body.login});

  if(user) {
    if(user.password.passwordHash === sha512(req.body.password, user.password.salt).passwordHash) {
      res.status(200).json(user.notes);
    } else {
      res.status(401).json({message: 'Wrong password'});
    }
  } else {
    res.status(401).json({ message: 'User doesn\'t exist'});
  }
});

// http://localhost:5000/api/ (GET)
router.get('/', async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

// http://localhost:5000/api/change (PUT)
router.put('/', async (req, res) => {
  if(req.body.login)
    await User.updateOne({_id: req.body.id},
        {$set: {login: req.body.login}});
  if(req.body.password)
    await User.updateOne({_id: req.body.id},
        {$set: {password: saltHashPassword(req.body.password)}});
  res.status(200).json({message: 'Changed'});
});

// http://localhost:5000/api/delete/:id (DELETE)
router.delete('/:id', async (req, res) => {
  await User.remove({_id: req.params.id});
  res.status(200).json({
    message: 'Deleted'
  })
});

// http://localhost:5000/api/notes/:id (GET)
router.get('/notes/:id', async (req, res) => {
  const user = await User.find({_id: req.params.id});
  res.status(200).json(user.notes);
});

// http://localhost:5000/api/notes/:id (POST)
router.post('/notes/new/:id', async (req, res) => {
  const note = {
    title: req.body.title,
    text: req.body.text
  };

  await User.updateOne({_id: req.params.id}, {$push: {'user.notes': note}});
  let user = await User.findOne({_id: req.params.id});
  res.status(201).json(user.notes);
});

// http://localhost:5000/api/notes/edit/:index (POST)
router.post('/notes/edit/:index', async (req, res) => {
  let way = 'notes.' + req.params.index;
  await User.updateOne({'notes._id': req.body._id},
      {$set: {[way + '.title']: req.body.title,
              [way + '.text']: req.body.text}});
  let user = await User.findOne({'notes._id': req.body._id});
  res.status(200).json(user.notes);
});

// http://localhost:5000/api/notes/delete/:id (POST)
router.post('notes/delete/:id', async (req, res) => {
  await User.updateOne({'notes._id': req.params.id}, {$pull: {notes: {_id: req.params.id}}});
  let user = await User.findOne({'notes._id': req.body._id});
  res.status(200).json(user.notes);
});

function genRandomString(length){
  return crypto.randomBytes(Math.ceil(length/2))
      .toString('hex')
      .slice(0,length);
}

function sha512(password, salt){
  let hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  let value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
}

function saltHashPassword(userpassword) {
  let salt = genRandomString(16);
  return sha512(userpassword, salt);
}

module.exports = router;