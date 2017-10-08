'use strict'

const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const collectionName = 'Lightinings'


let lightningSchema = new Schema({
    tag: String,
    latitud: Number,
    longitude: Number,
    altitud: Number,
    polarity: Number,
    md: Number,
    mc: Number,
    date: Date
});

let Lightning = mongoose.model('Lightining', lightningSchema, collectionName);

module.exports = Lightning;