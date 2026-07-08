const express = require('express');
const app = express();

// Middleware to parse incoming JSON payloads
app.use(express.json());

const patientRoutes = require('./src/routes/patientRoutes');
const sheetRoutes = require('./src/routes/sheetRoutes');
const visitRoutes = require("./src/routes/visitRoutes");
const radiologyRoutes = require("./src/routes/radiologyRoutes");
const authRoutes = require("./src/routes/authRoutes");


app.use('/patients', patientRoutes);
app.use(authRoutes);
app.use(radiologyRoutes);
app.use(visitRoutes);
app.get('/', (req, res) => {
    res.send('Node.js Training API is running smoothly.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
 
