import React from 'react';

export default class Greetings extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            greeting: false
        }
        this.toggle = this.toggle.bind(this);

    }
    showGreeting(){
        if(this.state.greeting){
            return (<span>"Hello World"</span>)
        }
    }

    toggle(){
        this.setState({greeting:!this.state.greeting})
    }

    render(){
        return(
            <div>
                <span>
                    {this.showGreeting()}
                </span>
                <button onClick={() => this.setState({greeting:true})}>
                    Say hello!
                </button>
            </div>
        )
    }
}