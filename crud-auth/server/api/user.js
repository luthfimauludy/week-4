const Router = require("express").Router();

const Middleware = require("../middlewares/authMiddleware");
const UserHelper = require("../helpers/userHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/user.js";

const userList = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const response = await UserHelper.getAllUser({ limit, offset });

    return res.json({
      success: true,
      message: "List of all users",
      result: response,
    });
  } catch (err) {
    console.log([fileName, "userList", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const detailUser = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await UserHelper.getDetailUser(id);
    if (!response.ok) {
      return res.status(404).json(response);
    }

    return res.json({
      success: true,
      message: "Detail user",
      result: response,
    });
  } catch (err) {
    console.log([fileName, "detailUser", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const updateUser = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;
    await UserHelper.update(id, data);

    return res.json({
      success: true,
      message: `Update user ${req.body.name} successfully`,
    });
  } catch (err) {
    console.log([fileName, "updateUser", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/user", userList);
Router.get("/user/:id", detailUser);
Router.patch("/user/:id", Middleware.validateToken, updateUser);

module.exports = Router;
