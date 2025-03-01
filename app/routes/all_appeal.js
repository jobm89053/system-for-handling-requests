const express = require('express');
const router = express.Router();

const mysql = require ('mysql2/promise');
const CONFIG =require ('../db/config');
const Q =require('../db/queries')

/* GET home page. */
router.get('/all_appeal', async function(req, res, next) {
  let connection; 
//работа с бд
try {
  // Получаем параметры фильтрации из запроса
  const { date, startDate, endDate } = req.query;

 connection =await mysql.createConnection(CONFIG);
let query = Q.get_all_appeals;
let params=[];
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

console.log(data);

res.render('all_appeal', {
  title: 'system-for-handling-requests',
  appeals: data, // Передаем данные в шаблон
  currentDate: date, // Передаем текущую дату для отображения в форме
  currentStartDate: startDate, // Передаем начальную дату для отображения в форме
  currentEndDate: endDate, // Передаем конечную дату для отображения в форме
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

module.exports = router;
