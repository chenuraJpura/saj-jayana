const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const taskSchema = new Schema(
    {
      title: {
        type: String,
      },
      state: {
        type: String,
        default:'todo',
      },
      point: {
        type: Number,
        default:4,
      },
      ob_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },

    },
    {
      timestamps: true,
    }
  );
  module.exports = mongoose.model("task", taskSchema);
  