const Product = require("../model/product");

const calculateOrderTotals = async (cart) => {
  let subtotal = 0;
  const outOfStockItems = [];
  const updatedItems = [];
  let allProudctsExist = true;

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      allProudctsExist = false;
      break;
    }

    if (product.stock < item.quantity) {
      outOfStockItems.push({
        productId: item.product,
        requestedQuantity: item.quantity,
        availableQuantity: product.stock,
      });
      continue;
    }

    
    const itemTotal = product.originalPrice * item.quantity;
    subtotal += itemTotal;
    updatedItems.push(item);
  }
  

  if(!allProudctsExist){
    return {
      outOfStockItems:[],
      allProudctsExist: false,
      updatedItems:[]
    }
  }

  if (outOfStockItems.length > 0) {
    return {
      outOfStockItems,
      allProudctsExist: true,
      updatedItems:[]
    };
  }

  const tax = subtotal * 0.1; // Example: 10% tax
  const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
  const discount = 0;
  const total = subtotal + tax + shipping - discount;

  return {
    updatedCart: {
      items: updatedItems,
      subtotal,
      tax,
      shipping,
      discount,
      total,
    },
    outOfStockItems: [],
    allProudctsExist: true,
  };
};


module.exports = {
  calculateOrderTotals,
};
