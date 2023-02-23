const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const resetSchema = new Schema(
  {
    resetPasswordToken: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique:true,
    },
    resetPasswordExpires: {
      type: Date,
      default:Date.now,
      expires: '2m',
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("RefreshToken", resetSchema);