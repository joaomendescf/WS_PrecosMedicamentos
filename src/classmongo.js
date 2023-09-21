const mongoose = require('mongoose')
const connection = require('./connection')
const medicamento = require('./schema_bd')


const classmongo = {
    start: async()=>{
        connection();
    },

    add: async(dt)=>{
        const novoDado = new medicamento({
            horaScrap:dt.horaScrap,
            farmacia:dt.farmacia,
            nome:dt.nome,
            preco:dt.preco,
            link:dt.link,
        })
        
        medicamento.find({'nome':dt.nome})
        .then(function(res){
            if(res.length===0){
                novoDado.save();
                console.log('DADOS REGISTRADOS!')
            }
            else{
                console.log('Medicamento já existente!')
            }
        })
        .catch(function (err){
            console.log(err)        
        })    
    },
    contarregistros: async()=>{
        try{
            let nrdados = await medicamentos.find({}).countDocuments();
            let dadosraspados = Math.round(nrdados/1000)
            return dadosraspados
        }catch(error){
            console.log('Erro ao contar registros:')
        }
    },
    close: async()=>{
        await setTimeout(()=>{
            mongoose.connection.close();
            console.log('Conexão com MONGODB finalizada!');
        }, 30000)       
    }
}

module.exports = classmongo;