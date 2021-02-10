const Post = require('../models/post');

module.exports = (app) => {
  app.get('/', (req, res) => {
    var currentUser = req.user
    Post.find({}).lean()
      .then(posts => {
        res.render('posts-index', { posts, currentUser });
      })
      .catch(err => {
        console.log(err.message);
      })
  })

  app.get('/posts/new', (req, res) => {
    res.render('posts-new')
  })

  // CREATE
  app.post('/posts/new', (req, res) => {
    // INSTANTIATE INSTANCE OF POST MODEL
    if (req.user) {
      const post = new Post(req.body);

      // SAVE INSTANCE OF POST MODEL TO DB
      post.save((err, post) => {
        // REDIRECT TO THE ROOT
        return res.redirect(`/`)
      })
    } else {
      return res.status(401)
    }
  });

  app.get("/posts/:id", function(req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).lean().populate("comments")
      .then(post => {
        res.render("posts-show", { post })
      })
      .catch(err => {
        console.log(err.message)
      });
  });

  app.get("/n/:subreddit", function(req, res) {
    Post.find({ subreddit: req.params.subreddit }).lean()
      .then(posts => {
        res.render("posts-index", { posts })
      })
      .catch((err) => {
        console.log(err)
      })
  })
};