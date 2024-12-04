// src/Cart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/cart')
            .then(response => {
                setCartItems(response.data.cartItems);
                setTotalPrice(response.data.totalPrice);
            })
            .catch(error => {
                setErrorMessage('There was an issue fetching your cart.');
                console.error('Error fetching cart data:', error);
            });
    }, []);

    const removeItem = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/cart/${id}`)
            .then(response => {
                setCartItems(cartItems.filter(item => item.id !== id));
                setTotalPrice(totalPrice - cartItems.find(item => item.id === id).price);
            })
            .catch(error => {
                setErrorMessage('There was an issue removing the item.');
                console.error('Error removing item:', error);
            });
    };

    const updateQuantity = (id, quantity) => {
        if (quantity <= 0 || isNaN(quantity)) {
            alert('Please enter a valid quantity.');
            return;
        }

        axios.put(`http://127.0.0.1:8000/api/cart/${id}`, { quantity })
            .then(response => {
                const updatedCartItems = cartItems.map(item => {
                    if (item.id === id) {
                        item.quantity = quantity;
                    }
                    return item;
                });
                setCartItems(updatedCartItems);
                setTotalPrice(updatedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0));
            })
            .catch(error => {
                setErrorMessage('There was an issue updating the quantity.');
                console.error('Error updating quantity:', error);
            });
    };

    return (
        <div>
            <h2>Your Cart</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {cartItems.length === 0 ? (
                <p>Your cart is empty!</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            <p>{item.product_name} - ${item.price}</p>
                            <p>Quantity: 
                                <input
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                />
                            </p>
                            <p>Total: ${item.price * item.quantity}</p>
                            <button onClick={() => removeItem(item.id)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <h3>Total Price: ₱{totalPrice}</h3>
        </div>
    );
};

export default Cart;
