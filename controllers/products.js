import { HttpErr } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

import path from "path";
import fs from "fs/promises";

const productCategoryPath = path.resolve(
  "products",
  "../productsCategories.json"
);

const getAllProducts = async (req, res) => {
  try {
    // Чтение файла JSON
    const data = await fs.readFile(productCategoryPath, "utf8");
    const products = JSON.parse(data);

    if (!products || products.length === 0) {
      throw new HttpErr(404, "Products not found");
    }

    res.json(products);
  } catch (error) {
    console.error(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};

export default {
  getAllProducts: ctrlWrapper(getAllProducts),
};
