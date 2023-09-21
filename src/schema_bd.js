const mongoose = require('mongoose')

const medicamento = mongoose.model(
    'medicamentos',
    mongoose.Schema({
        horaScrap:String,
        farmacia:String, 
        nome:String,
        preco:String, 
        link:String
    })
);

// const medicamentos = mongoose.model('medicamentos', schema);

module.exports = medicamento;