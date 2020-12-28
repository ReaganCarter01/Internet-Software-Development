import React from 'react';
import axios from 'axios';
import './UserCart.css'
import StoreItem from "../StoreItem/StoreItem";
var ScrollArea = require('react-scrollbar');

class UserCart extends React.Component{
    constructor() {
        super();
        this.state = {
            cartItems: '',
            userId:''
        }
        this.populateCart = this.populateCart.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onStore = this.onStore.bind(this);
    }

    onStore(event){
        this.setState({onStore:event.target.value})
    }



    async handleSubmit(itemID){
        try{
            const headers ={
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            await (axios.delete(`http://localhost:8080/cart/${this.props.user.cart}/cartItem/${itemID}`,{headers})).data;

        }catch (e) {
            console.log(e)
        }

    }

    async populateCart(event){
        try{
            const headers ={
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const response = (await axios.get(`http://localhost:8080/user/${this.props.user._id}/cart`,{headers})).data;
            console.log(response);
            const cartListItems =[];
            response.cartItems.forEach(cartItem =>{
                cartListItems.push( <span > <div className="item"><button onClick={()=>this.handleSubmit(cartItem._id)} >Remove</button><div> Amount: {cartItem.quantity}</div> {cartItem.storeItem.name}</div></span> )
            });
            this.setState({cartItems:cartListItems})
        }catch(e){
            console.log(e);
        }
        event.preventDefault()

    }

    showCart(){
        if(this.state.populateCart){
            return(
            <div>
                <StoreItem user = {this.props.user} accessToken = {this.props.accessToken}/>
                <button className="cartButton" onClick={this.populateCart} onChange={this.onStore}>Cart</button>
            </div>
            )
        }else {
            return (
                <div>
                    <StoreItem user = {this.props.user} accessToken = {this.props.accessToken}/>
                    <button className="cartButton" onClick={this.populateCart} onChange={this.onStore}>Cart</button>
                    <ul className="item-container" >{this.state.cartItems}</ul>
                </div>

            )
        }

    }

render(){
    return(
    <div >

        Hello {this.props.user.firstName}

        {this.showCart()}

    </div>

    )
}
}
export default UserCart