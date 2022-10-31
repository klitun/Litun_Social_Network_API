const { User, Thought} = require('../models');

module.exports = {
   // get all thoughts
  getAllThought(req, res) {
    Thought.find()
    .then((thought) => res.json(thought))
    .catch((err) => res.status(500).json(err));
},

  // get one thought by id
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
    
  },    

//create thought
  createThought(req, res) {
    Thought.create(req.body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
},

  // update thought by id
  updateThought(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      )
        .then((thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with this id!' })
            : res.json(thought)
        )
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    },
  // delete thought by  id
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.id })
    .then((thought) =>
      !thought
        ? res.status(404).json({ message: 'No thought with this id!' })
        : User.findOneAndUpdate(
            { videos: req.params.id },
            { $pull: { videos: req.params.id } },
            { new: true }
          )
    )
    .then((user) =>
      !user
        ? res
            .status(404)
            .json({ message: 'Thought created but no user with this id!' })
        : res.json({ message: 'Thought successfully deleted!' })
    )
    .catch((err) => res.status(500).json(err));
},

//create a reaction stored in a single thought's reactions array field
  createReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.id},
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true })
    .populate({path: 'reactions', select: '-__v'})
    .select('-__v')
    .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No thought with this id!' })
      : res.json(thought)
  )
  .catch((err) => res.status(500).json(err));
},

//pull and remove a reaction by the reaction's reactionId value
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
    .then((thought) =>
    !thought
      ? res.status(404).json({ message: 'No thought with this id!' })
      : res.json(thought)
  )
  .catch((err) => res.status(500).json(err));
},

};
