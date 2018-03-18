var express = require('express');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');

var app = express();

var PORT = process.env.PORT || 3000;

var config = require('./config/connection');
mongoose.Promise = Promise;
mongoose
  .connect(config.database, {
    useMongoClient: true
  })
  .then(function(result) {
    console.log('Connected to database');
  })
  .catch(function(err) {
    console.log(err)
  });

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/articles',express.static(path.join(__dirname, 'public')));
app.use('/notes',express.static(path.join(__dirname, 'public')));

var index = require('./routes/index')
var articles = require('./routes/articles')
var notes = require('./routes/notes')
var scrape = require('./routes/scrape')

app.use('/', index)
app.use('/articles', articles);
app.use('/notes', notes);
app.use('/scrape', scrape);

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
