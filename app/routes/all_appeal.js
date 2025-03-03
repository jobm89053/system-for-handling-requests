const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const CONFIG = require('../db/config');
const Q = require('../db/queries');

router.get('/all_appeal', async function (req, res, next) {
  let connection;
  try {

    const { date, startDate, endDate } = req.query;

    connection = await mysql.createConnection(CONFIG);
    let query = Q.get_all_appeals;
    let params = [];
    if (date) {
      query = Q.get_appeals_by_date;
      params.push(date);
    }
    if (startDate && endDate) {
      query = Q.get_appeals_by_between_date;
      params.push(startDate, endDate);
    }

    const [data] = await connection.execute(query, params);

    res.render('all_appeal', {
      title: 'system-for-handling-requests',
      appeals: data, 
      currentDate: date || '', 
      currentStartDate: startDate || '', 
      currentEndDate: endDate || '', 
    });
  } catch (err) {

    next(err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});
router.post('/appeal_solution/:appeal_id/take_to_work', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;

    connection = await mysql.createConnection(CONFIG);

    await connection.execute(
     Q.take_appeal,
      [appealId]
    );

    await connection.end();

    res.redirect(`/appeal_solution/${appealId}`);
  } catch (err) {
    // Обработка ошибок
    console.error('Ошибка при взятии обращения в работу:', err);
    next(err);
  }
});

router.post('/appeal_solution/:appeal_id/complete', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;
    const { solution } = req.body;

    connection = await mysql.createConnection(CONFIG);

    await connection.execute(
      Q.complete_appeal,
      [solution, appealId]
    );
    await connection.end();
    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при завершении обращения:', err);
    next(err);
  }
});


router.post('/appeal_solution/:appeal_id/cancel', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;
    const { cancellationReason } = req.body;

    connection = await mysql.createConnection(CONFIG);

    await connection.execute(
      Q.cancel_appeal,
      [cancellationReason, appealId]
    );

    await connection.end();

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при отмене обращения:', err);
    next(err);
  }
});
router.post('/cancel_all_in_progress', async (req, res, next) => {
  let connection;
  try {
    connection = await mysql.createConnection(CONFIG);
    const [result] = await connection.execute(
      Q.cancel_appeal_in_work
    );
    await connection.end();

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при отмене обращений:', err);
    next(err);
  }
});
router.get('/appeal_detail/:appeal_id', async (req, res, next) => {
  let connection;
  try {
    const appealId = req.params.appeal_id;
    connection = await mysql.createConnection(CONFIG);
    const [data] = await connection.execute(
      Q.take_one_appeal,
      [appealId]
    );
    if (data.length > 0) {
      res.render('appeal_detail', {
        title: 'Детали обращения',
        appeal: data[0],
      });
    } else {
      res.status(404).send('Обращение не найдено');
    }
  } catch (err) {
    next(err);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

module.exports = router;