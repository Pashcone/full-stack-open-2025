import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static("./part3/phonebook/backend/dist"));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const dir = path.join(__dirname, "dist"); // or 'public'

app.use(express.json());
app.use(requestLogger);

morgan.token("body", (req) => {
  return req.method === "POST" ? JSON.stringify(req.body) : "";
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  response.json(persons);

  console.log("|||||||||||||||||||||||||||||||||||||||||||||||||");

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    console.log("Directory entries:", files);
  });

  fs.readdir(dir, { withFileTypes: true }, (err, entries) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    entries.forEach((entry) => {
      console.log(
        `${entry.name} — ${entry.isDirectory() ? "directory" : "file"}`
      );
    });
  });
  
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((n) => Number(n.id))) : 0;
  return String(maxId + 1);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name)
    return response.status(400).json({
      error: "name is required",
    });

  if (!body.number)
    return response.status(400).json({
      error: "number is required",
    });

  if (persons.find((person) => person.name === body.name))
    return response.status(409).json({
      error: "name must be unique",
    });

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  console.log("delete id", id);
  const deletedPerson = persons.find((person) => person.id === id);
  if (!deletedPerson)
    return response.status(404).json({
      error: "person not found",
    });
  persons = persons.filter((person) => person.id !== id);
  response.status(204).json({
    message: `Person with id ${deletedPerson.id} deleted successfully`,
  });
});

app.get("/info", (request, response) => {
  const date = new Date();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p>
     <p>${date}</p>`
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
