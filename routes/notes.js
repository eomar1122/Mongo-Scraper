//Dependencies
var express = require('express');
var router = express.Router();
var db = require("../models");

//get notes for specific article
router.get('/getNotes/:id', function (req,res){
  db.Article
    .findOne({_id: req.params.id})
    .populate('notes')
    .then(function(results) {
      res.json(results);
    })
    .catch(function(err) {
      res.json(err)
    });
});

//get single note by id
router.get('/getSingleNote/:id', function (req,res) {
  db.Note
  .findOne({_id: req.params.id})
  .then(function(result){
    res.json(result);
  })
  .catch(function(err) {
    res.json(err);
  });
});

//post route to create a new note in the database
router.post('/createNote', function (req,res){
  var { title, body, articleId } = req.body;
  var note = {
    title,
    body
  }
  db.Note
    .create(note)
    .then(function(result){
      db.Article
        .findOneAndUpdate({ _id: articleId }, { $push: { notes: result._id }}, { new:true })
        .then(function(data) {
          res.json(result);
        })
        .catch(function(err) {
          res.json(err);
        });
    })
    .catch(err => res.json(err));
});

//post route to delete a note
router.post('/deleteNote', function(req,res) {
  var {articleId, noteId} = req.body
  db.Note
    .remove({_id: noteId})
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.json(err);
    });
});


module.exports = router;
