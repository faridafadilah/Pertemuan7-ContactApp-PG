const Pool = require('pg').Pool;

const pool = new Pool({
	host: "localhost",
	user: "postgres",
	port: 5432,
	password: "rida443355",
	database: "db_contacts"
});

module.exports = pool;
// // pool.connect(error => {
// 	if(error){
// 		return console.log('koneksi gagal');
// 	} else {
// 		return console.log('Koneksi Berhasil');
// 	}
// });