import React from 'react';

function TopNav() {
  return (
    <div id="top-nav" style={{ height: 60, background: 'white' }}>
      <div id="logo">
        <img src="http://res.cloudinary.com/madlicorice/image/upload/v1520454562/small_logo.png" alt="" className="logo" />
      </div>
      <div className="search-container">
        <form>
          <input type="text" placeholder="Find a great place near you" name="search" />
          <button type="submit"><i className="fa fa-search" /></button>
        </form>
      </div>
      <div id="nav-buttons">
        <button className="nav-button">NEW & HOT</button>
        <button className="nav-button">CITY'S BEST</button>
        <button className="nav-button">SAN FRANCISCO</button>
      </div>
    </div>
  );
}

export default TopNav;
