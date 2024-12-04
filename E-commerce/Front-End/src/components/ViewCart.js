import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Spinner, Alert, Container } from 'react-bootstrap';

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]); // State for storing cart items
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  // Fetch cart items from the API
  const fetchCartItems = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
      setError('You must be logged in to view the cart.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use the token for authentication
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch cart items: ${errorText}`);
      }

      const data = await response.json();
      setCartItems(data.cartItems || []); // Set cart items or empty array if undefined
    } catch (err) {
      setError(err.message); // Set error message on failure
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };

  // Fetch cart items when the component mounts
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Handle checkout logic
  const handleCheckout = () => {
    alert('Proceeding to checkout...'); // Placeholder for checkout functionality
    // You can redirect to a checkout page or trigger other logic here
  };

  return (
    <Container className="mt-5">
      <h2>My Cart</h2>

      {/* Loading State */}
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      )}

      {/* Cart Items */}
      {!loading && !error && (
        <>
          {cartItems.length === 0 ? (
            <Alert variant="info">Your cart is empty.</Alert>
          ) : (
            <ListGroup className="mb-3">
              {cartItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{item.product.name}</strong>
                      <br />
                      Quantity: {item.quantity}
                      <br />
                      Price: ${item.product.price}
                    </div>
                    <div className="text-end">
                      Total: ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          {/* Checkout Button */}
          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout
          </Button>
        </>
      )}
    </Container>
  );
};

export default ViewCart;
 
