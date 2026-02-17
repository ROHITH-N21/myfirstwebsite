// Utility to load JSON
function fetchProducts(callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "products.json", true);
  xhr.onload = () => {
    if (xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}

// Save/Load cart
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render products
if (document.getElementById("product-list")) {
  fetchProducts(products => {
    const container = document.getElementById("product-list");
    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.desc}</p>
        <p>⭐ ${product.rating}</p>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      container.appendChild(div);
    });
  });
}

// Add to cart
function addToCart(id) {
  fetchProducts(products => {
    const product = products.find(p => p.id === id);
    let cart = getCart();
    
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(`${product.name} added to cart!`);
  });
}


// Render cart
if (document.getElementById("cart-items")) {
  let cart = getCart();
  let total = 0;
  const ul = document.getElementById("cart-items");

  cart.forEach((item, i) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price}
      <button onclick="removeFromCart(${i})">Delete</button>
    `;
    ul.appendChild(li);
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
}

// Remove from cart
function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  location.reload();
}

// Checkout
function placeOrder() {
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;
  const cart = getCart();

  if (!address || cart.length === 0) {
    alert("Fill all details and make sure your cart is not empty.");
    return;
  }

  const order = {
    cart,
    address,
    payment
  };

  // Simulate AJAX POST request
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "products.json", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = () => {
    if (xhr.status === 201) {
      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "indexs.html";
    }
  };
  xhr.send(JSON.stringify(order));
}
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countSpan.textContent = totalItems;
  }
}

// Call on page load
updateCartCount();
function placeOrder() {
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment").value;
  const cart = getCart();

  if (!address || cart.length === 0) {
    alert("❗ Please enter your address and ensure cart is not empty.");
    return;
  }

  const order = {
    cart,
    address,
    payment
  };

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://jsonplaceholder.typicode.com/posts", true); // Fake API for testing
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onload = function () {
    if (xhr.status === 201 || xhr.status === 200) {
      alert("✅ Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "index.html"; // Redirect to homepage
    } else {
      alert("❌ Something went wrong. Please try again.");
    }
  };

  xhr.onerror = function () {
    alert("❌ Network error. Please check your internet.");
  };

  xhr.send(JSON.stringify(order));
}
