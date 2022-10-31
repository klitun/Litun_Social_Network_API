const { Schema, model } = require('mongoose');


// Schema to create User model
const userSchema = new Schema( {
  username: {
    type: String,
    unique: true,    
    required: true,
    trim: true 
  },
  email: {
    type: String,
    unique: true,    
    required: true,
    match: /.+\@.+\..+/,
      },
 thoughts: {
    type: Schema.Types.ObjectID,
    ref: 'Thought'
 },
 friends: [ {    type: Schema.Types.ObjectID,
    ref: 'User'
 } ],
},
  
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Virtual property `friendCount` that retrieves the length of the user's friends array field on query.
userSchema
  .virtual('friendCount').get(function () {
    return this.friends.length || 0 ;
  })


// Initialize  User model
const User = model('User', userSchema);

//Export User Model
module.exports = User;
