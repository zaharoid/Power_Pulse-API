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
  let initialArray;
  let recommendedArray = [];
  let notRecommendedArray = [];

  const { keyWord, blood } = req.query;

  if (blood && 0 < blood > 5) {
    throw HttpErr(400);
  }

  if (keyWord && !blood) {
    const result = await Product.find({
      title: { $regex: keyWord, $options: "i" },
    });
    return res.status(200).json(result);
  }
  if (!keyWord && !blood) {
    const result = await Product.find();
    return res.status(200).json(result);
  }

  if (!keyWord && blood) {
    initialArray = await Product.find();
    initialArray.forEach((product) => {
      product.groupBloodNotAllowed[blood] === true
        ? notRecommendedArray.push(product)
        : recommendedArray.push(product);
    });

    return res.status(200).json({
      notRecommendedArray,
      recommendedArray,
    });
  }

  if (keyWord && blood) {
    initialArray = await Product.find({
      title: { $regex: keyWord, $options: "i" },
    });

    initialArray.forEach((product) => {
      product.groupBloodNotAllowed[blood] === true
        ? notRecommendedArray.push(product)
        : recommendedArray.push(product);
    });
    return res.status(200).json({
      recommendedArray,
      notRecommendedArray,
    });
  }
};

export default {
  getAllCategoryProducts: ctrlWrapper(getAllCategoryProducts),
  getAllProducts: ctrlWrapper(getAllProducts),
};
