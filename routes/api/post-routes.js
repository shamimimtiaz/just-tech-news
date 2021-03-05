const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote, Comment } = require('../../models');

// get all the posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        order: [['created_at', 'DESC']], // make the last post come first
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          // include the Comment model here:to show comment table alone with user name and the post itself
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
       })
       .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});
  
// get a single post

router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'post_url', 'title', 'created_at',
      [sequelize.literal('(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//create a single post
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    Post.create({
      title: req.body.title,       // re.body to populate the column in post table
      post_url: req.body.post_url,
      user_id: req.body.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


  
//When we vote on a post, we're technically updating that post's data. This means that we should create a PUT route for updating a post.
//Make sure this PUT route is defined before the /:id PUT route, though. Otherwise, Express.js will think the word "upvote" is a valid parameter for /:id.
// PUT /api/posts/upvote
//It will involve two queries: first, using the Vote model to create a vote, then querying on that post to get an updated vote count.
// router.put('/upvote', (req, res) => {
//     Vote.create({
//         user_id: req.body.user_id,
//         post_id: req.body.post_id
//       }).then(() => {
//         // then find the post we just voted on
//         return Post.findOne({
//           where: {
//             id: req.body.post_id
//           },
//           attributes: [
//             'id',
//             'post_url',
//             'title',
//             'created_at',
//             // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
//             [
//               sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//               'vote_count'
//             ]
//           ]
//         })
//         .then(dbPostData => res.json(dbPostData))
//         .catch(err => {
//           console.log(err);
//           res.status(400).json(err);
//         });
//     });
// });
router.put('/upvote', (req, res) => {
    // custom static method created in models/Post.js
    Post.upvote(req.body, { Vote })
      .then(updatedPostData => res.json(updatedPostData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  });
       





//update a single post
router.put('/:id', (req, res) => {
    Post.update(
      {
        title: req.body.title
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  

  module.exports = router;