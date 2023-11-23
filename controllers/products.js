import { ctrlWrapper } from "../decorators/index.js";
import Product from "../models/Product.js";

import path from "path";
import fs from "fs/promises";
import HttpErr from "../helpers/HttpErr.js";

const productsCategoryPath = path.resolve(
  "products",
  "../productsCategories.json"
);

const getAllCategoryProducts = async (req, res) => {
  const data = await fs.readFile(productsCategoryPath, "utf8");
  const products = JSON.parse(data);

  res.json(products);
};

const getAllProducts = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  let initialArray;
  let recommendedProducts = [];
  let notRecommendedProducts = [];

  const { keyWord, blood } = req.query;

  if (blood && 0 < blood > 5) {
    throw HttpErr(400);
  }

  if (keyWord && !blood) {
    const result = await Product.find({
      title: { $regex: keyWord, $options: "i" },
    }).limit(limit).skip(skip);
    return res.status(200).json(result);
  }
  if (!keyWord && !blood) {
    const result = await Product.find().limit(limit).skip(skip);
    return res.status(200).json(result);
  }

  if (!keyWord && blood) {
    initialArray = await Product.find({
      title: { $regex: keyWord, $options: "i" },
    }).limit(limit).skip(skip);
    initialArray.forEach((product) => {
      product.groupBloodNotAllowed[blood] === true
        ? notRecommendedProducts.push(product)
        : recommendedProducts.push(product);
    });

    return res.status(200).json({
      notRecommendedProducts,
      recommendedProducts,
    })
  }

  if (keyWord && blood) {
    initialArray = await Product.find({
      title: { $regex: keyWord, $options: "i" },
    }).limit(limit).skip(skip);

    initialArray.forEach((product) => {
      product.groupBloodNotAllowed[blood] === true
        ? notRecommendedProducts.push(product)
        : recommendedProducts.push(product);
    });
    return res.status(200).json({
      recommendedProducts,
      notRecommendedProducts,
    });
  }
};

export default {
  getAllCategoryProducts: ctrlWrapper(getAllCategoryProducts),
  getAllProducts: ctrlWrapper(getAllProducts),
};
