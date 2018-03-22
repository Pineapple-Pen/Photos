import React from 'react';

function TopNav() {
  return (
    <div id="top-nav" style={{ height: 60, background: 'white' }}>
      <div id="logo">
        <img src="http://res.cloudinary.com/dc8rhove1/image/upload/c_fit,h_2000,w_2000,x_0,y_0/v1521761386/pen_pineapple_apple_pen.png" alt="" className="logo" />
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
