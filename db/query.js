const pool = require('./config');

const findAll = () => {
  return pool.query('SELECT * FROM contacts ORDER BY LOWER(nama) ASC');
}

const findOne = (nama) => {
  return pool.query(`SELECT * FROM contacts WHERE LOWER(nama) = '${nama}'`);
}

const deleteOne = (nama) => {
  return pool.query(`DELETE FROM contacts WHERE nama = '${nama}'`);
}

const insertOne = (newContact) => {
  const {nama, email, nohp} = newContact;
  return pool.query(`INSERT INTO contacts VALUES ('${nama}', '${email}', '${nohp}') RETURNING *`);
}

const updateOne = (newContact) => {
  const { oldNama, nama, email, nohp } = newContact;
  return pool.query(
    `UPDATE contacts SET nama = '${nama}', email = '${email}', nohp = '${nohp}'  WHERE nama = '${oldNama}'`,
  );
}


module.exports = { findAll, findOne, insertOne, deleteOne, updateOne };