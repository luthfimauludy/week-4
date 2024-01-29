const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const dataPath = path.resolve(__dirname, "../assets/db.json");

const errorHandler = require("../helpers/errorHandler");

const saveAccountData = (data) => {
  const stringifyData = JSON.stringify(data);
  fs.writeFileSync(dataPath, stringifyData);
};

const getAllUser = async (req, res) => {
  try {
    fs.readFile(dataPath, (error, data) => {
      if (error) {
        console.log(error);
        throw error;
      }
      const users = JSON.parse(data);
      return res.json({
        success: true,
        message: "List of all users",
        result: users,
      });
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

const getDetailUser = async (req, res) => {
  try {
    const getId = parseInt(req.params.id);
    fs.readFile(dataPath, (error, data) => {
      if (error) {
        console.log(error);
        throw error;
      }
      const users = JSON.parse(data);

      const findUser = users.find((item) => item.id === getId);
      return res.json({
        success: true,
        message: "Detail user",
        result: findUser,
      });
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

const createUser = async (req, res) => {
  try {
    const getData = fs.readFileSync(dataPath);
    const data = JSON.parse(getData);

    let lastIndex = data.length - 1;

    const userData = {
      id: lastIndex + 1,
      ...req.body,
    };
    data.push(userData);
    saveAccountData(data);
    return res.json({
      success: true,
      message: `Create user ${req.body.name} successfully`,
      result: userData,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    const getId = parseInt(req.params.id);
    const getData = fs.readFileSync(dataPath);
    const data = JSON.parse(getData);

    const userData = data.find((item) => item.id === getId);
    if (!userData) {
      return errorHandler(res, undefined);
    }

    userData["name"] = req.body.name;
    userData["email"] = req.body.email;
    userData["age"] = req.body.age;

    saveAccountData(data);
    return res.json({
      success: true,
      message: "User updated",
      result: userData,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const getId = parseInt(req.params.id);
    const getData = fs.readFileSync(dataPath);
    const data = JSON.parse(getData);

    const userData = data.find((item) => item.id === getId);
    if (!userData) {
      return errorHandler(res, undefined);
    }

    for (let [i, user] of data.entries()) {
      if (user.id === getId) {
        data.splice(i, 1);
      }
    }

    saveAccountData(data);
    return res.json({
      success: true,
      message: `User ${req.body.name} has been deleted`,
    });
  } catch (error) {
    return errorHandler(res, error);
  }
};

router.get("/list", getAllUser);
router.get("/detail/:id", getDetailUser);
router.post("/add", createUser);
router.patch("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);

module.exports = router;
