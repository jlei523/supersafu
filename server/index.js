const express = require("express");
const next = require("next");
const bodyParser = require("body-parser");
const compression = require("compression");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const db = require("../db.js");

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json()); // bodyParser to handle POST requests
  server.use(bodyParser.urlencoded({ extended: true }));

  server.get("/api/getAddressData", (req, res) => {
    const ethAddress = req.query["0"];
    db.raw(
      `select * from eth_features where wallet ilike '${ethAddress}'`
    ).then(data => {
      console.log(data);
      res.status(200).send(data);
    });
  });

  server.get("/a", (req, res) => {
    return app.render(req, res, "/b", req.query);
  });

  server.get("/b", (req, res) => {
    return app.render(req, res, "/a", req.query);
  });

  server.get("/posts/:id", (req, res) => {
    return app.render(req, res, "/posts", { id: req.params.id });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
