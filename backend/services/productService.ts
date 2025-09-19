import productModel from "../src/models/productModel.js";

export const getAllProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const products = await productModel.find().skip(skip).limit(limit);
  const totalProducts = await productModel.countDocuments();
  const totalPages = Math.ceil(totalProducts / limit);
  return {
    products,
    totalProducts,
    totalPages,
    currentPage: page,
  };
};

export const getProductById = async (id: string) => {
  return await productModel.findById(id);
};

export const createProduct = async (productData: {
  title: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}) => {
  const product = new productModel(productData);
  return await product.save();
};

export const updateProduct = async (
  id: string,
  productData: {
    title?: string;
    description?: string;
    price?: number;
    image?: string;
    stock?: number;
  }
) => {
  return await productModel.findByIdAndUpdate(id, productData, { new: true });
};

export const deleteProduct = async (id: string) => {
  return await productModel.findByIdAndDelete(id);
};

export const getAdminStats = async () => {
  try {
    // Get total products count
    const totalProducts = await productModel.countDocuments();

    // Get all products to calculate total sales
    const products = await productModel.find();
    const totalSales = products.reduce(
      (sum, product) => sum + product.salesCount,
      0
    );

    // Get sales by product (only products with sales > 0)
    const salesByProduct = products
      .filter((product) => product.salesCount > 0)
      .map((product) => ({
        name: product.title,
        sales: product.salesCount,
      }))
      .sort((a, b) => b.sales - a.sales); // Sort by sales count descending

    return {
      totalProducts,
      totalSales,
      salesByProduct,
    };
  } catch (error) {
    throw new Error("Failed to fetch admin statistics");
  }
};

export const seedInitialProducts = async () => {
  try {
    const products = [
      {
        title: "iPhone 17",
        description: "Latest iPhone with advanced features",
        image:
          "https://www.apple.com/newsroom/images/2025/09/apple-unveils-iphone-17-pro-and-iphone-17-pro-max/article/Apple-iPhone-17-Pro-camera-close-up-250909_big.jpg.large.jpg",
        price: 500,
        stock: 50,
      },
      {
        title: "MacBook Air",
        description: "Lightweight and powerful laptop",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQupFZrEg6sGbLA1oMNYlNPrOoao2gxzaWRKA&s",
        price: 1500,
        stock: 35,
      },
      {
        title: "MacBook Pro",
        description: "Professional grade laptop for developers",
        image:
          "https://static.reach-tele.com/uploads/thumbs/9f/9f46d5078f4f7a0cb2ab2380f74339f1.png",
        price: 2000,
        stock: 15,
      },
    ];

    const existingProductsResult = await getAllProducts(1, 1_000_000);
    if (existingProductsResult.products.length === 0) {
      await productModel.insertMany(products);
    }
  } catch (err) {
    console.error("Cannot seed database:", err);
  }
};
