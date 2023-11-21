import { HttpErr } from "../helpers/index.js";
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
  const { keyWord, blood } = req.query;

  console.log(blood);

  if (keyWord) {
    const result = await Products.find({
      title: { $regex: keyWord, $options: "i" },
    });

    res.json(result);
  }

  if (!blood) {
    throw HttpErr(400, "User's data doesn't exist");
  }
  const result = await Products.find({
    // "groupBloodNotAllowed.blood",
    // [1]: false,
  });

  res.json(result);
};

export default {
  getAllCategoryProducts: ctrlWrapper(getAllCategoryProducts),
  getAllProducts: ctrlWrapper(getAllProducts),
};
