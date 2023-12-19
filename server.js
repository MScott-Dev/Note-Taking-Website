const express = require('express');
const path = require('path');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");


const PORT = process.env.PORT || 3001;

const app = express();


// middleware for pasing JSON and URLencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// displays all files in public folder, sets default to index.html
app.use(express.static('public'));




app.get('/api/notes', (req, res) => {
    fs.readFile("./db/db.json", (err, data) => {
        if(err) throw err;
        let dbNotes = JSON.parse(data);
        res.json(dbNotes);
    });
});

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
    // If all the required properties are present
    // Variable for the object we will save
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        }

        const response = {
            status: 'success',
            body: newNote,
        };

        notes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => 
        err ? console.error(err) : console.log({message: "New note saved"})
        );

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting new note');
    }

});

app.delete('/api/notes/:id', (req, res) => {
    
        console.log("Hello");
        let deleteData = fs.readFileSync("./db/db.json", "Utf8");
        let dbData = JSON.parse(deleteData);
        const notDeleteNotes = dbData.filter((note) => { 
            return note.id !== req.params.id
        })
        fs.writeFileSync("./db/db.json", JSON.stringify(notDeleteNotes));
        res.status(200).json({message: "note deleted"});
   
    })

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// Wildcard route to direct users to a 404 page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/404.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);