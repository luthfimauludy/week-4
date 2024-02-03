const Router = require("express").Router();

const CityHelper = require("../helpers/cityHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/event.js";

const cityList = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const response = await CityHelper.getAllCity({ limit, offset });

    return res.json({
      success: true,
      message: "List of all cities",
      result: response,
    });
  } catch (err) {
    console.log([fileName, "cityList", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const createCity = async (req, res) => {
  try {
    const { name } = req.body;
    const response = await CityHelper.insert({ name });

    return res.json({
      success: true,
      message: `Create city ${req.body.name} successfully`,
      result: response,
    });
  } catch (err) {
    console.log([fileName, "createCity", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/city", cityList);
Router.post("/city", createCity);

module.exports = Router;
