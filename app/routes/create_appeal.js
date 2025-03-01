const express = require('express');
const router = express.Router();

const mysql = require('mysql2/promise');
const CONFIG = require('../db/config');
const Q = require('../db/queries');

// GET страница создания обращения
router.get('/', function(req, res, next) {
  res.render('create_appeal', { title: 'Создать обращение' });
});

// POST обработка формы создания обращения
router.post('/', async function(req, res, next) {
  let connection;
  try {
    const { topic, text } = req.body; // Получаем данные из формы

    console.log('Данные формы:', { topic, text }); // Логирование данных формы

    connection = await mysql.createConnection(CONFIG);

    // SQL-запрос для добавления обращения в базу данных
    const query = Q.create_appeal;

    // Выполняем запрос
    const [result] = await connection.execute(query, [topic, text]);
    console.log('Результат запроса:', result); // Логирование результата запроса

    // Перенаправляем на страницу со списком обращений
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