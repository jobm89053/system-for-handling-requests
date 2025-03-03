const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const CONFIG = require('../db/config');
const Q = require('../db/queries');

/* GET home page. */
router.get('/all_appeal', async function (req, res, next) {
  let connection;
  try {
    // Получаем параметры фильтрации из запроса
    const { date, startDate, endDate } = req.query;

    connection = await mysql.createConnection(CONFIG);
    let query = Q.get_all_appeals;
    let params = [];

    // Фильтрация по конкретной дате
    if (date) {
      query = Q.get_appeals_by_date;
      params.push(date);
    }

    // Фильтрация по диапазону дат
    if (startDate && endDate) {
      query = Q.get_appeals_by_between_date;
      params.push(startDate, endDate);
    }

    const [data] = await connection.execute(query, params);

    res.render('all_appeal', {
      title: 'system-for-handling-requests',
      appeals: data, // Передаем данные в шаблон
      currentDate: date || '', // Передаем текущую дату для отображения в форме (или пустую строку, если дата не указана)
      currentStartDate: startDate || '', // Передаем начальную дату для отображения в форме (или пустую строку, если дата не указана)
      currentEndDate: endDate || '', // Передаем конечную дату для отображения в форме (или пустую строку, если дата не указана)
    });
  } catch (err) {
    // Обработка ошибок
    next(err);
  } finally {
    // Закрываем соединение, если оно было создано
    if (connection) {
      await connection.end();
    }
  }
});
// Маршрут для взятия обращения в работу
router.post('/appeal_solution/:appeal_id/take_to_work', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;

    // Подключение к базе данных
    connection = await mysql.createConnection(CONFIG);

    // Обновляем статус обращения на "В работе"
    await connection.execute(
     Q.take_appeal,
      [appealId]
    );

    // Закрываем соединение с базой данных
    await connection.end();

    // Перенаправляем на страницу завершения обращения
    res.redirect(`/appeal_solution/${appealId}`);
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при взятии обращения в работу:', err);
    next(err);
  }
});

// Маршрут для завершения обращения
router.post('/appeal_solution/:appeal_id/complete', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;
    const { solution } = req.body;

    // Подключение к базе данных
    connection = await mysql.createConnection(CONFIG);

    // Обновляем статус обращения на "Завершено"
    await connection.execute(
      Q.complete_appeal,
      [solution, appealId]
    );

    // Закрываем соединение с базой данных
    await connection.end();

    // Перенаправляем на страницу со списком обращений
    res.redirect('/all_appeal');
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при завершении обращения:', err);
    next(err);
  }
});


router.post('/appeal_solution/:appeal_id/cancel', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;
    const { cancellationReason } = req.body;

    // Подключение к базе данных
    connection = await mysql.createConnection(CONFIG);

    // Обновляем статус обращения на "Отменено"
    await connection.execute(
      Q.cancel_appeal,
      [cancellationReason, appealId]
    );

    // Закрываем соединение с базой данных
    await connection.end();

    // Перенаправляем на страницу со списком обращений
    res.redirect('/all_appeal');
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при отмене обращения:', err);
    next(err);
  }
});
router.post('/cancel_all_in_progress', async (req, res, next) => {
  let connection;
  try {
    // Подключение к базе данных
    connection = await mysql.createConnection(CONFIG);

    // SQL-запрос для обновления статуса всех обращений в статусе "В работе"
    const [result] = await connection.execute(
      Q.cancel_appeal_in_work
    );

    // Закрываем соединение с базой данных
    await connection.end();

    // Перенаправляем на страницу со списком обращений
    res.redirect('/all_appeal');
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при отмене обращений:', err);
    next(err);
  }
});
router.get('/appeal_detail/:appeal_id', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;

    // Подключение к базе данных
    connection = await mysql.createConnection(CONFIG);

    // Получаем данные об обращении по его ID
    const [data] = await connection.execute(
      Q.take_one_appeal,
      [appealId]
    );

    // Если обращение найдено, передаем его в шаблон
    if (data.length > 0) {
      res.render('appeal_detail', {
        title: 'Детали обращения',
        appeal: data[0],
      });
    } else {
      // Если обращение не найдено, возвращаем 404
      res.status(404).send('Обращение не найдено');
    }
  } catch (err) {
    // Обработка ошибок
    next(err);
  } finally {
    // Закрываем соединение, если оно было создано
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;