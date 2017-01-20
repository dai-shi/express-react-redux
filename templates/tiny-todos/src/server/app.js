const express = require('express');

const app = express();

app.use(require('express-react-redux')());

app.listen(process.env.PORT || 3000);
