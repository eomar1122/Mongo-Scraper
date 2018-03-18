//Dependencies
var express = require('express');
var cheerio = require('cheerio');
var rp = require('request-promise');
var router = express.Router();
var db = require('../models');

//route to scrape new articles
router.get("/newArticles", function(req, res) {
  //configuring options object for request-promist
  var options = {
    uri: 'https://www.nytimes.com/section/us',
    transform: function (body) {
        return cheerio.load(body);
    }
  };
  //calling the database to return all saved articles
  db.Article
    .find({})
    .then(function(savedArticles) {
      //creating an array of saved article headlines
      var savedHeadlines = savedArticles.map(function(article) {
        return article.headline
      });

        //calling request promist with options object
        rp(options)
        .then(function ($) {
          var newArticleArr = [];
          $('#latest-panel article.story.theme-summary').each(function(i, element) {
            var newArticle
            var newArticle = new db.Article({
              storyUrl: $(element).find('.story-body>.story-link').attr('href'),
              headline: $(element).find('h2.headline').text().trim(),
              summary : $(element).find('p.summary').text().trim(),
              imgUrl  : $(element).find('img').attr('src'),
              byLine  : $(element).find('p.byline').text().trim()
            });

            if (newArticle.storyUrl) {
              if (!savedHeadlines.includes(newArticle.headline)) {
                newArticleArr.push(newArticle);
              }
            }
          });

          //adding all new articles to database
          db.Article
            .create(newArticleArr)
            .then(function(result){
              res.json({count: newArticleArr.length})
            })
            .catch(function(err) {});
        })
        .catch(function(err) {
          console.log(err);
        })
    })
    .catch(function(err) {
      console.log(err)
    })
});

module.exports = router;
