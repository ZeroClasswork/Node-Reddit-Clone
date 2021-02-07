const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());


app.engine('handlebars', exphbs({ defaultLayout: 'layout', handlebars: allowInsecurePrototypeAccess(Handlebars) }))

app.set('view engine', 'handlebars')

// Set db
require('./data/reddit-db');

const Post = require('./models/post');

app.get('/', (req, res) => {
  Post.find({}).lean()
    .then(posts => {
      res.render('posts-index', { posts });
    })
    .catch(err => {
      console.log(err.message);
    })
})

app.get('/posts/new', (req, res) => {
  res.render('posts-new')
})

require('./controllers/posts.js')(app);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app