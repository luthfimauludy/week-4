const Router = require("express").Router();

const Validation = require("../helpers/validationHelper");
const ErrorHandler = require("../helpers/errorHandler");
const QuerySql = require("../services/database");

const getAllCategories = async (req, res) => {
  try {
    Validation.categoryListData(req.query);

    const data = { ...req.query };
    const category = await QuerySql.findAllCategories(data);

    return res.json({
      success: true,
      message: "List of all categories",
      result: category,
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const createCategory = async (req, res) => {
  try {
    const data = { ...req.body };
    await QuerySql.addCategories(data);

    return res.json({
      success: true,
      message: `Create category ${req.body.name} successfully`,
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const getAllEvents = async (req, res) => {
  try {
    Validation.eventListData(req.query);

    const data = { ...req.query };
    const event = await QuerySql.findAllEvents(data);

    return res.json({
      success: true,
      message: "List of all events",
      result: event,
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const getOneEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await QuerySql.findOneById(id);
    if (!event) {
      throw Error("data_not_found");
    }

    return res.json({
      success: true,
      message: "Detail event",
      result: event,
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const createEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    await QuerySql.addEvents(data);

    return res.json({
      success: true,
      message: `Create event ${req.body.title} successfully`,
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const checkEvent = await QuerySql.findOne(id);
    if (!checkEvent) {
      throw Error("data_not_found");
    }

    const data = { ...req.body };

    const event = await QuerySql.updateEvent(id, data);

    return res.json({
      success: true,
      message: `Event updated`,
      result: event,
    });
  } catch (error) {
    return ErrorHandler(res, error);
  }
};

Router.get("/categories", getAllCategories);
Router.post("/add-category", createCategory);

Router.get("/events", getAllEvents);
Router.get("/events/:id", getOneEvent);
Router.post("/add-event", createEvent);
Router.patch("/update-event/:id", updateEvent);

module.exports = Router;
