const mongoose = require("mongoose");
const { Schema } = mongoose;
const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
      minlength: [5, "Coupon code must be at least 5 characters"],
      maxlength: [20, "Coupon code cannot exceed 20 characters"],
      match: [
        /^[A-Z0-9]+$/,
        "Coupon code can only contain letters and numbers",
      ],
    },

    description: {
      type: String,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping"],
      default: "percentage",
      required: true,
    },

    discountValue: {
      type: Number,
      min: [0, "Discount value cannot be negative"],
      default: 0,
    },
    // You must spend at least this much money to use the coupon.
    // 50$ or 70$
    minimumOrderAmount: {
      type: Number,
      min: [0, "Minimum order amount cannot be negative"],
      default: 0,
    },

    // This is the most money the coupon can take off your order — even if your order is huge.
    maximumDiscountAmount: {
      type: Number,
      min: [0, "Maximum discount amount cannot be negative"],
      default: 0,
    },

    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      default: Date.now,
    },

    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    maxUses: {
      type: Number,
      min: [1, "Maximum uses must be at least 1"],
      default: 100,
    },

    currentUses: {
      type: Number,
      min: [0, "Current uses cannot be negative"],
      default: 0,
    },

    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: [true, "Shop reference is required"],
    },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    categories: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isSingleUse: {
      type: Boolean,
      default: false,
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
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for checking if coupon is expired
couponSchema.virtual("isExpired").get(function () {
  return this.endDate < new Date() || this.currentUses >= this.maxUses;
});

// Indexes for better performance
couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ shop: 1 });
couponSchema.index({ endDate: 1 });

// Pre-save hook to uppercase the code
couponSchema.pre("save", function (next) {
  if (this.isModified("code")) {
    this.code = this.code.toUpperCase();
  }
  next();
});

couponSchema.pre("validate", function (next) {
  // Validate endDate > startDate
  if (this.startDate && this.endDate && this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }

  // Validate discountValue
  if (
    this.discountType !== "free_shipping" &&
    (this.discountValue === null || this.discountValue === undefined)
  ) {
    return next(
      new Error(
        "discountValue is required unless discountType is 'free_shipping'"
      )
    );
  }

  if (this.discountType === "percentage" && this.discountValue > 100) {
    return next(new Error("Percentage discount cannot exceed 100%"));
  }

  // ✅ Validate maximumDiscountAmount
  if (
    this.discountType === "free_shipping" &&
    this.maximumDiscountAmount !== undefined &&
    this.maximumDiscountAmount != 0 &&
    this.maximumDiscountAmount != null
  ) {
    return next(
      new Error(
        "Maximum discount amount not applicable for free shipping coupons"
      )
    );
  }
  next();
});

module.exports = mongoose.model("Coupon", couponSchema);
