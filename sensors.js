
// This file is used in server.js. See the lines:
//
//   const sensorAPI = require("./sensors.js");
//   app.use(sensorAPI());

require("dotenv").config();
const { Router } = require("express");
const { check, validationResult } = require("express-validator/check");

const Sequelize = require("sequelize");

const sequelize = new Sequelize('postgres://postgres:postgrespw@localhost:5432/cesium');

const SensorData_Temperature = sequelize.define(
  "Temperature", 
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    object_id: Sequelize.STRING,
    datetime: Sequelize.DATE,
    value: Sequelize.FLOAT
  },
  {
    tableName: "sensor_data_temperature"
  }
);
const SensorData_Energy_Power = sequelize.define(
  "Energy (power)",
  {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    object_id: Sequelize.STRING,
    datetime: Sequelize.DATE,
    value: Sequelize.FLOAT
  },
  {
    tableName: "sensor_data_energy_power"
  }
);
const tempTable = sequelize.define(
  "Temp table for temperature import",
  {
    object_id: Sequelize.STRING,
    datetime: Sequelize.DATE,
    value: Sequelize.FLOAT
  },
  {
    tableName: "temp_table"
  }
);

SensorData_Temperature.sync({
	//force: true,  // drop the table first if it exists
});

SensorData_Energy_Power.sync({
	//force: true,  // drop the table first if it exists
}); 

tempTable.sync({
	//force: true,  // drop the table first if it exists
}); 

const routing = (router = new Router()) => {
  router.get("/sensordata", [check("id").exists()], function(
    req,
    res,
    next
  ) {
    const errors = validationResult(req);
		
    if (!errors.isEmpty()) 
		{
      return res.status(422).json({ errors: errors.array() });
    }

    const sensorDataTemperature = SensorData_Temperature.findAll({
      where: { object_id: req.query.id }
    });

    Promise.all([sensorDataTemperature]).then(data => {
      const entitledData = decorateData(data);
      res.json(entitledData);
    });
	
  });

  return router;
};

function decorateData(data) {
  return [
    {
      title: "Temperature",
      data: data[0]
    },
  ];
}

module.exports = routing;
