//================
//puerto
///===================
process.env.PORT = process.env.PORT || 3000;
//================
//entorno
///===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================
//vencimiento del token
///===================
//60 segundos
//60 minutos
//24 horas
//30 dias
process.env.CADUCIDAD_TOKEN = '48h';
//================
//vencimiento del token
///===================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//================
//entorno
///===================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;
//================
//google Client id
///===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '590277826354-pplsl1o6cuo3u9r3gv6ui36o2pgc93f5.apps.googleusercontent.com';