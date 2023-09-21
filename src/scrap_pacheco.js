/**
 * dados medicamentos anti-inflamatorios
 * hora e data do scrap
 * nome farmacia
 * nome remedio
 * preço remedio
 * link com informações do medicamento
 * 
*/
const cheerio = require('cheerio')
const request = require('request')
const time = require('./time')
const classmongo = require('./classmongo')

let dados = {}

async function scrap(pag){   
    
    const options = {
    method: 'GET',
    url: 'https://www.drogariaspacheco.com.br/buscapagina',
    qs: {
        '': '',
        fq: ['C:/800/', 'specificationFilter_146:Anti-inflamatórios'],
        PS: '48',
        sl: 'd3e0ddd8-cb3d-47a5-b619-6747a06b74ce',
        cc: '48',
        sm: '0',
        PageNumber: `${pag}`
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        authority: 'www.drogariaspacheco.com.br',
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'pt-BR,pt-PT;q=0.9,pt;q=0.8,en-US;q=0.7,en;q=0.6',
        cookie: 'az_botm=d6e2804ca90ca4ac1c1e551dd28f3436; az_asm=089CA363FEA58DE3822235B77A5B83F4B80B39E13D6BE49A2132F91FB3D5EE55CF91F9CDAF530E1922365D49DC4F3895286F0D93C32561E5862078CB2B007712; VtexRCMacIdv7=7a8ae9be-95d5-403f-baf6-bdcd965e1401; checkout.vtex.com=__ofid=9c6d1e05df3245fda8c8a87ef5d265b2; CheckoutOrderFormOwnership=; lmd_orig=organic; lmd_traf=organic-1695248808431; urlLastSearch=http://www.drogariaspacheco.com.br/medicamentos/Anti-inflamat%C3%B3rios?PS=48&map=c,specificationFilter_146; IPI=UrlReferrer=https%3a%2f%2fwww.google.com%2f; VTEXSC=sc=1; ISSMB=ScreenMedia=0&UserAcceptMobile=False; SGTS=0994DAA03BCAC015953D68B12F34B6F7; vtex_segment=eyJjYW1wYWlnbnMiOm51bGwsImNoYW5uZWwiOiIxIiwicHJpY2VUYWJsZXMiOm51bGwsInJlZ2lvbklkIjpudWxsLCJ1dG1fY2FtcGFpZ24iOm51bGwsInV0bV9zb3VyY2UiOm51bGwsInV0bWlfY2FtcGFpZ24iOm51bGwsImN1cnJlbmN5Q29kZSI6IkJSTCIsImN1cnJlbmN5U3ltYm9sIjoiUiQiLCJjb3VudHJ5Q29kZSI6IkJSQSIsImN1bHR1cmVJbmZvIjoicHQtQlIiLCJjaGFubmVsUHJpdmFjeSI6InB1YmxpYyJ9; nav_id=48599379-45f4-4724-8fed-1acae7339f32; _tt_enable_cookie=1; _ttp=ADJ8yWyaqYAL8qNXJ9Z5aqJjaO1; legacy_p=48599379-45f4-4724-8fed-1acae7339f32; chaordic_browserId=48599379-45f4-4724-8fed-1acae7339f32; legacy_c=48599379-45f4-4724-8fed-1acae7339f32; legacy_s=48599379-45f4-4724-8fed-1acae7339f32; _vt_shop=2346; analytic_id=1695248813915555; _vt_user=7490927696141212_1_false_false; CYB_ID=7490927696141212; c_64ei=ZmFsc2U=; CYB_AB=1; cybSessionID=1; _DPSP_LGPD-Consentimento_Cookie=isIABGlobal=false&datestamp=Wed+Sep+20+2023+19%3A32%3A52+GMT-0300+(Hora+padr%C3%A3o+de+Bras%C3%ADlia)&version=6.9.0&hosts=&consentId=3619c919-e52d-475a-90a3-902d062dcb98&interactionCount=0&landingPath=NotLandingPage&groups=C0004%3A1%2CC0001%3A1%2CC0003%3A1; _DPSP_LGPD-Consentimento_CookiePublicidade=granted; _DPSP_LGPD-Consentimento_CookieAnalytics=granted; _DPSP_GA=GA1.3.670274977.1695248808; _DPSP_GA_gid=GA1.3.151193503.1695249173; _ga=GA1.1.670274977.1695248808; _gcl_au=1.1.440614892.1695249173; _fbp=fb.2.1695249174350.1815307840; _pm_id=322801695249555636; _hjSessionUser_3397161=eyJpZCI6ImE2ZmQxYjJhLTRkOGEtNWM1MS05NjIyLTczODc3Nzk0OWJjMiIsImNyZWF0ZWQiOjE2OTUyNDg4MTA1NzksImV4aXN0aW5nIjp0cnVlfQ==; vtex_session=eyJhbGciOiJFUzI1NiIsImtpZCI6IjNFNUY4ODA3REI4NTgyNDZGRkIwMUE3MzBERDUzOEU1ODQyMkUzOEUiLCJ0eXAiOiJqd3QifQ.eyJhY2NvdW50LmlkIjoiNTdmOWJjOGItYzlmYi00MzBkLWI1NjQtMzA3NTU1YTRlZWY4IiwiaWQiOiIzNzRkOTY4Yi01ZjM2LTQzYzQtOWI0My02MmNmM2Y2ZTEzOGMiLCJ2ZXJzaW9uIjoyLCJzdWIiOiJzZXNzaW9uIiwiYWNjb3VudCI6InNlc3Npb24iLCJleHAiOjE2OTU5NDA3NTcsImlhdCI6MTY5NTI0OTU1NywiaXNzIjoidG9rZW4tZW1pdHRlciIsImp0aSI6IjYwN2I1MDNmLWQ0YjctNDZlNS04YzQ2LTc4OWU3MjQ2ZTcwNiJ9.c4fj9Xl84rfkXCbPPLUyumqGnpsupm1sB3uLlfVna-KNLAjyD5VEQBAImhELzSzNmCcdbygmPItEbl6ibN5ehA; janus_sid=c8839de6-b0b0-4ba7-a79f-ad10796e3181; VtexRCSessionIdv7=208fd034-443f-4c48-a97e-4e3bfb14bb1a; _pm_sid=682941695257519919; _hjSession_3397161=eyJpZCI6IjBlYzFmNTRkLWM0Y2ItNGMyMS1hNDYyLTExNjY0YzEyZjkwYiIsImNyZWF0ZWQiOjE2OTUyNTc1MjA2MTQsImluU2FtcGxlIjpmYWxzZX0=; OptanonConsent=isIABGlobal=false&datestamp=Wed+Sep+20+2023+21%3A52%3A00+GMT-0300+(Hora+padr%C3%A3o+de+Bras%C3%ADlia)&version=6.9.0&hosts=&consentId=3619c919-e52d-475a-90a3-902d062dcb98&interactionCount=1&landingPath=NotLandingPage&groups=C0004%3A1%2CC0001%3A1%2CC0003%3A1&geolocation=BR%3BCE&AwaitingReconsent=false; OptanonAlertBoxClosed=2023-09-21T00:52:00.709Z; impulsesuite_session=1695257521707-0.9320598992618383; _uetsid=cceb8380580411ee8e2dffa4a51e17d7; _uetvid=ccec02e0580411eeab2c17000265cc1d; _dc_gtm_UA-31155422-1=1; _ga_X010SFPX09=GS1.1.1695257520.3.1.1695258609.58.0.0; _ga_HDQHBSR58M=GS1.1.1695257519.3.1.1695258609.58.0.0; cto_bundle=4MyQJl8wakdXMmNYTFNUVWJ2Q005alJ6NFhERlJ4SEhFVkZ0WDdlYW5la2VQVWRpWUp5SUgzS0Y4OW91c2JETUF6ZDZ3dktGVkIyQUpQR3FTT1pha2lYZWNYdzVLSDRVUFdNdmZRcE1TSUhQOFFkekoxbDNaanp0WjFXWXBqQVQwRkRyVEJhNnVGc0JtbFczdE5wTEsxa2VTNXd4RzRzb3BOa2t5amlOOWd2UURYJTJGRSUzRA',
        dnt: '1',
        'if-none-match': '"3DE2497F8E564739A5ED14C1D037100A"',
        referer: 'https://www.drogariaspacheco.com.br/medicamentos/Anti-inflamat%C3%B3rios?PS=48&map=c,specificationFilter_146',
        'sec-ch-ua': '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest'
    },
    form: {}
    };

    request(options, function (error, response, body) {

        if (error) throw new Error(error);
        
        const farmacia = 'DROGARIASPACHECO'
        let horaScrap = time()
        const $ = cheerio.load(body)  
        

        $('.descricao-prateleira')
            .map((index, element)=>{
                let nome = $(element).find('.collection-link').text()
                let preco = $(element).find('.valor-por > span').text()
                let link = $(element).find('.price > a').attr('href')
                
                dados = {horaScrap, farmacia, nome, preco, link}
                
                classmongo.add(dados)    
            })            
    });
}


const pagFim = 15
let pagAtual = 2

async function main(){
    classmongo.start()

    while(pagAtual <= pagFim){
        await scrap(pagAtual)
        pagAtual++        
    }   

    classmongo.close()
}

main()