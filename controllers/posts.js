const Post = require('../models/post')
const User = require('../models/user')

module.exports = (app) => {
  app.get('/', (req, res) => {
    var currentUser = req.user
    Post.find({}).lean().populate("author")
      .then(posts => {
        res.render('posts-index', { posts, currentUser })
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
      var post = new Post(req.body);

      post.author = req.user._id

      // SAVE INSTANCE OF POST MODEL TO DB
      post
        .save()
        .then(post => {
          return User.findById(req.user._id)
        })
        .then(user => {
          user.posts.unshift(post)
          user.save()
          // REDIRECT TO THE NEW POST
          res.redirect(`/posts/${post._id}`)
        })
        .catch(err => {
          console.log(err.message)
        })
    } else {
      return res.status(401)
    }
  });

  app.get("/posts/:id", function(req, res) {
    // LOOK UP THE POST
    Post.findById(req.params.id).lean().populate("comments").populate("author")
      .then(post => {
        res.render("posts-show", { post })
      })
      .catch(err => {
        console.log(err.message)
      });
  });

  app.get("/n/:subreddit", function(req, res) {
    Post.find({ subreddit: req.params.subreddit }).lean().populate("author")
      .then(posts => {
        res.render("posts-index", { posts })
      })
      .catch((err) => {
        console.log(err)
      })
  })
};