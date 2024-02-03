const Router = require("express").Router();

const EventHelper = require("../helpers/eventHelper");
const GeneralHelper = require("../helpers/generalHelper");

const fileName = "server/api/event.js";

const eventList = async (req, res) => {
  try {
    const { limit, offset } = req.query;
    const response = await EventHelper.getAllEvent({ limit, offset });

    return res.json({
      success: true,
      message: "List of all events",
      results: response,
    });
  } catch (err) {
    console.log([fileName, "eventList", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const eventById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await EventHelper.getOneEvent(id);

    if (!response.ok) {
      return res.status(404).json(response);
    }

    return res.json({
      success: true,
      message: "List of event",
      results: response,
    });
  } catch (err) {
    console.log([fileName, "eventById", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, descriptions, cityId } = req.body;
    const response = await EventHelper.insert({ title, descriptions, cityId });

    return res.json({
      success: true,
      message: `Create event ${req.body.title} successfully`,
      results: response,
    });
  } catch (err) {
    console.log([fileName, "createEvent", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const updateEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    const { id } = req.params;
    const response = await EventHelper.update(id, data);

    return res.json({
      success: true,
      message: "Update event successfully",
      results: response,
    });
  } catch (err) {
    console.log([fileName, "updateEvent", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

const deleteEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    const { id } = req.params;
    const response = await EventHelper.delete(id, data);

    return res.json({
      success: true,
      message: "Delete event successfully",
      results: response,
    });
  } catch (err) {
    console.log([fileName, "deleteEvent", "ERROR"], { info: `${err}` });
    return res.send(GeneralHelper.errorResponse(err));
  }
};

Router.get("/event", eventList);
Router.get("/event/:id", eventById);
Router.post("/event", createEvent);
Router.patch("/event/:id", updateEvent);
Router.delete("/event/:id", deleteEvent);

module.exports = Router;
