//================
//puerto
///===================
process.env.PORT = process.env.PORT || 3000;
//================
//entorno
///===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//================
//entorno
///===================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://Mariano:QpSGT8lRGOw6zk1v@cluster0.qwr6k.mongodb.net/Cafe';
}
process.env.URLDB = urlDB;