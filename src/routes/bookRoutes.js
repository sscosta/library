const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {
  const books = [
    {
      title: 'Les Misèrables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      title: 'The Time Machine',
      genre: 'Science Fiction',
      author: 'H. G. Wells',
      read: false
    },
    {
      title: 'O livro do Desassossego',
      genre: 'Fiction',
      author: 'Fernando Pessoa',
      read: false
    },
    {
      title: 'A journey into the Center of the Earth',
      genre: 'Schience Fiction',
      author: 'Jules Verne',
      read: false
    }
  ];

  bookRouter.route('/')
    .get((req, res) => {
      (async function query() {
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');
        res.render('bookListView',
          {
            nav,
            title: 'Library',
            books: recordset
          });
      }());
    });

  bookRouter.route('/:id')
    .all((req, res, next) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } = await request.input('id', sql.Int, id)
          .query('select * from books where id = @id');
        [req.book] = recordset;
        next();
      }());
    })
    .get((req, res) => {
      res.render('bookView',
        {
          nav,
          title: 'Library',
          book: req.book
        });
    });
  return bookRouter;
}

module.exports = router;
