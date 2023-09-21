const axios = require('axios')
const cheerio = require('cheerio')
const request = require('request-promise')

const API_KEY = '7a1f21b1-37ee-408d-8faf-e32dba21af3c'

async function getUserAgentList(){
    const options = {
        uri: `https://headers.scrapeops.io/v1/user-agents?api_key=${API_KEY}&num_headers=2`,
        // uri: `https://headers.scrapeops.io/v1/browser-headers?api_key=7a1f21b1-37ee-408d-8faf-e32dba21af3c&num_headers=2'`,
        json: true
    };
    const response = await request(options);
    return response.result || [];
}

function getRandomUserAgent(userAgentList){
    const randomIndex = Math.floor(Math.random()*userAgentList.length);
    return userAgentList[randomIndex]
}

(async ()=>{

    const userAgentList = await getUserAgentList();

    const header = {
        'User-Agent':getRandomUserAgent(userAgentList)
    }

    const options = {
        method: 'GET',
        // url: 'http://httpbin.org/headers',
        // url: 'https://www.drogariaspacheco.com.br/medicamentos/dor-e-febre/anti-inflamatorios',
        // url: 'https://www.drogariaspacheco.com.br/medicamentos/Anti-inflamat%c3%b3rios?PS=48&map=c,specificationFilter_146',
        // url: 'https://www.drogariasaopaulo.com.br/medicamentos/Anti-inflamat%C3%B3rios?PS=48&map=c,specificationFilter_180',
        // url: 'https://www.corinthians.com.br/',
        url: 'https://www.drogariaspacheco.com.br/buscapagina?fq=C%3a%2f800%2f&fq=specificationFilter_146%3aAnti-inflamat%c3%b3rios&PS=48&sl=d3e0ddd8-cb3d-47a5-b619-6747a06b74ce&cc=48&sm=0&PageNumber=2',
        headers: header
    }

    try{
        const response = await request(options)
        // console.log(response)

        const $ = cheerio.load(response)
        // const titulo = $('li > a > h3').text()
        // console.log(titulo)

        $('.descricao-prateleira')
        .map((index, element)=>{
            let nome = $(element).find('.colletcion-link').text()
            console.log(nome)
        })
        console.log(response)
    }
    catch (error){
        console.log('error: ', error)
    }
})();