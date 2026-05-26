import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';

// list of fallback images for categories if API images are broken or repeated placeholders
const categoryPics = {
  Clothes: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?auto=format&fit=crop&w=600&q=80',
  ],
  Electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
  ],
  Furniture: [
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
  ],
  Shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
  ],
  Others: [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80',
  ]
};

// local translation for categories to sound Indian
const indianCats = {
  'Clothes': 'Ethnic & Western Wear',
  'Electronics': 'Mobiles & Gadgets',
  'Furniture': 'Ghar Decor & Furniture',
  'Shoes': 'Footwear',
  'Others': 'Pooja & Kitchen Needs'
};

export default function ProductList() {
  const normalApi = 'https://api.escuelajs.co/api/v1/products';
  const badApi = 'https://api.escuelajs.co/api/v1/invalid-endpoint-for-testing';
  
  const [currentUrl, setCurrentUrl] = useState(normalApi);
  
  // call the custom fetch hook
  const { data: items, loading, error, refetch } = useFetch(currentUrl);

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  // function to fix broken images and avoid repeats
  const getImg = (prod) => {
    const rawCat = prod.category?.name || 'Others';
    
    // figure out category key
    let key = 'Others';
    if (rawCat.toLowerCase().includes('cloth') || rawCat.toLowerCase().includes('wear')) {
      key = 'Clothes';
    } else if (rawCat.toLowerCase().includes('electr') || rawCat.toLowerCase().includes('gadg') || rawCat.toLowerCase().includes('tech')) {
      key = 'Electronics';
    } else if (rawCat.toLowerCase().includes('furn') || rawCat.toLowerCase().includes('decor')) {
      key = 'Furniture';
    } else if (rawCat.toLowerCase().includes('shoe') || rawCat.toLowerCase().includes('foot')) {
      key = 'Shoes';
    }

    const pool = categoryPics[key] || categoryPics['Others'];
    // use modulo to get a unique picture based on id
    const fallback = pool[prod.id % pool.length];

    if (!prod.images || prod.images.length === 0) {
      return fallback;
    }

    let url = prod.images[0];
    if (typeof url === 'string') {
      url = url.replace(/[\[\]"']/g, ''); // strip out bracket symbols
    }

    // check if it's a dummy placeholder or empty/broken
    if (!url || !url.startsWith('http') || 
        url.includes('placeholder') || 
        url.includes('placehold') || 
        url.includes('placeimg') || 
        url.includes('600x400') ||
        url.includes('640/480') ||
        url.includes('640x480') ||
        url.includes('escuelajs.co') ||
        url.length < 15
    ) {
      return fallback;
    }

    return url;
  };

  // function to get affordable price in rupees
  const makeRupee = (price, id) => {
    // simple math formula to range price between 199 and 1999 rupees
    const multiplier = (price + id) % 18;
    return multiplier * 100 + 199;
  };

  // generate list of unique categories
  const categories = ['All'];
  if (items && Array.isArray(items)) {
    items.forEach(item => {
      const name = item.category?.name;
      if (name && !categories.includes(name)) {
        categories.push(name);
      }
    });
  }

  // filter the list based on search box and active pill
  let filteredList = [];
  if (items && Array.isArray(items)) {
    filteredList = items.filter(item => {
      const matchText = item.title?.toLowerCase().includes(search.toLowerCase()) || 
                         item.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'All' || item.category?.name === selectedCat;
      return matchText && matchCat;
    });
  }

  const toggleLink = () => {
    if (currentUrl === normalApi) {
      setCurrentUrl(badApi);
    } else {
      setCurrentUrl(normalApi);
    }
  };

  // loading view
  if (loading) {
    return (
      <div>
        <div className="controls-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" className="search-input" placeholder="Loading products..." disabled />
          </div>
          <button className="action-btn btn-secondary" disabled>Loading...</button>
        </div>
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="skeleton-card">
              <div className="skeleton-image">
                <div className="shimmer-wrapper"></div>
              </div>
              <div className="skeleton-info">
                <div className="skeleton-line title"></div>
                <div className="skeleton-line description-1"></div>
                <div className="skeleton-line description-2"></div>
                <div className="skeleton-line price"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // error view
  if (error) {
    return (
      <div className="error-card">
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Server connection failed</h3>
        <p className="error-message">{error.message || 'Check connection and try again.'}</p>
        <div className="error-actions">
          <button className="action-btn error-retry-btn" onClick={refetch}>
            🔄 Retry Loading
          </button>
          <button className="action-btn btn-secondary" onClick={() => setCurrentUrl(normalApi)}>
            🏠 Restore Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="controls-bar">
        {/* search input */}
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search items (Kurta, Shoes, Mobiles, Decor...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* control buttons */}
        <button className="action-btn btn-secondary" onClick={toggleLink}>
          {currentUrl === normalApi ? '💣 Test Error State' : '✅ Connect Server'}
        </button>

        <button className="action-btn" onClick={refetch}>
          🔄 Refresh
        </button>
      </div>

      {/* category pills */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {categories.slice(0, 10).map(cat => {
          const shownText = indianCats[cat] || cat;
          const isChosen = selectedCat === cat;
          
          return (
            <button
              key={cat}
              className={`action-btn btn-secondary ${isChosen ? 'active-filter' : ''}`}
              style={{
                padding: '6px 14px',
                fontSize: '0.85rem',
                borderRadius: '20px',
                border: isChosen ? '1px solid var(--color-secondary)' : '1px solid var(--border-color)',
                background: isChosen ? 'var(--color-secondary-glow)' : 'var(--bg-card)',
                color: isChosen ? 'var(--color-secondary)' : 'var(--text-main)',
                boxShadow: isChosen ? 'var(--shadow-glow-sec)' : 'none'
              }}
              onClick={() => setSelectedCat(cat)}
            >
              {shownText}
            </button>
          );
        })}
      </div>

      {/* item cards grid */}
      {filteredList.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">📦</div>
          <h3>No products in this section</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            Try searching for something else or changing categories.
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredList.map(item => {
            const priceVal = makeRupee(item.price, item.id);
            const displayPrice = priceVal.toLocaleString('en-IN');
            const catName = indianCats[item.category?.name] || item.category?.name || 'General';
            const imgPath = getImg(item);
            
            return (
              <div key={item.id} className="product-card">
                <div className="product-image-container">
                  <img
                    src={imgPath}
                    alt={item.title}
                    className="product-image"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <span className="product-category-tag">
                    {catName}
                  </span>
                </div>
                
                <div className="product-info">
                  <h3 className="product-title" title={item.title}>
                    {item.title}
                  </h3>
                  <p className="product-description">
                    {item.description}
                  </p>
                  
                  <div className="product-footer">
                    <span className="product-price">₹{displayPrice}</span>
                    <button className="buy-btn">Add to Bag</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
