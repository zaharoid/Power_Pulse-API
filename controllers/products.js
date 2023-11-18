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
  try {
    // Чтение файла JSON
    const data = await fs.readFile(productsCategoryPath, "utf8");
    const products = JSON.parse(data);

    if (!products || products.length === 0) {
      throw new HttpErr(404);
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const keyWord = req.query.keyword;
    const userBloodGroup = req.user.bloodGroup;

    const result = await Products.find({
      title: { $regex: keyWord, $options: "i" },
      recommendedBloodGroups: userBloodGroup,
    });
    if (!result || result.length === 0) {
      throw HttpErr(404);
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default {
  getAllCategoryProducts: ctrlWrapper(getAllCategoryProducts),
  getAllProducts: ctrlWrapper(getAllProducts),
};
