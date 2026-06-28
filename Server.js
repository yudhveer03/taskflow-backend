require("dotenv").config();

const app = require("./src/app");
const connectDb = require("./src/Db/DB");

connectDb();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server Started on Port ${PORT}`);
});