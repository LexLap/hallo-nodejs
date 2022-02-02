const express = require('express');
const cors = require('cors');
require('../src/db/mysql')

const dbRouter = require('./routers/dbRouter')

const port = process.env.PORT | 4000;
const app = express();


app.use(cors());
app.use(express.json());

app.use("/db-query", dbRouter);
app.use('*', async (req, res) => res.status(404).send({ message: "Page not found" }))


app.listen(port, () => console.log("Server is running on port:", port));