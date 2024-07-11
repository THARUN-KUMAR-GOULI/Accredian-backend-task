const express = require('express');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const cors = require('cors');
const req = require('express/lib/request');
const res = require('express/lib/response');

const app = express();
const port = 3001;

app.use(bodyparser.json());
app.use(cors());

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'admin',
    database:'accredianassignment'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log("MySQL connected");
});


const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'tharun.project.123@gmail.com',
        pass:'tcbr jopy djpd iyln'
    }
});


app.post('/api/referral', (req, res) => {
    const{name, email, number} = req.body;

    const sql = 'INSERT INTO referralpage(name, email, number) VALUES(?, ?, ?)';
    db.query(sql, [name, email, number], (err, result) => {
        if(err){
            return res.status(500).json({error:err.message});
        }


        const mailOptions = {
            from:'tharun.project.123@gmail.com',
            to:email,
            subject:'Referral submission',
            text:`Hello ${name}, \n\n Your Referral was succesfully submitted`
        };

        transport.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error, "error sending email");
                return res.status(500);
            }
            res.status(200).json({ message: 'Form submitted successfully, Check email'});
        });
    });
});


app.listen(port, () => {
    console.log(`server running on port ${port}`);
});