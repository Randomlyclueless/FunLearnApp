// models/Progress.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const progressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    module: {
      type: String,
      enum: [
        "colors",
        "alphabets",
        "numbers",
        "shapes",
        "tricky_twins",
        "words",
      ],
      required: true,
    },
    completedTasks: { type: Number, default: 0 },
    totalTasks: { type: Number, default: 0 },
    // optional raw fields to calculate accuracy if you prefer
    correctAnswers: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },

    // stored convenience field (0-100)
    accuracy: { type: Number, default: 0 },

    timeSpent: { type: Number, default: 0 }, // seconds

    // small snapshot history for trend charts
    history: [
      {
        date: { type: Date, default: Date.now },
        completedTasks: Number,
        totalTasks: Number,
        accuracy: Number,
        timeSpent: Number,
      },
    ],

    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ensure one document per (user, module)
progressSchema.index({ userId: 1, module: 1 }, { unique: true });

// virtual percent completion
progressSchema.virtual("completion").get(function () {
  if (!this.totalTasks || this.totalTasks === 0) return 0;
  return Math.round((this.completedTasks / this.totalTasks) * 100);
});

// keep accuracy in sync on save if raw values provided
progressSchema.pre("save", function (next) {
  if (this.attempts && this.attempts > 0) {
    this.accuracy = Math.round((this.correctAnswers / this.attempts) * 100);
  }
  this.lastUpdated = new Date();
  next();
});

const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
