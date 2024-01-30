const express = require("express");
const dotenv = require("dotenv");
const pokemon = require("./server/api/pokemon");
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/pokemon", pokemon);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
