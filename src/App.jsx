import React from 'react';
import ProductList from './components/ProductList';

// Main App container housing the catalog and header
function App() {
  return (
    <>
      <header className="app-header">
        <div className="app-title-group">
          <h1 className="app-logo" style={{ fontSize: '2.2rem' }}>BharatMart 🛍️</h1>
          <span className="app-badge" style={{ fontSize: '0.7rem' }}>Made in India</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          Custom Fetch Hook (useFetch)
        </p>
      </header>

      <main>
        <ProductList />
      </main>

      <footer style={{
        marginTop: '5rem',
        padding: '2rem 0',
        borderTop: '1px solid var(--border-color)',
        textAlign: 'center',
        color: 'var(--text-dark)',
        fontSize: '0.85rem'
      }}>
        <p>Made with ❤️ in India • Built using custom hook <code>useFetch</code></p>
      </footer>
    </>
  );
}

export default App;
