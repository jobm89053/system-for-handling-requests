const express = require('express');
const router = express.Router();

const mysql = require('mysql2/promise');
const CONFIG = require('../db/config');
const Q = require('../db/queries');


router.get('/', function(req, res, next) {
  res.render('create_appeal', { title: 'Создать обращение' });
});


router.post('/', async function(req, res, next) {
  let connection;
  try {
    const { topic, text } = req.body; 
    console.log('Данные формы:', { topic, text }); 
    connection = await mysql.createConnection(CONFIG);
   
    const query = Q.create_appeal;

    const [result] = await connection.execute(query, [topic, text]);
    //console.log('Результат запроса:', result); 

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при создании обращения:', err);
    next(err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;