// index.js
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const api = require('./routes/api.routes');
dotenv.config();

const port = process.env.PORT || 3000;
const connectDatabase = require('./db/config');

// Conecta a la base de datos solo si el archivo se ejecuta directamente
if (require.main === module) {
    connectDatabase();
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', api);

// Exportamos la aplicación para usarla en los tests
module.exports = app;

// Iniciamos el servidor solo si el archivo se ejecuta directamente
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor conectado en el puerto ${port}`);
    });
}