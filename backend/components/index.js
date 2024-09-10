const express = require("express");
const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const app = express();

app.use(express.json());

mongoose.connect(
  "mongodb+srv://Yash:Hello%401234@cluster0.so8pmoa.mongodb.net/sept-proj-todos"
);

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  isStatus: { type: String, required: true },
  doneBy: { type: Date, required: true },
  isComplete: { type: Boolean, default: false },
});

todoSchema.plugin(AutoIncrement, { inc_field: "id" });

const Todos = new mongoose.model("Todos", todoSchema);

async function addTodo(req, res) {
  try {
    const title = req.body.title;
    const isStatus = req.body.isStatus;
    const doneBy = req.body.doneBy;
    const isComplete = req.body.isComplete;

    const todos = new Todos({
      title: title,
      isStatus: isStatus,
      doneBy: doneBy,
      isComplete: isComplete,
    });
    await todos.save();

    res.json({
      msg: "Your Todo has been Added!!",
      id: todos.id,
    });
  } catch (error) {
    console.error("Error Adding todos:", error);
    res.status(500).json({
      msg: "Something went wrong while Adding todos",
    });
  }
}

app.post("/add-todo", addTodo);

async function showTodo(req, res) {
  try {
    const todos = await Todos.find();

    res.json({
      todos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({
      msg: "Something went wrong while fetching todos",
    });
  }
}

app.get("/show-todo", showTodo);

module.exports = { addTodo, showTodo };
