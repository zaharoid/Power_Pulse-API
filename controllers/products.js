import { ctrlWrapper } from "../decorators/index.js";
import Products from "../models/Product.js";

import path from "path";
import fs from "fs/promises";

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

  if (keyWord && !blood) {
    const result = await Products.find({
      title: { $regex: keyWord, $options: "i" },
    });
    return res.status(200).json(result);
  }
  if (!keyWord && !blood) {
    const result = await Products.find();
    return res.status(200).json(result);
  }

  if (!keyWord && blood) {
    initialArray = await Products.find();
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
    initialArray = await Products.find({
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
