const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction"); // Import reactionSchema

// Thought Schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Use a getter method to format the timestamp on query
      get: (timestamp) => new Date(timestamp).toLocaleDateString(),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // Array of nested reactions
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Virtual property to get reaction count
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
