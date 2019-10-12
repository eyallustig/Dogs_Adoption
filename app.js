const express = require("express"),
    port = process.env.PORT || 3000,
    app = express();

app.set("view engine", "ejs");


app.get('/', (req, res) => res.render('landing'));

app.listen(port, () => console.log(`Server listening on port ${port}`));