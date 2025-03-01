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

// Маршрут для отмены всех обращений в статусе "В работе"
router.post('/cancel_all_in_progress', async (req, res, next) => {
  let connection;
  try {
    // Подключение к базе данных
    connection = await mysql.createConnection(CONFIG);

    // SQL-запрос для обновления статуса всех обращений в статусе "В работе"
    const [result] = await connection.execute(
      'UPDATE requests SET status = "Отменено", cancellationReason = "Массовая отмена" WHERE status = "В работе"'
    );

    // Закрываем соединение с базой данных
    await connection.end();

    // Отправляем ответ с количеством отмененных обращений
    res.json({
      message: 'Все обращения в статусе "В работе" отменены',
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при отмене обращений:', err);
    next(err);
  }
});

module.exports = router;