const express = require('express')
const app = express()
const db= require('./routes/dbfunc')
const cors =require('cors')
const bcrypt = require('bcrypt')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override');
const Counselmodel = require('./db/CounselSchema')

app.use(methodOverride('_method'));

//passport initiation, local strategy
const LocalStrategy = require('passport-local').Strategy

function initializepassport(passport) {
  //the local strategy used
  passport.use(new LocalStrategy(async function (username, password, done){
    const user = await db.databasefindbyusername(username)
    if (user == null) {
      console.log('No user with that username')
      return done(null, false)
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    } catch (e) {
      return done(e)
    }
  }));

  passport.serializeUser((user, done) => done(null, user._id))
  passport.deserializeUser(async (id, done) => {
    req_id= await db.databasefindbyid(id)
    return done(null, req_id)
  })
}
initializepassport(passport);

app.use(session({
  secret: 'upa12ua5a022ljrvaihana2ns0',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.set('view-engine', 'ejs')
app.use(cors());
app.use(express.urlencoded({ extended: false }))
app.use(express.json());


app.get('/', checkAuthenticated, (req, res) => {
  res.render('dash.ejs')
})

app.use('/dashboard',checkAuthenticated, (req,res)=>{
  res.send(req.user);
});
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('homepage.ejs')
})

app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login' 
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('homepage.ejs')
})

app.post('/register',checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    databasecheck = await db.databasefindbyusername(req.body.username);
    if(databasecheck == null){
    await db.databaseinsert(
      req.body.username,
      hashedPassword,
      req.body.name,
      req.body.email,
      req.body.ph
      )
    res.redirect('/login')
    }
    else{
      res.redirect('/register')
    }
  } catch(error) {
    console.log("error in registering"+ error)
    res.redirect('/register')
  }
})
app.use('/counsellors',checkAuthenticated, async (req,res)=>{
Counselmodel.find({  })
        .then((data) => {
            res.send(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  return next()
}


app.listen(3000)