const Sequelize = require('sequelize');
const Library = require('../models/libSequelize');

let borrowedBooks = [];
exports.getBook = async(req, res, next) => {
    try{
        const data = await Library.findAll();
        console.log(data);
        res.json(data);
    } catch (error) {
        console.log(" Get book is failing", JSON.stringify(error));
        res.status(500).json({error: error})
    }
};

exports.addBook = async (req, res, next) => {
    const { title } = req.body;
    console.log("Received POST request for adding book:", req.body);
    if(!title){
        console.log('missing req fields');
        return res.sendStatus(500);
    }

    try{

        const borrowedBook = await Library.create({
            title: title,
            borrowedAt: new Date(),
            returnBy: new Date(Date.now() + 60 * 60 * 1000),
            fineAmount: 0
        });

        console.log('updated success');

        res.status(201).json(borrowedBook)
    } catch (error) {
        console.log(error, JSON.stringify(error))

        res.status(501).json({error})
    }
}

exports.payFine = async(req, res, next) => {
    try{
        for (const book of borrowedBooks) {
            await Library.update({ fineAmount: book.fineAmount }, {where: { id: book.id } });

        }
        borrowedBooks = [];

        return res.status(200).json({ success: true, message: 'Fine paid successfully'});

    } catch (error){
        console.error('Error paying fine: ', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

