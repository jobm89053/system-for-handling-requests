const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const CONFIG = require('../db/config');

router.get('/:appeal_id', async (req, res, next) => {
  let connection;
  try {
    const appealId = parseInt(req.params.appeal_id, 10);
    if (isNaN(appealId)) {
      return res.status(400).send('Неверный ID обращения');
    }

    connection = await mysql.createConnection(CONFIG);
    const [rows] = await connection.execute('SELECT * FROM requests WHERE id = ?', [appealId]);
    await connection.end();

    if (rows.length === 0) {
      return res.status(404).send('Обращение не найдено');
    }

    res.render('appeal_details', { appeal: rows[0] });
  } catch (err) {
    console.error('Ошибка при получении данных обращения:', err);
    next(err);
  }
});

module.exports = router;