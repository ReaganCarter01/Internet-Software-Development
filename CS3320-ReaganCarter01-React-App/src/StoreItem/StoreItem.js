import React from 'react';
import axios from 'axios';
import './StoreItem.css'
import ScrollableContainer from "../scroll/scroll";
import UserCart from "../UserCart/UserCart";

class StoreItem extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            storeItem: ''
        }
        this.populateStore = this.populateStore.bind(this);
        this.storeInput = this.storeInput.bind(this);

    }

    storeInput(){
        this.populateStore()
    }


    async populateStore(event){
        try{
            const headers ={
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            await axios.get(`http://localhost:8080/storeItem/`,{headers})
     .then(res=>{
                this.setState({storeItem:res.data
                })
            })
        }catch(e){
            console.log(e);
        }
        event.preventDefault();
    };



    welcomeUser(){
        if(this.state.storeItem){
            return (
                <div>
                    <button className="itemButton" onClick={this.populateStore} >Store</button>
                   <ScrollableContainer item = {this.state.storeItem}  user= {this.props.user} accessToken ={this.props.accessToken}/>

                </div>
            )
        }else{
            return(
                <div className="container">
                    <button className="itemButton" onClick={this.populateStore} onChange={this.storeInput}>Store</button>
                </div>
            )

        }

    }

    render(){

        return(
            <div>

                {this.welcomeUser()}

            </div>

        )
    }
}
export default StoreItem