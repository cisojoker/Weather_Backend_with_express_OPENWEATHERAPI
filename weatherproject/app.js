const express = require("express");
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityname;
  const units = "metric";
  const apiKey = "9a53a9485296f4275e78e4618069c0ca";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=${units}&appid=${apiKey}`;

  https.get(url, function (response) {
    let data = "";
    response.on("data", function (chunk) {
      data += chunk;
    });
    response.on("end", function () {
      const wData = JSON.parse(data);
      const desc = wData.weather[0].description;
      const temp = wData.main.temp;
      const icon = wData.weather[0].icon;
      const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      fs.readFile("./view.html", "utf8", (err, html) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Server error");
        }
        let modifiedHtml = html
          .replace("{{cityname}}", query)
          .replace("{{temp}}", temp)
          .replace("{{desc}}", desc)
          .replace("{{imageUrl}}", imageUrl);

        res.send(modifiedHtml);
      });
    });
  });
});

app.listen(8080, function () {
  console.log("App is listening on port 8080");
});
