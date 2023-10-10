const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose')

app.set('views', [
  path.join(__dirname, 'Agroassist_login_signin'),
  path.join(__dirname, 'Agroassist_services', 'harvesting'),
  path.join(__dirname, 'Agroassist_services', 'post_harvest'),
  path.join(__dirname, 'Agroassist_services', 'planting'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','fertilizer'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','harrow'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','leveling'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','mulching'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','pest'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','ploughing'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','terracing'),
  path.join(__dirname, 'Agroassist_services', 'land_prep','weed_remove')
]);
app.set('view engine', 'ejs')
app.set('view options', { 'debug': true });
app.use(express.urlencoded())
//db initialization
main().catch(err=>console.log(err))
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/Agroassists')
  console.log("Connected to Database")
}

// reading files fs
//const loginHtml = fs.readFileSync(path.join(__dirname, 'Agroassist_login_signin', 'login.html'), 'utf8');
const homehtml = fs.readFileSync(path.join(__dirname,"Agroassist_home",'agroassist.html'),'utf8');
const signinHtml = fs.readFileSync(path.join(__dirname, 'Agroassist_login_signin', 'sign_in.html'), 'utf8');
//const harvestHtml = fs.readFileSync(path.join(__dirname, 'Agroassist_services','harvesting', 'harvest.ejs'), 'utf8');
//const postharvestHtml = fs.readFileSync(path.join(__dirname, 'Agroassist_services','post_harvest', 'post_har.html'), 'utf8');
//const plantingHtml = fs.readFileSync(path.join(__dirname, 'Agroassist_services','planting', 'planting.html'), 'utf8');
//const modalfertilizer = fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','fertilizer', 'land_prep.html'), 'utf8');
//const modalharrow = fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','harrow', 'land_prep.html'), 'utf8');
//const modalleveling = fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','leveling', 'land_prep.html'), 'utf8');
//const modalmulching = fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','mulching', 'land_prep.html'), 'utf8');
//const modalpest = fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','pest', 'land_prep.html'), 'utf8');
//const modalploughing = fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','ploughing', 'land_prep.html'), 'utf8');
//const modalterracing= fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','terracing', 'land_prep.html'), 'utf8');
//const modalweed_remove = fs.readFileSync(path.join(__dirname, 'Agroassist_services','land_prep','weed_remove', 'land_prep.html'), 'utf8');

//get and post methods 

app.get('/', (req, res) => {
  res.send(homehtml);
});

app.get('/sign', (req, res) => {
  res.send(signinHtml);
});
//sign db program
const signSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  mail: String,
  mobile_number: String,
  password: String,
  c_password: String
});

const Sign = mongoose.model('Sign', signSchema);

app.post('/sign', (req, res) => {
  var loli = new Sign(req.body);
  loli.save()
    .then(() => {
      res.send(homehtml); // Make sure 'homehtml' is defined properly
    })
    .catch(() => {
      res.send(signinHtml);
    });
});

//end of db code

//db side user validation login

const db = mongoose.connection;

// Define User schema
const usersSchema = new mongoose.Schema({
 mail: String,
  password: String
});

const User = mongoose.model('User', usersSchema,'signs');

// Middleware to parse JSON in request bodies
app.use(express.json());

// Route for user login
app.post('/login', async (req, res) => {
  console.log(req.body)
  const { mail, password } = req.body;
console.log(mail)
console.log(password)
  try {
    // Find user in the database
    const user = await User.findOne({ mail});

    if (!user) {
      return res.send( 'User not found' );
    }
    console.log(user.password)

    if (user.password  !== password) {
      return res.send( 'Invalid password');
    }

    // User found and password matched
    res.send('Login successful' );
  } catch (error) {
    console.log("error")
    const errorMessage = error && error.message ? error.message : 'An error occurred';
    res.status(500).json({ message: errorMessage });
  }
});


//end of user side validation login
function myRoute(req, res, next) {
  return res.send(signinHtml)
}
function login(req, res, next) {
  req.url = '/sign/login'       
  return app._router.handle(req, res, next)
}
app.get('/sign/login', myRoute)
app.get('/login', login)
        
//harvesting dynamicity
const Harvmodel = mongoose.model('harvest', new mongoose.Schema({ name:String, price:String, description:String }));
app.get('/harvesting',(req,res)=>{
  (async () => {
  try{
const documents =  await Harvmodel.find({})
res.render('harvest.ejs',{documents:documents});
  }catch(err){
    console.log("Error",err)
  }
 
})();
});
//ended harvest dynamicity

//dynamicity in post harvest
const PostHarmodel = mongoose.model('post_harvest',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/postharvesting',(req,res)=>{
  (async()=>{
    try{
      const document_four = await PostHarmodel.find({})
      res.render('post_har.ejs',{document_four:document_four}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})
//ended postharvest dynamicity
//planting dynamicity
const plantmodel = mongoose.model('planting',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/planting',(req,res)=>{
  (async()=>{
    try{
      const document_two = await plantmodel.find({})
      res.render('planting.ejs',{document_two:document_two}) 
    }catch(err){
      console.log("error",err)
    }
  })()
});
//end of planting dynamicity
//dyanmicity in each modal
const fertmodel = mongoose.model('fertilizer',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modfert',(req,res)=>{
  (async()=>{
    try{
      const document_one_a = await fertmodel.find({})
      res.render('land_prep1.ejs',{document_one_a:document_one_a}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


const harrowmodel = mongoose.model('harrow',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modhar',(req,res)=>{
  (async()=>{
    try{
      const document_one_b = await harrowmodel.find({})
      res.render('land_prep2.ejs',{document_one_b:document_one_b}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


const levelmodel = mongoose.model('levelling',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modlev',(req,res)=>{
  (async()=>{
    try{
      const document_one_c = await levelmodel.find({})
      res.render('land_prep3.ejs',{document_one_c:document_one_c}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


const mulmodel = mongoose.model('mulching',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modmul',(req,res)=>{
  (async()=>{
    try{
      const document_one_d = await mulmodel.find({})
      res.render('land_prep4.ejs',{document_one_d:document_one_d}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


const pestmodel = mongoose.model('pesticide',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modpes',(req,res)=>{
  (async()=>{
    try{
      const document_one_e = await pestmodel.find({})
      res.render('land_prep5.ejs',{document_one_e:document_one_e}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


const ploughmodel = mongoose.model('ploughing',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modplo',(req,res)=>{
  (async()=>{
    try{
      const document_one_f = await ploughmodel.find({})
      res.render('land_prep6.ejs',{document_one_f:document_one_f}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


const terramodel = mongoose.model('terracing',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modterra',(req,res)=>{
  (async()=>{
    try{
      const document_one_g = await terramodel.find({})
      res.render('land_prep7.ejs',{document_one_g:document_one_g}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


const weedmodel = mongoose.model('weed_remove',new mongoose.Schema({name:String, price:String, description:String}));
app.get('/modweed',(req,res)=>{
  (async()=>{
    try{
      const document_one_h = await weedmodel.find({})
      res.render('land_prep8.ejs',{document_one_h:document_one_h}) 
    }catch(err){
      console.log("error",err)
    }
  })()
})


//listening on port
app.listen(80, () => {
  console.log('Server is listening on port 80');
});
