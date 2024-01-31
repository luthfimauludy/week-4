const _ = require("lodash");
const MySQL = require("promise-mysql2");

const fileName = "server/services/database.js";

// Table Name
const categoriesTable = "categories";
const eventsTable = "events";
const citiesTable = "cities";
const eventCategoriesTable = "event_categories";

const ConnectionPool = MySQL.createPool({
  host: process.env.MYSQL_CONFIG_HOST || "localhost",
  user: process.env.MYSQL_CONFIG_USER || "root",
  password: process.env.MYSQL_CONFIG_PASSWORD || "",
  database: process.env.MYSQL_CONFIG_DATABASE || "dummy_db",
  port: process.env.MYSQL_CONFIG_PORT || "3306",
  connectionLimit: process.env.MYSQL_CONFIG_CONNECTION_LIMIT || "1",
});

/*
 * PRIVATE FUNCTION
 */
const __constructQueryResult = (query) => {
  const result = [];
  if (!_.isEmpty(query[0])) {
    query[0].forEach((item) => {
      const key = Object.keys(item);

      // Reconstruct query result
      const object = {};
      key.forEach((data) => {
        object[data] = item[data];
      });

      result.push(object);
    });
  }

  return result;
};

/*
 * PUBLIC FUNCTION
 */

// CATEGORIES
exports.findAllCategories = async () => {
  try {
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(
      `SELECT * FROM ${categoriesTable};`
    );
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    console.log([fileName, "Get All Data", "INFO"]);
    return Promise.resolve(result);
  } catch (error) {
    console.log([fileName, "Get All Data", "ERROR"], {
      message: { info: `${error}` },
    });
    return Promise.resolve([]);
  }
};

exports.addCategories = async (dataObject) => {
  const { name } = dataObject;

  try {
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `INSERT INTO ${categoriesTable} (name) VALUES ('${name}');`
    );
    await poolConnection.connection.release();

    console.log([fileName, "Get All Data", "INFO"]);
    return Promise.resolve(true);
  } catch (error) {
    console.log([fileName, "Add Data", "ERROR"], {
      message: { info: `${error}` },
    });
    return Promise.resolve(false);
  }
};

// EVENTS
exports.findAllEvents = async () => {
  try {
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(`SELECT * FROM ${eventsTable};`);
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    console.log([fileName, "Get All Data", "INFO"]);
    return Promise.resolve(result);
  } catch (error) {
    console.log([fileName, "Get All Data", "ERROR"], {
      message: { info: `${error}` },
    });
    return Promise.resolve([]);
  }
};

exports.findOne = async (id) => {
  try {
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(`
    SELECT * FROM ${eventsTable}
    WHERE id = ${id}
    ;`);
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    console.log([fileName, "Get One Data", "INFO"]);
    return Promise.resolve(result);
  } catch (error) {
    console.log([fileName, "Get One Data", "ERROR"], {
      message: { info: `${error}` },
    });
    return Promise.resolve([]);
  }
};

// For One-to-Many and Many-to-Many relationship
exports.findOneById = async (id) => {
  try {
    const poolConnection = await ConnectionPool.getConnection();
    const query = await poolConnection.query(`
    SELECT
    ${eventsTable}.id,
    ${eventsTable}.title,
    ${citiesTable}.name AS location,
    ${categoriesTable}.name AS category,
    ${eventsTable}.descriptions
    FROM ${eventsTable}
    INNER JOIN ${eventCategoriesTable} ON ${eventsTable}.id = ${eventCategoriesTable}.eventId
    INNER JOIN ${categoriesTable} ON ${categoriesTable}.id = ${eventCategoriesTable}.categoryId
    INNER JOIN ${citiesTable} ON ${citiesTable}.id = ${eventsTable}.cityId
    WHERE ${eventsTable}.id = ${id}
    ;`);
    await poolConnection.connection.release();
    const result = __constructQueryResult(query);

    console.log([fileName, "Get One Data", "INFO"]);
    return Promise.resolve(result);
  } catch (error) {
    console.log([fileName, "Get One Data", "ERROR"], {
      message: { info: `${error}` },
    });
    return Promise.resolve([]);
  }
};

exports.addEvents = async (dataObject) => {
  const { title, descriptions, cityId } = dataObject;

  try {
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `INSERT INTO ${eventsTable} (title, descriptions, cityId) 
      VALUES ('${title}', '${descriptions}', '${cityId}');`
    );
    await poolConnection.connection.release();

    console.log([fileName, "Get All Data", "INFO"]);
    return Promise.resolve(true);
  } catch (error) {
    console.log([fileName, "Add Data", "ERROR"], {
      message: { info: `${error}` },
    });
    return Promise.resolve(false);
  }
};

exports.updateEvent = async (id, dataObject) => {
  const { title, descriptions, cityId } = dataObject;

  try {
    const poolConnection = await ConnectionPool.getConnection();
    await poolConnection.query(
      `UPDATE ${eventsTable}
      SET
      title = COALESCE(${title}, title,
      descriptions = COALESCE(${descriptions}, descriptions),
      cityId = COALESCE(${cityId}, cityId)
      WHERE id = ${id}
      ;`
    );
    await poolConnection.connection.release();

    console.log([fileName, "Update Data", "INFO"]);
    return Promise.resolve(true);
  } catch (error) {
    console.log([fileName, "Update Data", "ERROR"], {
      message: { info: `${error}` },
    });
    return Promise.resolve(false);
  }
};
