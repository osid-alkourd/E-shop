const { body, validationResult } = require("express-validator");
const ErrorHandler = require("../utils/ErrorHandler"); // Optional error handler
const Coupon = require("../model/coupon");
const Shop = require("../model/shop");
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

const getmyCoupons = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ErrorHandler(errors.array()[0].msg, 422));
    }

    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if shop exists (even if middleware should have set it)
    if (!req.shop?._id) {
      return next(new ErrorHandler("Shop authentication required", 401));
    }

    // Find coupons for the current shop
    const coupons = await Coupon.find({ shop: req.shop._id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    // Get total count for pagination info
    const totalCoupons = await Coupon.countDocuments({ shop: req.shop._id });
    const totalPages = Math.ceil(totalCoupons / limit);

    res.json({
      success: true,
      coupons,
      pagination: {
        currentPage: page,
        totalPages,
        totalCoupons,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
};

const deleteCoupon = async (req, res, next) => {
  try {
    // 1. Check if shop is authenticated
    if (!req.shop?._id) {
      return next(new ErrorHandler("Shop authentication required", 401));
    }

    const { id } = req.params;

    // 2. Validate couponId format (MongoDB ObjectId)
    if (!id || !isValidObjectId(id)) {
      return next(new ErrorHandler("Invalid Coupon ID", 422));
    }

    // 3. Delete only if the coupon belongs to the requesting shop
    const deletedCoupon = await Coupon.findOneAndDelete({
      _id: id,
      shop: req.shop._id, // Ensures ownership
    });

    // 4. Handle case where coupon doesn't exist or isn't owned by the shop
    if (!deletedCoupon) {
      return next(new ErrorHandler("Coupon not found or unauthorized", 404));
    }

    // 5. Success response
    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler("network error", 500));
  }
};
module.exports = { createCoupon, updateCoupon, getmyCoupons, deleteCoupon };

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
