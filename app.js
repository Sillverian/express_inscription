const express = require('express');
const session = require('express-session');
const flash = require('express-flash-messages');

const app = express();

//DAO
const DAO = require('./dao');
const userDAO = new DAO('users');

//Password Crypto
const bcrypt = require('bcrypt');

// Middlewares
const upload = require('./middlewares/upload-middlewares');

//Config de PUG
app.set('views', './views');
app.set('view engine', 'pug');

//Def. ressources statiques
app.use('/bootstrap', express.static('node_modules/bootstrap/dist/'));

//Recup saisie
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Session
app.use(session({
    secret: '123',
    name: 'appSession',
    saveUninitialized: true,
    resave: true
}));

//A instantier apres la session
app.use(flash());


// -- ROUTES --

// Accueil
app.get('/', (req, res) => {
    res.render('home');
});

// Formulaire inscription
app.get('/inscription', (req, res) => {
    res.render('inscription-form');
});

// Traitement Inscription
app.post('/inscription', upload.singlePhoto, (req, res) => {
    //console.log(req.body);

    if (req.body.pass.length >= 8 && req.body.pass.length <= 15) {
        console.log('ok longueur');

        if (req.body.pass === req.body.passConfirm) {
            console.log('ok pass identique');

            if (req.body.email === req.body.emailConfirm) {
                console.log('ok mail identique');

                if (userDAO.findOneBy('email', req.body.email)) {
                    console.log('ok mail existant');
                    req.flash('danger', 'email existant dans la BDD');
                    res.redirect('/inscription');
                }
                else {
                    bcrypt.hash(req.body.pass, 5, function (err, hash) {
                        console.log('ok crypt');
                        
                        let data = {
                            lastName : req.body.lastName,
                            firstName : req.body.firstName,
                            email : req.body.email,
                            hashPass : hash,
                            bio : req.body.bio
                        };

                        console.log(data);

                        userDAO.insertOne(data);    
                    });
                    req.flash('info', 'formualire envoyé');
                    res.redirect('/');
                }
            } else {
                req.flash('danger', "Les adresses email doivent être identiques");
                res.redirect('/inscription');
            }
        }
        else {
            req.flash('danger', "Les mot de passe doivent être identiques");
            res.redirect('/inscription');
        }
    }
    else {
        req.flash('danger', "Les mot de passe doivent comporter entre 8 et 15 caracteres");
        res.redirect('/inscription');
    }
});

//Lancement serveur
app.listen(3000, () => console.log('Server Started...'));