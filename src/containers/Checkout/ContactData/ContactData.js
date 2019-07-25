import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import classes from './ContactData.css';
import axios from '../../../axios-orders';

class ContactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: ''
        },
        loading: false
    };

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({loading: true});
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                address: {
                    street: 'Test Street',
                    zipCode: '3445',
                    country: 'Ukraine'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'standard'
        };

        axios.post('/orders.json', order)
            .then(response => {
                this.setState({loading: false, purchasing: false});
                this.props.history.push('/');
                console.log(response);
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
                console.log(error)
            });
    }

    render() {
        let form = (
            <form>
                <Input inputtype='input' type="text" name="name" placeholder='Your name'/>
                <Input inputtype='input' type="email" name="email" placeholder='Your email'/>
                <Input inputtype='input' type="text" name="street" placeholder='Street'/>
                <Input inputtype='input' type="text" name="postal" placeholder='Postal code'/>
                <Button btnType='Success' clicked={this.orderHandler}>ORDER</Button>
            </form>
        );
        if (this.state.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}
            </div>
        )
    }
}

export default ContactData;