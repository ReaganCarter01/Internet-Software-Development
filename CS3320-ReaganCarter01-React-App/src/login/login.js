import React from 'react';
import axios from 'axios';
import './login.css';
import UserCart from '../UserCart/UserCart.js';
import StoreItem from "../StoreItem/StoreItem";

class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            login:'',
            password:'',
            jwt:'',
            userId:'',
            cart:[]
        }
        this.loginEventHandler = this.loginEventHandler.bind(this);
        this.loginInput = this.loginInput.bind(this);
        this.passwordInput = this.passwordInput.bind(this);

    }

    loginInput(event){
        this.setState({loginName:event.target.value})
    }

    passwordInput(event){
        this.setState({loginPass:event.target.value})
    }


    async  loginEventHandler(event) {
        try{
        const loginBody = {
            login: this.state.loginName,
            password: this.state.loginPass
        }

        const response = (await axios.post('http://localhost:8080/user/login', loginBody)).data;
        console.log(response);
        this.setState({accessToken: response.accessToken, user: response.user});
    }catch(err){
            console.log(err);
        }
        event.preventDefault();
        {alert("Welcome " + this.state.user.firstName)}
}





    loginForm(){
        if(this.state.user){
            return (
                <div>
                    <UserCart user = {this.state.user} accessToken = {this.state.accessToken}/>
                    {alert("Logging in as " + this.state.loginName)}
                </div>
            )
        }else{
            return(
                <div className="container">
                    <label htmlFor="uname"><b>Username</b></label>
                    <input  className="loginName"  onChange={this.loginInput} />
                    <label htmlFor="psw"><b>Password</b></label>
                    <input type="password" className= "loginPass" onChange={this.passwordInput} />
                    <button className="loginButton" onClick={this.loginEventHandler}> Login in</button>
                </div>
            )
        }
    }





render(){
        return(
          <div className="Login">
              {this.loginForm()}
          </div>
        )
}
}

export default Login