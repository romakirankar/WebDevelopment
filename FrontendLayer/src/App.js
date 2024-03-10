import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, NavLink } from 'react-router-dom';
import SignIn from './container/SignIn/indexSignIn';
import SignUp from './container/SignUp/indexSignUp';
import Homepage from './container/Home/indexHome';
import EditProfile from './container/EditProfile/indexEditProfile';
import UpsertProduct from './container/Products/upsertProduct';
import DisplayProductDetails from './container/Products/displayProductDetails';
import ShoppingCart from './container/Cart/shoppingCart';
import axios from 'axios';

function App() {

  // User authentication bool
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // User object
  const [userObj, setUserObj] = useState({ _id: '', userName: '', email: '', password: '', contactNumber: '', address: '', role: '' });

  // Products list to be displayed on home screen
  const [productList, setProdList] = useState([]);

  // Product list set in Cart
  const [productsInCart, setProductsInCart] = useState([]);

  // Add/modify product (Admin only)
  const [productToBeModifiedByAdmin, setProductToBeModifiedByAdmin] =
    useState({ productName: '', productPrice: '', productDescription: '', productImageFile: '', productQuantity: '' });


  useEffect(() => {
    let loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser != null) {
      setUserObj(loggedInUser);
    }

    let productList = localStorage.getItem('productList');
    if (productList != null) {
      setProdList(productList);
    }

    let productCart = localStorage.getItem('productsInCart');
    if (productCart != null) {
      setProductsInCart(productCart);
    }

    // Check if JWT token exists in local storage upon component mount
    const sessiontoken = localStorage.getItem('sessionToken');
    if (sessiontoken) {
      setIsAuthenticated(true);

      let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      setUserObj(loggedInUser);

      let productList = JSON.parse(localStorage.getItem('productList'));
      setProdList(productList);

      let productCart = JSON.parse(localStorage.getItem('productsInCart'));
      setProductsInCart(productCart);
    }
  }, []);

  // Convert binary image data to base64-encoded string
  const bufferToBase64 = buffer => {
    const binary = Array.from(new Uint8Array(buffer));
    return btoa(binary.map(byte => String.fromCharCode(byte)).join(''));
};

  const handleLogin = async (sessiontoken, userObj) => {
    // Store the JWT token in local storage upon successful login
    localStorage.setItem('sessionToken', sessiontoken);
    setIsAuthenticated(true);
    localStorage.setItem('loggedInUser', JSON.stringify(userObj));

    //fetch records from the cart if stored in the past
    try {
      const response = await axios.get('http://localhost:9000/api/getProductsFromCart/',
        { params: { userId: userObj._id } }
      );

      const updatedProducts = response.data.map(product => ({
        ...product,
        _id: product.productId, // Change the field name to _id
        productImageFile: product.productImageFile ? `data:image/jpeg;base64,${bufferToBase64(product.productImageFile.data)}` : null
    }));
    
    setProductsInCart(updatedProducts);
    // localStorage.setItem('productsInCart',productsInCart);

    }
    catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {

    //store  cart items in 'carts Db' alongside user mapping
    try {
      if (productsInCart.length > 0) {
        let cartPayload = {
          userId: userObj._id,
          productsInCart: productsInCart
        };

        await axios.post('http://localhost:9000/api/pushProductsToCart/', cartPayload);

      }
    }
    catch (error) {
      console.log(error);
    }
    // Clear the JWT token from local storage upon logout
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('productList');
    localStorage.removeItem('productsInCart');

    // Clear productsInCart state
    setProductsInCart([]);
    setIsAuthenticated(false);
  };

  const handleStateChanges = () => {
    setProductToBeModifiedByAdmin({ productName: '', productPrice: '', productDescription: '', productImageFile: '', productQuantity: '' });
  };

  const handleEditProfile = (userRecord) => {
    localStorage.setItem('loggedInUser', JSON.stringify(userRecord));
  };

  const handleListOfProducts = (productList) => {
    localStorage.setItem('productList', JSON.stringify(productList));
  };

  const handleProductsInCart = (productsInCart) => {
    localStorage.setItem('productsInCart', JSON.stringify(productsInCart));
  };

  return (
    <div className="App">
      <Router>
        {isAuthenticated && (
          <div className="tab">
            <NavLink to="/home" activeclassname="activeTab" className="tablinks" onClick={handleStateChanges}>Home</NavLink>
            <NavLink to="/editProfile" activeclassname="activeTab" className="tablinks" onClick={handleStateChanges}>Edit Profile</NavLink>
            {userObj.role === "admin" ?
              <>
                <NavLink to="/upsertProduct" activeclassname="activeTab" className="tablinks" onClick={handleStateChanges}>Add Product</NavLink>
              </>
              : <NavLink to="/viewCart" activeclassname="activeTab" className="tablinks">Cart</NavLink>}
            <button onClick={handleLogout} className="logoutButton">Logout</button>
          </div>
        )}

        <Routes>
          {/* Only show Homepage if authenticated */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <SignIn
            onLogin={handleLogin}
            setUserObj={setUserObj} />} />

          <Route path="/signin" element={isAuthenticated ? <Navigate to="/home" /> : <SignIn
            onLogin={handleLogin} setUserObj={setUserObj} />} />

          <Route path="/signup" element={isAuthenticated ? <Navigate to="/home" /> : <SignUp />} />

          <Route path="/home" element={isAuthenticated ? <Homepage
            userObj={userObj} productList={productList} setProdList={setProdList}
            onUpdateProductList={handleListOfProducts}
          /> : <Navigate to="/" />} />

          <Route path="/editProfile" element={isAuthenticated ? <EditProfile
            userObj={userObj} setUserObj={setUserObj}
            onEditProfile={handleEditProfile}
          /> : <Navigate to="/" />} />

          <Route path="/upsertProduct" element={isAuthenticated ? <UpsertProduct
            userObj={userObj}
            setProductToBeModifiedByAdmin={setProductToBeModifiedByAdmin}
            productToBeModifiedByAdmin={productToBeModifiedByAdmin}
            productList={productList} setProdList={setProdList} onUpdateProductList={handleListOfProducts}
          /> : <Navigate to="/" />} />

          <Route path="/displayProducts/:productIdUrl" element={isAuthenticated ? <DisplayProductDetails
            productList={productList} setProdList={setProdList} onUpdateProductList={handleListOfProducts}
            productsInCart={productsInCart} setProductsInCart={setProductsInCart} onCart={handleProductsInCart}
            userObj={userObj}
            setProductToBeModifiedByAdmin={setProductToBeModifiedByAdmin}
            productToBeModifiedByAdmin={productToBeModifiedByAdmin}
          /> : <Navigate to="/" />} />

          <Route path="/viewCart" element={isAuthenticated ? <ShoppingCart
            productsInCart={productsInCart}
            setProductsInCart={setProductsInCart}
            onCart={handleProductsInCart}
            onUpdateProductList={handleListOfProducts}
            userObj={userObj}

          /> : <Navigate to="/" />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
