import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink } from 'react-router-dom';
import SignIn from './container/SignIn/indexSignIn';
import SignUp from './container/SignUp/indexSignUp';
import Homepage from './container/Home/indexHome';
import EditProfile from './container/EditProfile/indexEditProfile';
import AddProduct from './container/Products/addProduct';
import DisplayProductDetails from './container/Products/displayProductDetails';
import ShoppingCart from './container/Cart/shoppingCart';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userObj, setUserObj] = useState({ _id: '', userName: '', email: '', password: '', contactNumber: '', address: '', role: '' });
  const [productList, setProdList] = useState([]);
  const [productsInCart, setProductsInCart] = useState([]);

  useEffect(() => {
    // Check if JWT token exists in local storage upon component mount
    const sessiontoken = localStorage.getItem('sessionToken');
    if (sessiontoken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (sessiontoken) => {
    // Store the JWT token in local storage upon successful login
    localStorage.setItem('sessionToken', sessiontoken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear the JWT token from local storage upon logout
    localStorage.removeItem('sessionToken');
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <Router>
        {isAuthenticated && (
          <div className="tab">
            <NavLink to="/home" activeClassName="activeTab" className="tablinks">Home</NavLink>
            <NavLink to="/editProfile" activeClassName="activeTab" className="tablinks">Edit Profile</NavLink>
            <NavLink to="/viewCart" activeClassName="activeTab" className="tablinks">Cart</NavLink>
            <NavLink to="/addProduct" activeClassName="activeTab" className="tablinks">Add Product</NavLink>
            <button onClick={handleLogout} className="logoutButton">Logout</button>
          </div>
        )}

        <Routes>
          {/* Only show Homepage if authenticated */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <SignIn onLogin={handleLogin} setUserObj={setUserObj} />} />

          <Route path="/signin" element={isAuthenticated ? <Navigate to="/home" /> : <SignIn onLogin={handleLogin} setUserObj={setUserObj} />} />

          <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUp />} />

          <Route path="/home" element={isAuthenticated ? <Homepage  userObj={userObj} productList={productList} setProdList={setProdList} /> : <Navigate to="/" />} />

          <Route path="/editProfile" element={isAuthenticated ? <EditProfile userObj={userObj} setUserObj={setUserObj} /> : <Navigate to="/" />} />

          <Route path="/addProduct" element={isAuthenticated ? <AddProduct /> : <Navigate to="/" />} />

          <Route path="/displayProducts/:productIdUrl" element={isAuthenticated ? <DisplayProductDetails productList={productList} productsInCart={productsInCart} setProductsInCart={setProductsInCart} /> : <Navigate to="/" />} />

          <Route path="/viewCart" element={isAuthenticated ? <ShoppingCart productsInCart={productsInCart} /> : <Navigate to="/" />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
