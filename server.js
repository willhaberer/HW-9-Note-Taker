const express = require("express");
const path = require("path");
const PORT = process.env.port || 3001;
const notesData = require("./db/db.json");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => res.json(notesData));

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a review`);

  const { title, text } = req.body;

  if (title && text) {
    const newNote = {
      title,
      text,
    };

    // const response = {
    //   status: "success",
    //   body: newReview,
    // };

    console.log(newNote);
    res.status(201).json(newNote);
  } else {
    res.status(500).json("Error in adding");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
