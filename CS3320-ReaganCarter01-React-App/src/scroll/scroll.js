import React, { PureComponent } from 'react'

import axios from "axios";
import PerfectScrollbar from 'react-perfect-scrollbar'

export default class ScrollableContainer extends PureComponent {
    constructor() {
        super()

        this.state = {
            itemStore: '',
            recentlyView: '',
            counter: 0
        };

        this.addItem = this.addItem.bind(this)
        this.recentView=this.recentView.bind(this)
        this.viewItem = this.viewItem.bind(this)
        this.container = null
    }

    onStore(event) {
        this.setState({itemStore: event.target.value})

    }






    async addItem(itemID) {

        try {


            const storeItem = {
                storeItemId: itemID,
                quantity: 1

            }
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            console.log(storeItem)
            const response = (await axios.post(`http://localhost:8080/cart/${this.props.user.cart}/cartItem`, storeItem, {headers})).data;
            console.log(response);
            this.setState({cartItem: storeItem})

        } catch (e) {
            console.log(e);
        }

    }

    async viewItem(itemID) {
        const headers = {
            'Authorization': `Bearer: ${this.props.accessToken}`
        }
        const item =  {
            itemID
        }
        console.log(itemID)
        console.log(item)
       const response = await axios.get(`http://localhost:8080/StoreItem/${(itemID)}`,{headers});
console.log(response)
    }


    buildItems() {
        return this.props.item.map(item => {
            return (

                <div className="item" key={item.name}>

                    <button onClick={() => this.addItem(item._id)}> Add Item</button>
                    <button onClick={() => this.viewItem(item._id)}>View</button>
                    {item.name}

                </div>


            )
        })
    }


    async recentView(event) {
        try {
            const headers = {
                'Authorization': `Bearer: ${this.props.accessToken}`
            }
            const response = await axios.get(`http://localhost:8080/storeItem/Recent`,{headers},{params:{num:10}})
            console.log(response)
            const viewItems = [];
            response.recentlyView.forEach(recent =>{
                viewItems.push(<div>{recent.name}</div>)
            })
            this.setState({recentlyView:viewItems})
        } catch (e) {
            console.log(e)

        }
        event.preventDefault()
    }


    buildControls() {
        return (
            <div>
                <button type="button"  onClick={this.recentView}>Recently Viewed</button>
                <ul>{this.recentView}</ul>
            </div>
        )
    }

    render() {
        return (
            <div>
                <ul
                    className="item-container"
                    ref={node => {
                        this.item = node

                    }}
                 >
                    {this.buildItems()}
                </ul>
                {this.buildControls()}
            </div>
        )
    }
}
