const express = require('express');

// color debug info
const chalk = require('chalk');
// logging inbuilt
const debug = require('debug')('app');
// logging
const morgan = require('morgan');
// joins
const path = require('path');
// sql server
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

const config = {
  user: 'sscosta',
  password: 'Ldir0,#0',
  server: 'mysscostaserver.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
  database: 'PSLibrary',

  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
};

sql.connect(config).catch((err) => { debug(err); });
app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

const nav = [{ link: '/books', title: 'Books' },
  { link: '/authors', title: 'Authors' }];

const bookRouter = require('./src/routes/bookRoutes')(nav);

app.use('/books', bookRouter);
app.get('/', (req, res) => res.render(
  'index',
  {
    nav,
    title: 'Library'
  }
));

app.listen(port, () => debug(`listening at port ${chalk.green(port)}`));
