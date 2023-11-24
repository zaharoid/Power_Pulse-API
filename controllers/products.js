import { ctrlWrapper } from "../decorators/index.js";
import Product from "../models/Product.js";

import path from "path";
import fs from "fs/promises";
import HttpErr from "../helpers/HttpErr.js";
import UserData from "../models/userData.js";

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
  const  {_id: owner}  = req.user;
  const { page = 1, limit = 20, keyword = "", category = "", recommend = null } = req.query;
  const skip = (page - 1) * limit;
  const { blood } = await UserData.findOne({ owner });
  let filter = {
    title: { $regex: keyword, $options: "i" },
        category: { $regex: category, $options: "i" },
  }
  switch (recommend) {
    case "true":
      filter = {
        title: { $regex: keyword, $options: "i" },
        category: { $regex: category, $options: "i" },
        ["groupBloodNotAllowed." + blood]: { $eq: false },
      };
      break;
    case "false":
      filter = {
        title: { $regex: keyword, $options: "i" },
        category: { $regex: category, $options: "i" },
        ["groupBloodNotAllowed." + blood]: { $eq: true },
      };
      break;
    default:
      break;
  }
    const products = await Product.find(filter).limit(limit).skip(skip);
    return res.status(200).json({
      products
    });
};

export default {
  getAllCategoryProducts: ctrlWrapper(getAllCategoryProducts),
  getAllProducts: ctrlWrapper(getAllProducts),
};
