const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = function(app) {
  // CREATE Comment
  app.post("/posts/:postId/comments", function(req, res) {
    if (req.user) {
      // INSTANTIATE INSTANCE OF MODEL
      var comment = new Comment(req.body)

      comment.author = req.user._id

      // SAVE INSTANCE OF Comment MODEL TO DB
      comment
        .save()
        .then(comment => {
          return Post.findById(req.params.postId)
        })
        .then(post => {
          post.comments.unshift(comment)
          return post.save()
        })
        .then(post => {
          res.redirect("/posts/" + req.params.postId)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      return res.status(401)
    }
  })
}