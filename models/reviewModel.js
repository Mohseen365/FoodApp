const mongoose = require("mongoose");
const { db_link } = require("../secrets");
mongoose
  .connect(db_link)
  .then(function (db) {
    console.log("review db connected");
  })
  .catch(function (err) {
    console.log(err);
  });

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    require: [true, "review is required"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "rating is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel", //jis user ne review likha he usse utha kar layenge userModel se
    required: [true, "review must belong to a user"],
  },
  plan: { // plan required nhi he kyuki ham id la rhe he plan ki params me -> frontend me jesi hi plan pr click krenge review ke liye to plan ki id copy ho jaegi
    type: mongoose.Schema.ObjectId,
    ref: "planModel",
  },
});

// /^find/ -> this is regex -> defining the pattern/format we want ->[A-Z]['@',-][0-9] -> in this we want this pattern -> find findbyid, findone , findoneandupdate 
reviewSchema.pre(/^find/, function (next) {
    this.populate({ // ham yha likh rhe he ki user and plan me kya kya aayega review me
        path: "user", //kha se layenge/fill krna he -> reviewSchema ke user se layenge
        select: "name profileImage", //kya kya layenge
    }).populate("plan");//plan se sab kuch layenge
    next();
});

const reviewModel = mongoose.model("reviewModel", reviewSchema);
module.exports = reviewModel;