import { get } from "mongoose";
import productModel from "../src/models/productModel.js";

export const getAllProducts = async () => {
  return await productModel.find();
};

export const seedInitialProducts = async () => {
  const Products = [
    { title: "MacBook", image: "https://www.google.com/imgres?q=macbook%20air&imgurl=https%3A%2F%2Fwww.macvoorminder.nl%2Fwp-content%2Fuploads%2F2023%2F08%2Fmacbook-air-15-inch-front-2023-midnight.jpg&imgrefurl=https%3A%2F%2Fwww.macvoorminder.nl%2Fmacbook%2Fmacbook-air%2Fmacbook-air-15-inch&docid=iXMCK1xzRK2ShM&tbnid=BLCtJytGOIq7WM&vet=12ahUKEwjD-6KFnb-PAxWSVUEAHSQnM4EQM3oECB4QAA..i&w=912&h=912&hcb=2&ved=2ahUKEwjD-6KFnb-PAxWSVUEAHSQnM4EQM3oECB4QAA", price: 1099, stock: 100 },
    // { title: "Product 2", image: "image2.jpg", price: 20, stock: 50 },
    // { title: "Product 3", image: "image3.jpg", price: 30, stock: 75 },
    // { title: "Product 4", image: "image4.jpg", price: 40, stock: 20 },
    // { title: "Product 5", image: "image5.jpg", price: 50, stock: 10 },
    // { title: "Product 6", image: "image6.jpg", price: 60, stock: 41 },
    // { title: "Product 7", image: "image7.jpg", price: 70, stock: 33 },
    // { title: "Product 8", image: "image8.jpg", price: 80, stock: 22 },
    // { title: "Product 9", image: "image9.jpg", price: 90, stock: 11 },
    // { title: "Product 10", image: "image10.jpg", price: 100, stock: 5 },
  ];

  const existingProducts = await getAllProducts();

    if (existingProducts.length === 0) {
        await productModel.insertMany(Products);
    }

};
