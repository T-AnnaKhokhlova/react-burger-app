import React, { Component } from 'react';

import Aux from '../../hoc/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.3,
    cheese: 0.5,
    meat: 1.3,
    bacon: 1.4
}
class BurgerBuilder extends Component {
    state = {
        ingredients: {
            'cheese': 0,
            'meat': 0,
            'salad': 0,
            'bacon': 0
        },
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false
    };

    updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                console.log(ingredients[igKey]);
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        this.setState({purchasable: sum > 0 });
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice + priceAddition;
        this.setState({ingredients: updatedIngredients, totalPrice: updatedPrice});
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if (oldCount <= 0) {
            return;
        }
        const updatedCount = oldCount - 1;
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICES[type];
        const oldPrice = this.state.totalPrice;
        const updatedPrice = oldPrice - priceDeduction;
        this.setState({ingredients: updatedIngredients, totalPrice: updatedPrice});
        this.updatePurchaseState(updatedIngredients);
    }

    purchasingHandler = () => {
        this.setState({purchasing: true});
    }

    backdropClickHandler = () => {
        this.setState({purchasing: false});
    }

    cancelOrderButtonHandler = () => {
        this.setState({purchasing: false});
    }

    continueOrderButtonHandler = () => {
        this.setState({loading: true});
        //alert('You continue!')
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
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
                console.log(response);
            })
            .catch(error => {
                this.setState({loading: false, purchasing: false});
                console.log(error)
            });
    }

    render () {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <=0;
        }
        let orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            cancelOrderButtonHandler={this.cancelOrderButtonHandler}
            continueOrderButtonHandler={this.continueOrderButtonHandler}
            price={this.state.totalPrice}/>
        if (this.state.loading) {
            orderSummary = <Spinner/>
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} clicked={this.backdropClickHandler}>
                    {orderSummary}
                </Modal>
                <Burger ingredients={this.state.ingredients}/>
                <BuildControls
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemoved={this.removeIngredientHandler}
                    disabled={disabledInfo}
                    price={this.state.totalPrice}
                    purchasable={this.state.purchasable}
                    ordered={this.purchasingHandler}/>
            </Aux>
        )
    }
}

export default BurgerBuilder;