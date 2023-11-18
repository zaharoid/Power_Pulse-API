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
  // Чтение файла JSON
  const data = await fs.readFile(productsCategoryPath, "utf8");
  const products = JSON.parse(data);

  res.json(products);
};

const getAllProducts = async (req, res) => {
  const { keyWord } = req.query;

  if (keyWord) {
    const userBloodGroup = req.user.bloodGroup;

    const result = await Products.find({
      title: { $regex: keyWord, $options: "i" },
      recommendedBloodGroups: userBloodGroup,
    });

    res.json(result);
  }

  const result = await Products.find();

  res.json(result);
};

export default {
  getAllCategoryProducts: ctrlWrapper(getAllCategoryProducts),
  getAllProducts: ctrlWrapper(getAllProducts),
};
