const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const CONFIG = require('../db/config');
const Q = require('../db/queries');

router.get('/:appeal_id', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id; 
    const connection = await mysql.createConnection(CONFIG);
    const [rows] = await connection.execute(Q.take_one_appeal, [appealId]);

    await connection.end();
    if (rows.length === 0) {
      return res.status(404).send('Обращение не найдено');
    }
    res.render('appeal_solution', { appeal: rows[0] });
  } catch (err) {
    console.error('Ошибка при получении данных обращения:', err);
    next(err);
  }
});
router.post('/:appeal_id/handle', async (req, res, next) => {
  try {
    const appealId = req.params.appeal_id;
    const { response, action } = req.body; 

    const connection = await mysql.createConnection(CONFIG);

    if (action === 'complete') {
      await connection.execute(Q.complete_appeal, [response, appealId]);
    } else if (action === 'cancel') {
      await connection.execute(Q.cancel_appeal, [response, appealId]);
    }
    await connection.end();

    res.redirect('/all_appeal');
  } catch (err) {
    console.error('Ошибка при обработке обращения:', err);
    next(err);
  }
});

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