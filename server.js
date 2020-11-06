const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserSchema = require('./users');

const UserModel = mongoose.model('UserModel', UserSchema);

mongoose.connect('mongodb://localhost/pagination', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('DB connection successful!'));

const db = mongoose.connection;

db.once('open', async () => {
    if(await UserModel.countDocuments().exec() > 0) {
        return
    }

    Promise.all([
        UserModel.create({ name: 'User 1' }),
        UserModel.create({ name: 'User 2' }),
        UserModel.create({ name: 'User 3' }),
        UserModel.create({ name: 'User 4' }),
        UserModel.create({ name: 'User 5' }),
        UserModel.create({ name: 'User 6' }),
        UserModel.create({ name: 'User 7' }),
        UserModel.create({ name: 'User 8' }),
        UserModel.create({ name: 'User 9' }),
        UserModel.create({ name: 'User 10' }),
        UserModel.create({ name: 'User 11' }),
        UserModel.create({ name: 'User 12' }),
        UserModel.create({ name: 'User 13' }),
        UserModel.create({ name: 'User 14' }),
        UserModel.create({ name: 'User 15' })
    ]).then(() => console.log('Added Users!'))

})

const paginatedResults = (model) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page ? req.query.page : 1);
        const limit = parseInt(req.query.limit ? req.query.limit : 5);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if (endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        try {
            results.resultModel = await model.find().limit(limit).skip(startIndex);
            res.paginatedResult = results;
            next();
        } catch (e) {
            console.log(e);
            res.status(400).json({
                status: 'fail',
                message: e
            })
        }
    }
}

app.get('/users', paginatedResults(UserModel), (req, res) => {
    res.json(res.paginatedResult)
})

app.listen(5000, () => console.log('App started on port 5000...'))