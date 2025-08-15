const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: "http://localhost:5173",  credentials: true }));

app.use('/uploads', express.static('uploads'));

app.use('/auth', require('./routes/authRoutes'));
app.use('/buyers', require('./routes/buyerRoutes'));
app.use('/sellers', require('./routes/sellerRoutes'));
app.use('/matches', require('./routes/matchRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/documents', require('./routes/documentRoutes'));
app.use('/ai', require('./routes/aiRoutes'));

app.get('/', (req, res) => res.send('Acquisition Platform API is running'));

module.exports = app;