const { body, validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const Coupon = require("../model/coupon");
const Product = require("../model/product");

const { isValidObjectId } = require("mongoose");

const createCoupon = async (req, res, next) => {
  try {
    // 1. Validate request data - return first error only
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        error: {
          field: firstError.path,
          message: firstError.msg,
        },
      });
    }
    // 2. Verify all products belong to the requesting shop
    if (req.body.products?.length > 0) {
      const products = await Product.find({
        _id: { $in: req.body.products },
        shop: req.shop._id, // Only products from this shop
      }).lean();

      // Check if all requested products were found and belong to the shop
      if (products.length !== req.body.products.length) {
        return next(
          new ErrorHandler("Some products do not belong to your shop", 403)
        );
      }
    }

    // 3. Prepare coupon data with destructuring and defaults
    const couponData = getCouponData(req);

    // 4. Check for duplicate coupon code in this shop
    const existingCoupon = await Coupon.findOne({
      code: couponData.code,
      shop: couponData.shop,
    });
    if (existingCoupon) {
      return next(
        new ErrorHandler("Coupon code already exists for this shop", 403)
      );
    }

    // 5. Create and save coupon
    const coupon = new Coupon(couponData);
    await coupon.save();

    // 6. Return success response
    const responseCoupon = coupon.toObject();
    delete responseCoupon.__v;

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      data: responseCoupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const updateCoupon = async (req, res, next) => {
  try {
    // 1. Validate request data - return first error only
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        error: {
          field: firstError.path,
          message: firstError.msg,
        },
      });
    }

    const couponId = req.params.id;

    // 2. Verify coupon exists and belongs to the requesting shop
    const existingCoupon = await Coupon.findOne({
      _id: couponId,
      shop: req.shop._id,
    });

    if (!existingCoupon) {
      return next(
        new ErrorHandler(
          "Coupon not found or you don't have permission to update it",
          404
        )
      );
    }
    if (req.body.code && req.body.code !== existingCoupon.code) {
      const codeExists = await Coupon.findOne({
        code: req.body.code,
        shop: req.shop._id,
        _id: { $ne: couponId }, //$ne mean no equal
      });
      if (codeExists) {
        return next(
          new ErrorHandler("Coupon code alreay exist for your shop", 403)
        );
      }
    }

    // 4. Verify all products belong to the requesting shop if products are being updated
    if (req.body.products && req.body.products.length > 0) {
      const products = await Product.find({
        _id: { $in: req.body.products },
        shop: req.shop._id,
      }).lean();

      if (products.length !== req.body.products.length) {
        return next(
          new ErrorHandler("Some products do not belong to your shop", 403)
        );
      }
    }

    const updateData = getCouponData(req);

  

    // 7. Update the coupon
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!updatedCoupon) {
      return next(new ErrorHandler("Failed to update coupon", 500));
    }

    // 8. Return success response
    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: updatedCoupon,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

module.exports = { createCoupon, updateCoupon };

const getCouponData = (req) => {
  return {
    code: req.body.code,
    description: req.body.description,
    discountType: req.body.discountType,
    discountValue: req.body.discountValue,
    minimumOrderAmount: req.body.minimumOrderAmount,
    maximumDiscountAmount: req.body.maximumDiscountAmount,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    maxUses: req.body.maxUses,
    currentUses: req.body.currentUses, // Default to 0 if not provided
    products: req.body.products, // Default to empty array
    categories: req.body.categories, // Default to empty array
    isActive: req.body.isActive,
    isSingleUse: req.body.isSingleUse,
    shop: req.shop._id, // From isSeller middleware
  };
};
