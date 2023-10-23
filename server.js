const express = require("express");
const fs = require("fs");

const app = express();

const port = 3000;

let sanakirja = [];
// Luetaan sanakirja.txt tiedosto
const data = fs.readFileSync("./sanakirja.txt", {
  encoding: "utf8",
  flag: "r",
});
//Splitataan sanat ja lisätään taulukkoon
const splitLines = data.split(/\r?\n/);

splitLines.forEach((line) => {
  const sanat = line.split(" ");

  const sana = {
    fin: sanat[0],
    eng: sanat[1],
  };
  sanakirja.push(sana);
});

console.log(sanakirja);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Content-type", "application/json");
  next();
});
//Lähetetään sanakirjaan uusi sana. Tiedostoon kirjoitetaan sanapari muuttujan mukaisesti
//sana suomeksi ja englanniksi.
app.post("/sanakirja", (req, res) => {
  const sana = req.body;
  res.json(sana);
  sanakirja.push(sana);

  const sanapari = sana.fin + " " + sana.eng;

  fs.writeFileSync("./sanakirja.txt", sanapari.toString() + "\r\n", {
    flag: "a+",
  });
});
//Metodi jolla haetaan sanakirjan sisältö.
app.get("/sanakirja", (req, res) => {
  res.json(sanakirja);
});
//Metodi jolla pystyy hakemaan sanakirjasta tiettyä sanaa. Parametrina suomenkielinen sana ja haku palauttaa
//englanninkielisen vastineen.
app.get("/sanakirja/:fin", (req, res) => {
  const sana = req.params.fin;
  const haettavaSana = sanakirja.find(
    (haettavaSana) => haettavaSana.fin === sana
  );
  res.json(haettavaSana.eng ? haettavaSana.eng : { message: "Ei löydy" });
});

app.listen(port, () => {
  console.log(`Kuunnellaan portissa ${port}`);
});
