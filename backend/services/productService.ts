import { get } from "mongoose";
import productModel from "../src/models/productModel.js";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {

  try{
      const Products = [
    { title: "Iphone 17", image: "https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-camera-close-up-250909_big.jpg.large.jpg", price: 500, stock: 50 },
    { title: "MacBook Air", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQupFZrEg6sGbLA1oMNYlNPrOoao2gxzaWRKA&s", price: 1500, stock: 35 },
    { title: "MacBook Pro", image: "https://static.reach-tele.com/uploads/thumbs/9f/9f46d5078f4f7a0cb2ab2380f74339f1.png", price: 2000, stock: 15 },
   
  ];

  const existingProducts = await getAllProducts();

    if (existingProducts.length === 0) {
        await productModel.insertMany(Products);
    }
  }catch(err){
    console.log("cannot see database", err);

  }


};
