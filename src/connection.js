const mongoose = require('mongoose')

function connection(){
    let usuario = ''
    let senha = ''

    if(process.env.NODE_ENV !== 'producao'){
        require('dotenv').config()
        usuario = process.env.BD_USER
        senha = process.env.BD_PASS
    }else{
        usuario = process.env.BD_USER
        senha = process.env.BD_PASS
    }

    const URL = `mongodb+srv://${usuario}:${senha}@cluster0-aws.avy9j6m.mongodb.net/?retryWrites=true&w=majority`

    mongoose.connect(URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true
        })
        .then(result=>{
            console.log('Conexão estabelecida!');
        })
        .catch(error=>{
            console.log(`Erro apresentado: ${error}`)
        })
}

module.exports = connection;