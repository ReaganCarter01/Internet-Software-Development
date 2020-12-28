const express = require('express');
const app = express();
app.use(express.json());

//Variables that will be used later or as counters
let nextItemId = 0;
let cartID = 0;
let quantity = 1;
let storeItem = 0;
let nextUserId = 0;

//empty arrays later to be used
let carts = [];
let users = [];

//User Info t
let userInfo = {
   firstName:"firstname",
   lastName: "lastName",
   Email: "aaa@yahoo.com",
   id: nextItemId,
   cart:[]
}

//
let cartInfo ={
   id: cartID,
   name: "gum",
   quantity: 1

}


users.push(userInfo);
userInfo.cart.push(cartInfo);

const storeItems =[
    {
   storeId: 1,
       name: "gum"
},
   {
      storeId: 2,
      name: "eggs"
   },
   {
      storeId: 3,
      name: "pumpkin"
   },
   {
      storeId: 4,
      name: "guns"
   },
   {
      storeId: 5,
      name: "water"
   },
   {
      storeId: 6,
      name: "pumpkin spice"
   }

];



//Gets the users in the users array list
app.get('/user',(req, res) => {
   res.send(users);
});

//gets the user info given the id
app.get('/user/:id',(req,res) =>{
   const user = users.find(c => c.id === parseInt(req.params.id));

   if(!user) res.status(400).send('The user with the given ID was not found')
   res.send(user);
});

//Creates a new user with id,firstName,lastName,Email,and an empty cart for initializing
app.post('/user',(req, res) => {
   let newUser ={};
     newUser.id = nextUserId++;
     newUser.firstName = req.body.firstName;
     newUser.lastName = req.body.lastName;
     newUser.Email = req.body.Email;
     newUser.cart = [];

     users.push(newUser);
     res.send(newUser);
});

//Gets the user's cart based upon the user id
app.get('/user/:id/cart',(req, res) => {
   const user = users.find(c => c.id === parseInt(req.params.id));

   if(!user) res.status(404).send('The user with the given ID was not found');
   res.send(user.cart);
});

//Empties the entire cart
app.delete('/user/:id/cart',(req,res)=> {
   const user = users.find(c => c.id === parseInt(req.params.id));
   user.cart.splice(user.cart);
   res.send(user.cart);
});

//Adds a new item to the cart
app.post('/cart/:id/cartItem',(req, res) => {
   let carts = req.body;
   carts.id = cartID++;
   carts.name = req.body.name;
   carts.quantity = quantity++;

   userInfo.cart.push(carts);
   res.send(carts);
});

//Deletes a single item from the cart based upon the id
app.delete('/cart/:id/cartItem/:cartItemId',(req, res) =>{
   const user = users.find(c => c.id === parseInt(req.params.id));
   user.cart.splice(user.cart,1);
   res.send(user.cart);
});

//Get store item's details
app.get('/StoreItem/:storeId',(req, res) => {
   const foundItem = storeItems.find(c => c.storeId === parseInt(req.params.storeId));

   if(!foundItem) res.status(404).send('The user with the given ID was not found');
   res.send(foundItem);
});

//Get all items that satisfy the name query
app.get('/StoreItem',(req, res) => {
   let temp;
   if(req.query.name){
      temp = storeItems.filter((storeItems)=>{
         return storeItems.name.includes(req.query.name);
      });
   }
   res.send(temp);
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log('listening on port'));