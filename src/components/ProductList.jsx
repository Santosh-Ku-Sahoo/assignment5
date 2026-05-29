import React, { useState } from 'react';
import useFetch from '../hooks/useFetch';

export default function ProductList() {
  const apiLink = 'https://api.escuelajs.co/api/v1/products';
  const errorApiLink = 'https://api.escuelajs.co/api/v1/invalid-endpoint-for-testing';
  
  const [url, setUrl] = useState(apiLink);
  const { data: items, loading, error, refetch } = useFetch(url);
  const [searchTerm, setSearchTerm] = useState('');

  // Simple image validation helper
  const getProductImage = (images) => {
    // Neutral package parcel box fallback image
    const fallbackImage = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return fallbackImage;
    }
    
    let imgUrl = images[0];
    
    // Clean string formats from typical API errors
    if (typeof imgUrl === 'string') {
      imgUrl = imgUrl.replace(/[\[\]"']/g, '');
    }
    
    if (!imgUrl || !imgUrl.startsWith('http') || imgUrl.includes('600x400') || imgUrl.includes('placeholder')) {
      return fallbackImage;
    }
    
    return imgUrl;
  };

  // Simple price conversion to Indian Rupees
  const formatPrice = (usdPrice) => {
    return usdPrice * 80;
  };

  // Remove duplicate products by title, description, or image
  let uniqueItems = [];
  const seenTitles = new Set();
  const seenDescriptions = new Set();
  const seenImages = new Set();

  if (items && Array.isArray(items)) {
    items.forEach(item => {
      const titleKey = item.title?.trim().toLowerCase();
      const descKey = item.description?.trim().toLowerCase();
      
      let imgKey = '';
      if (item.images && item.images.length > 0) {
        imgKey = item.images[0].trim().toLowerCase();
      }

      // Check if we have already seen this title, description, or image
      const isDuplicate = 
        (titleKey && seenTitles.has(titleKey)) ||
        (descKey && seenDescriptions.has(descKey)) ||
        (imgKey && seenImages.has(imgKey));

      if (!isDuplicate) {
        if (titleKey) seenTitles.add(titleKey);
        if (descKey) seenDescriptions.add(descKey);
        if (imgKey) seenImages.add(imgKey);
        uniqueItems.push(item);
      }
    });
  }

  // Filter items based on the search term
  let filteredItems = [];
  if (uniqueItems.length > 0) {
    filteredItems = uniqueItems.filter(item => {
      return item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }

  // Toggle API link for testing error handling
  const toggleApiLink = () => {
    if (url === apiLink) {
      setUrl(errorApiLink);
    } else {
      setUrl(apiLink);
    }
  };

  // Loading view
  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading products from API...</p>
      </div>
    );
  }

  // Error view
  if (error) {
    return (
      <div className="error-box">
        <h3>Oops! Failed to load products.</h3>
        <p>Error Message: {error}</p>
        <button onClick={refetch} className="btn">Retry</button>
        <button onClick={() => setUrl(apiLink)} className="btn btn-alt">Reset API Link</button>
      </div>
    );
  }

  return (
    <div className="catalog-container">
      <div className="controls">
        <input
          type="text"
          placeholder="Search products by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
        <button onClick={toggleApiLink} className="btn btn-alt">
          {url === apiLink ? 'Simulate Error' : 'Restore API'}
        </button>
        <button onClick={refetch} className="btn">
          Refresh List
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <div className="no-products">
          <p>No products found matching your search.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="product-card">
              <div className="img-container">
                <img
                  src={getProductImage(item.images)}
                  alt={item.title}
                  onError={(e) => {
                    // Fallback to neutral package box if load fails
                    e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>
              <div className="product-details">
                <h4 className="title">{item.title}</h4>
                <p className="category">Category: {item.category?.name || 'General'}</p>
                <p className="desc">{item.description}</p>
                <div className="card-footer">
                  <span className="price">₹{formatPrice(item.price)}</span>
                  <button className="add-btn">Add to Bag</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
