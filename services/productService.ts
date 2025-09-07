import { get } from "mongoose";
import productModel from "../src/models/productModel.js";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {

  try{
      const Products = [
    { title: "MacBook", image: "https://www.google.com/imgres?q=macbook%20air&imgurl=https%3A%2F%2Fwww.macvoorminder", price: 1099, stock: 100 },
   
  ];

  const existingProducts = await getAllProducts();

    if (existingProducts.length === 0) {
        await productModel.insertMany(Products);
    }
  }catch(err){
    console.log("cannot see database", err);

  }


};
