import React from 'react';
import ProductList from './components/ProductList';

function App() {
  return (
    <div>
      <header>
        <div>
          <h1>BharatMart 🛍️</h1>
          <p>MERN Stack Assignment 5: Custom Hooks</p>
        </div>
        <p>Made in India</p>
      </header>

      <main>
        <ProductList />
      </main>

      <footer>
        <p>Built using custom React hook useFetch • 2026 BharatMart</p>
      </footer>
    </div>
  );
}

export default App;
