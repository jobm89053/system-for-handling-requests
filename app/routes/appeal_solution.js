const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const CONFIG = require('../db/config');
const Q = require('../db/queries');

// Маршрут для отображения страницы завершения обращения
router.get('/:appeal_id', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id; // Получаем ID обращения из URL

    // Подключение к базе данных
    const connection = await mysql.createConnection(CONFIG);

    // Запрос к базе данных для получения данных обращения
    const [rows] = await connection.execute(Q.take_one_appeal, [appealId]);

    // Закрываем соединение с базой данных
    await connection.end();

    // Если обращение не найдено, отправляем 404
    if (rows.length === 0) {
      return res.status(404).send('Обращение не найдено');
    }

    // Отображаем шаблон appeal_solution.pug и передаем данные
    res.render('appeal_solution', { appeal: rows[0] });
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при получении данных обращения:', err);
    next(err);
  }
});

// Маршрут для обработки завершения или отмены обращения
router.post('/:appeal_id/handle', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    const { response, action } = req.body; // Получаем данные из формы

    const connection = await mysql.createConnection(CONFIG);

    if (action === 'complete') {
      // Завершение обращения
      await connection.execute(Q.complete_appeal, [response, appealId]);
    } else if (action === 'cancel') {
      // Отмена обращения
      await connection.execute(Q.cancel_appeal, [response, appealId]);
    }

    // Закрываем соединение с базой данных
    await connection.end();

    // Перенаправляем на страницу со списком обращений
    res.redirect('/all_appeal');
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при обработке обращения:', err);
    next(err);
  }
});

// Маршрут для отмены всех обращений в статусе "В процессе"
router.post('/cancel-all-in-progress', async (req, res, next) => {
  try {
    const connection = await mysql.createConnection(CONFIG);
    await connection.execute(Q.cancel_appeal_in_work);
    await connection.end();
    res.redirect('/all_appeal');
  } catch (err) {
    next(err);
  }
});

module.exports = router;