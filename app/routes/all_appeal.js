const express = require('express');
const router = express.Router();

const mysql = require ('mysql2/promise');
const CONFIG =require ('../db/config');
const Q =require('../db/queries')

/* GET home page. */
router.get('/', async function(req, res, next) {
  
//работа с бд

const connection =await mysql.createConnection(CONFIG);
const query = Q.get_all_apeals;
const [data] = await connection.execute(query);

//console.log(data);

res.render('all_appeal', { title: 'system-for-handling-requests', appeals: data});

});
module.exports = router;
