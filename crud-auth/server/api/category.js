const Router = require("express").Router();

const CategoryHelper = require("../helpers/categoryHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/category.js";

const categoryList = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const response = await CategoryHelper.getAllCategory({ limit, offset });

    return res.json({
      success: true,
      message: "List of all categories",
      result: response,
    });
  } catch (err) {
    console.log([fileName, "categoryList", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const response = await CategoryHelper.insert({ name });

    return res.json({
      success: true,
      message: `Create category ${req.body.name} successfully`,
      result: response,
    });
  } catch (err) {
    console.log([fileName, "createCategory", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/category", categoryList);
Router.post("/category", createCategory);

module.exports = Router;
