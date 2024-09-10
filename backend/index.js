const express = require("express");
const { signup, signin, auth } = require("./auth/index");
const { addTodo, showTodo } = require("./components/index");
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", signup);
app.post("/signin", signin);

app.use(express.static(__dirname + "/../frontend"));


app.post("/add-todo",auth, addTodo);
app.get("/show-todo",auth, showTodo);

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
