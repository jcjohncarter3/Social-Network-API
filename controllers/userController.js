const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a single user by ID
  getSingleUser(req, res) {
    User.findById(req.params.userId)
      .populate("thoughts")
      .populate("friends")
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user by ID
  updateUser(req, res) {
    User.findByIdAndUpdate(req.params.userId, req.body, { new: true })
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Delete a user by ID and remove associated thoughts
  deleteUser(req, res) {
    User.findByIdAndDelete(req.params.userId)
      .then((user) => {
        if (!user)
          return res
            .status(404)
            .json({ message: "No user found with this ID" });
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() => res.json({ message: "User and associated thoughts deleted" }))
      .catch((err) => res.status(500).json(err));
  },

  // Add a friend to a user
  addFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user
  removeFriend(req, res) {
    User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
};
