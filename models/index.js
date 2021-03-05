const User = require("./User");
const Post = require("./Post");

module.exports = { User, Post };


// Create the association (one user can make many posts)
User.hasMany(Post, {
    foreignKey: 'user_id'
  });
//the reverse association
Post.belongsTo(User, {
    foreignKey: 'user_id',
  });