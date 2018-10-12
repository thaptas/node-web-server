const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000;

var app = express();
var maintenance = false;


//template partials
hbs.registerPartials(__dirname + '/views/partials');
//init template engine
app.set('view engine', 'hbs');
//middleware
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFileSync('server.log', log + '\n');
  next();
});

app.use((req, res, next) => {
  if (maintenance) {
    res.render('maintenance.hbs');
  } else {
      next();
  }
});

app.use(express.static(__dirname + '/public'));


//register hbs helpers
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('toUpper', (text) => {
  return text.toUpperCase();
})

app.get('/', (req, res) => {
  //render template content
  res.render('index.hbs', {
    welcome: 'Welcome to our first NodeJS Express Server',
    title: 'Home'
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    title: 'About us'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    title: 'Projects'
  });
});

app.get('/bad', (req, res) => {
  res.send({
      errorMessage: 'Error occured',
      errorCode: 500
  });
});

app.listen(port, () => {
  console.log('Server is up on port ', port)
});
