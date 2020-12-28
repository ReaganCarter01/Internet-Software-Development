const jwt = require('jsonwebtoken');
const accessTokenSecret = "somestuff";
const express = require('express');
const app = express();
const axios = require ('axios');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const port = process.env.PORT || 3000;
const url = 'mongodb+srv://rgc63:user1234@cluster0.mtays.mongodb.net/dbexample?retryWrites=true&w=majority';
const UserModel = require('./user');
const CartModel = require('./cart');
const StoreModel = require ('./store');


app.use(express.json());
let router = express.Router();


const config = {
   headers: {
   'X-Api-Key': '2668c0a17f5f4e2a8f16e885fcf0ad15'
   }
}



let database;

const initDb = async () => {
   database = await mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true});
   if (database) {
      app.use(session({
         secret:'alittlesecret',
         store: new mongoStore({mongooseConnection:mongoose.connection})
      }));
      app.use(router);
      console.log('Successfully connected to my DB');
   } else {
      console.log('Error connecting to database');
   }
}

const initUsers = async () => {
   const users = [];
   console.log('in init');
   const firstNames = axios.get('https://randommer.io/api/Name?nameType=firstName&quantity=5', config);
   const lastNames = axios.get('https://randommer.io/api/Name?nameType=surName&quantity=5', config);
   const results = await Promise.all([firstNames, lastNames]);

   results[0].data.forEach((name, index) => {
         const firstName = name;
         const lastName = results[1].data[index];
          const email = results[1].data[index] + "@gmail.com";
         users.push({firstName,lastName,email,login: `${firstName}.${lastName}`,password:'pass123',books:[]});
      });
   console.log(users);
   await UserModel.create(users);
};


const initCart = async () =>{
   const users = await UserModel.find({});
   const tempCart = [];
   console.log(users);
   const items = await StoreModel.find({});
   for(let i = 0; i < users.length; ++i){
      const assignedUser = users[Math.floor(Math.random()*users.length)];
      const newItem = {
         item: items[i],
      };
     const createCart = await CartModel.create(newItem);
     assignedUser.cart.push({
        amount: Math.floor(Math.random()*2)+1,
        item: createCart
     });
     await assignedUser.save();
   }
};


const initStore = async () =>{
   const storeItems =[
      {
         item: "gum"
      },
      {
         item: "eggs"
      },
      {
         item: "pumpkin"
      },
      {
         item: "guns"
      },
      {
         item: "water"
      },
      {
         item: "pumpkin spice"
      }

   ];
   await StoreModel.create(storeItems);
}

const populateDb = async () => {
   await StoreModel.deleteMany({});
   await UserModel.deleteMany({});
   await CartModel.deleteMany({});
   await initUsers();
   await initCart();
   await initStore();
}

//authenticate user
const auth = async(req,res,next)=> {
try {
   const authHead = req.headers.authorization;
   if (authHead) {
      const jwtToken = authHead.split('')[1];
      const user = jwt.verify(jwtToken, accessTokenSecret);
      req.user = user;
   }
   else{
      return res.send(403);
   }
}catch(e){
   return res.send(403);
}
   next();
}

const init = async()=>{
  await initDb();
 //  await populateDb();

}

init();

//Req.session
router.get('/',async (req,res)=>{
console.log(`req.session: ${JSON.stringify(req.session)}`);
res.send(200);

});

//Get all users
router.get('/user',  async (req, res) => {

   const foundUser = await UserModel.find({
      firstName: new RegExp(req.query.firstName),
      lastName: new RegExp(req.query.lastName),
      email: new RegExp(req.query.email)


   }).populate('cart');
   res.send(foundUser ? foundUser:404);
});

//Get Store items based upon input

router.get('/StoreItem', async (req, res) => {
   const foundUser = await StoreModel.find({
      item: new RegExp(req.query.item),
   }).populate('store');
   res.send(foundUser ? foundUser:404);
});

//Get store items based on id
router.get('/StoreItem/:id', async (req, res) => {

   const foundItem = await StoreModel.findById(req.params.id);
 if(!req.session.lastItemViewed){
   req.session.lastItemViewed = [foundItem];
}
else{
   req.session.lastItemViewed.push(foundItem);
}
   res.send(req.session.lastItemViewed? foundItem:404);

});

//Get user based on id
router.get('/user/:id', async (req,res)=>{
   const foundUser = await UserModel.findById({_id: req.params.id}).lean();
   if(!req.session.lastUserViewed) {
      req.session.lastUserViewed = [foundUser];
   }else{
      req.session.lastUserViewed.push(foundUser);
   }
   res.send(foundUser?foundUser:404);

});

router.get('/StoreItem/Recent',async (req,res)=>{
   if(req.session.lastItemViewed){
      res.send(req.session.lastItemViewed)
   }
   else {
      res.send(404)
   }

})

//Post a new user
router.post('/user', async (req,res)=> {
   const newUser = await UserModel.create(req.body);
   res.send(newUser ? newUser:500);
});

//post a new item into cart
router.post('/cart/:id/cartItem', async(req, res) => {
   const newItem = await CartModel.create(req.body);
   res.send(newItem ? newItem:500);
});

//Empties the cart
router.delete('/user/:id/cart', async (req,res) =>{
   const deleteCart = await UserModel.find(req.params.cart).populate('cart');

   if(deleteCart){
      deleteCart.cart.forEach(cart => cart.remove());
   }
   res.send(deleteCart ? deleteCart : 404);
});


//update the cart
router.put('/user/:id/cart',auth,async (req,res)=>{
   if(!req.body.cart){
      res.send(422)
      return;
   }
   const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,req.body,{returnOriginal: false});
   res.send(updatedUser ? updatedUser: 404);
})

//Updates the user
router.put('/user/:id',auth,async (req,res)=>{
   if(!req.body.firstName||!req.body.lastName){
      res.send(422)
      return;
   }
   const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,req.body,{returnOriginal: false});
   res.send(updatedUser ? updatedUser: 404);
    });

//Get users cart
router.get('/user/:id/cart',async (req, res) => {
   const foundUser = await CartModel.find().populate('cart');
   const readCart = foundUser;
   res.send(readCart ? foundUser:404);
});

//Delete a certain item through the cart
router.delete('/cart/:id/cartItem/:id', async (req, res) =>{
   const user = await CartModel.findByIdAndDelete(req.params.id).populate('user');
   res.send(user ? user:404);
});

//updates the cart
router.put('/cart/:id',auth,async (req,res)=>{
   if(!req.body.item) {
      res.send(422)
      return;
   }
      const updatedCart = await CartModel.findByIdAndUpdate(req.params.id, req.body, {returnOriginal: false})

   res.send(updatedCart ? updatedCart: 404 )

      console.log(e);

});

//updates Store items
router.put('/storeItem/:id',auth,async (req,res)=>{
   if(!req.body.item){
      res.send (422)
      return;
   }
      const updatedStore = await CartModel.findByIdAndUpdate(req.params.id,req.body,{returnOriginal: false})

   res.send(updatedStore ? updatedStore: 404);
});

//Get store item
router.get('/StoreItem/:id',async (req, res) => {
   let temp;
   if(req.query.R){
      temp = StoreModel.filter((storeItems)=>{
         return storeItems.name.includes(req.query.num);
      });
   }
   res.send(temp);
});


//For login and jwt
router.post('/user/login',async (req,res)=>{
   const {login,password} = req.body;
   const foundUser = await UserModel.findOne({login,password});
if(foundUser){
   const accessToken = jwt.sign({user:foundUser},accessTokenSecret);
   res.send(accessToken);
}else{
   res.send(403);
}

});

app.listen(port, () => console.log('listening on port'));