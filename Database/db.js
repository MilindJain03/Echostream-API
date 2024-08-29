// const { Pool } = require("pg");

// const pool = new Pool({
//     user: "postgres",
//     host: "localhost",
//     database: "freddit",
//     password: "12345",
//     port: 5432
// })

// module.exports = pool;

// app.js
require("dotenv").config();
const { Pool } = require("pg");

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: false, // Adjust based on your SSL requirements
  },
  connectionString: `postgres://${process.env.PGUSER}:${
    process.env.PGPASSWORD
  }@${process.env.PGHOST}:${5432}/${process.env.PGDATABASE}?project=${
    process.env.ENDPOINT_ID
  }`,
});

module.exports = pool;
