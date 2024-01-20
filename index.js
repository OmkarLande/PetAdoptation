require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fileupload = require('express-fileupload');
const petRoutes = require('./routes/petRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const userRoutes = require('./routes/userRoutes')
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(fileupload({ useTempFiles: true }));
app.use(bodyParser.json());

//mongoDb
connectDB(); 

//routes
app.use('/api', petRoutes);
app.use('/api/application', applicationRoutes); 
app.use('/user', userRoutes); 
app.use('/', (req,res) => {
  console.log("Working fine...👍")
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
