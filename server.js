const express = require('express'); // Framework express
const bodyParser = require('body-parser'); // BodyParser dari express
const expressLayouts = require('express-ejs-layouts'); // Module layouts ejs
const methodOverride = require('method-override'); // Module method-override untuk method put, delete
const morgan = require('morgan'); // Morgan untuk mencatat semua request dan response 
// Flash Message
const session = require('express-session');
const cookParser = require('cookie-parser');
const flash = require('connect-flash');
const {
  body,
  check,
  validationResult
} = require('express-validator'); // Module Validasi


const app = express(); // Express
const port = 3000; // port

// Database dan Controller
const db = require('./db/query');
const pool = require('./db/config');

// Morgan 
app.use(morgan('dev'));

//setup ejs
app.set('view engine', 'ejs'); //menggunakan ejs 
app.use(expressLayouts); //third-party middleware
app.use(express.static('public')); //built middleware

// Setup method Override
app.use(methodOverride('_method'));

//konfigurasi flash
app.use(cookParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// Konfigurasi bodyparser
app.use(bodyParser.json()); 
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// Menampilkan Halaman Home
app.get('/', (req, res) => {
  res.render('index', {
    nama: 'Farida',
    title: 'Halaman Index',
    layout: 'layouts/main-layouts'
  });
});

// Menampilkan Halaman About
app.get('/about', (req, res) => {
  res.render('about', { 
    nama: 'Farida Fadilah',
    deskripsi: 'Peserta Bootcamp Batch #3',
    title: 'Halaman About',
    layout: 'layouts/main-layouts' 
  });
});

// Menampilkan Data Contact
app.get('/contact', async (req, res) => {
  // Mencari Semua Data Contact
  const find = await db.findAll();
  // const contacts = find.rows;
    res.render('contact', {
    layout: "layouts/main-layouts",
    title: "ExpressJS",
    contacts: find.rows,
    msg: req.flash('msg')
  });
});

// Menambah Data Contact
app.get('/contact/add', (req, res) => {
  res.render('create', {
    title: 'Halaman Tambah Data',
    layout: 'layouts/main-layouts'
  });
});

// Proses Mengirim Data
app.post('/contact', [
  // Validasi Data
  body('nama').custom( async(value) => {
    // Mencari Data duplikat
    const contact = await db.findOne(value.toLowerCase());
    const duplikat = contact.rows[0];
    if (duplikat) {
      throw new Error('Nama sudah terdaftar!');
    }
    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'No HP tidak Valid!').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('create', {
      title: "ExpressJS",
      layout: "layouts/main-layouts",
      errors: errors.array(),
    });
  } else {
    // Tambah Data 
    db.insertOne(req.body);
    req.flash('msg', 'Berhasil Menyimpan Data!');
    res.redirect('/contact');
  }
});

//Delete Contact
app.delete('/contact', async(req, res) => {
  // Delete Data contact
	db.deleteOne(req.body.nama.toLowerCase());
  req.flash('msg', 'Data Berhasil di Hapus!');
	res.redirect('/contact');
});

//Halaman Edit Contact
app.get('/contact/edit/:nama', async (req, res) => {
  // Load Contact 
  const find = await db.findOne(req.params.nama.toLowerCase());
  res.render('edit', {
    layout: "layouts/main-layouts",
    title: "ExpressJS",
    contact: find.rows[0]
  });
});

//proses Mengubah Data contact
app.put('/contact', [
  // Cek Validasi Input
  body('nama').custom( async(value, { req }) => {
    const contact = await db.findOne(value.toLowerCase());
    const duplikat = contact.rows[0];
    if (value !== req.body.oldNama.toLowerCase() && duplikat) {
      throw new Error('Nama sudah terdaftar!');
    }
    return true;
  }),
  check('email', 'Email tidak valid!').isEmail(),
  check('nohp', 'No HP tidak Valid!').isMobilePhone('id-ID')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.render('edit', {
      title: "ExpressJS",
      layout: "layouts/main-layouts",
      errors: errors.array(),
      contact: req.body,
    });
  } else {
    // Update Data
    db.updateOne(req.body);
    req.flash('msg', 'Update Data Berhasil!');
    res.redirect('/contact');
  }
});

// Detail Contact Berdasarkan Nama
app.get('/contact/:nama', async(req, res) => {
  // Load Contact
  const find = await db.findOne(req.params.nama.toLowerCase());
  res.render('detail', {
    title: 'Halaman Detail Data',
    layout: 'layouts/main-layouts',
    contact: find.rows[0]
  });
});

app.listen(port, () => {
  console.log('Server is running....');
});