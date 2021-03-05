const User = require("./User");
const Post = require("./Post");
const Vote = require("./Vote");


// Create the association (one user can make many posts and one post belong to a single user)
User.hasMany(Post, {
    foreignKey: 'user_id'
  });
//the reverse association
Post.belongsTo(User, {
    foreignKey: 'user_id',
  });

//when we query a User, we can see all of the posts they've voted on.
//we can see which users voted on a single post
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
  });

//when we query Post, we can see a total of how many votes a user creates.
//we can see which posts a single user voted on
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
  });

//connect User to Vote directly and Post to vote directly

Vote.belongsTo(User, {
    foreignKey: 'user_id'
  });
  
  Vote.belongsTo(Post, {
    foreignKey: 'post_id'
  });
  
  User.hasMany(Vote, {
    foreignKey: 'user_id'
  });
  
  Post.hasMany(Vote, {
    foreignKey: 'post_id'
  });

  module.exports = { User, Post, Vote };