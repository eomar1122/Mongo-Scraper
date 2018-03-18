const express = require('express');
const router = express.Router();
const db = require("../models");

router.get('/save/:id', function(req,res) {
  db.Article
    .update({_id: req.params.id},{saved: true})
    .then(function(result) {
      res.redirect('/');
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.get('/viewSaved', function(req, res) {
  db.Article
    .find({})
    .then(function(result) {
      res.render('savedArticles', {articles:result});
    })
    .catch(function(err) {
      res.json(err);
    });
});

router.delete('/deleteArticle/:id', function(req,res){
  db.Article
    .remove({_id: req.params.id})
    .then(function(result) {
      res.json(result);
    })
    .catch(function(err) {
      res.json(err);
    });
});


module.exports = router;
