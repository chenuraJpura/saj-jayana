const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const countSchema = new Schema(
    {
      title: {
        type: String,
        required:true
      },
      state: {
        type: String,
        default:'done',
      },
      count: {
        type: Number,
        required:true,
        default:0,
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
  module.exports = mongoose.model("count", countSchema);
  