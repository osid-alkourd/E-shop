import { createReducer } from "@reduxjs/toolkit";
// action describe what happend while the reducer describe how states changes based on the action
const initialState = {
  shopLoading: true,
  isSeller: false,
  shop: null,
  error: null
};
export const LoadShopRequest = "LoadShopRequest";
export const LoadShopSuccess = "LoadShopSuccess";
export const LoadShopFail = "LoadShopFail";
export const ClearError = "ClearError";

export const shopReducer = createReducer(initialState, (builder) => {
    builder
      .addCase(LoadShopRequest, (state) => {
        state.shopLoading = true;
      })
      .addCase(LoadShopSuccess, (state, action) => {
        state.isSeller = true;
        state.shopLoading = false;
        state.shop = action.payload;
        //console.log('the shop is ' + state.shop._id)
        console.log('success get shop')
      })
      .addCase(LoadShopFail, (state, action) => {
        state.shopLoading = false;
        state.error = action.payload;
        state.isSeller = false;
      })
      .addCase(ClearError, (state) => {
        state.error = null;
      });
  });