const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter your event event name!"],
    },
    description: {
      type: String,
      required: [true, "Please enter your event  description!"],
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required:true
      },
    ],

    banners: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        alt: { type: String, default: "" }, // For SEO and accessibility
      },
    ],

    startDate: {
      type: Date,
      required: [true, "Please enter start date!"],
    },

    endDate: {
      type: Date,
      required: [true, "Please enter end date!"],
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "ended", "cancelled"],
      default: "active",
    },
    tags: [{ type: String }],

    stock: {
      type: Number,
      required: [true, "Please enter your event event stock!"],
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      default: "percentage",
    },
    discountValue: {
      type: Number,
      default: 0,
      min: 0,
    },


    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("event", eventSchema);

//  status: {
//     type: String,
//     enum: ["upcoming", "active", "ended", "cancelled"],
//     default: "upcoming",
//   },
