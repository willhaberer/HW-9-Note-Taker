const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
// const notesData = require("./db/db.json");
const fs = require("fs");
const generateUniqueId = require("generate-unique-id");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", "utf8", function (err, response) {
    if (err) {
      throw err;
    } else {
      res.json(JSON.parse(response));
    }
  });
});

app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a review`);

  const { title, text } = req.body;
  const id = generateUniqueId({
    length: 14,
    useLetters: true,
  });

  if (title && text) {
    const newNote = {
      title,
      text,
      id,
    };

    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new review
        parsedNotes.push(newNote);

        // Write updated reviews back to the file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info("Successfully updated Notes!")
        );
      }
    });

    console.log(newNote);
    res.status(201).json(newNote);
  } else {
    res.status(500).json("Error in adding");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  var noteId = req.params.id;
  console.log(noteId);
  //id is correct
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    var parsedNotes = JSON.parse(data);
    parsedNotes = parsedNotes.filter((val) => val.id !== noteId);
    fs.writeFile(
      "./db/db.json",
      JSON.stringify(parsedNotes, null, 4),
      (writeErr) =>
        writeErr
          ? console.error(writeErr)
          : console.info("Successfully updated Notes!")
    );
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
