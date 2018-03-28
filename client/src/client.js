import React from 'react';
import ReactDOM from 'react-dom';
import Photos from './components/App';
import '../dist/styles.css';

//if window exists append it otherwise export
window.Photos = Photos;
ReactDOM.render(<Photos />, document.getElementById('gallery-app')); 
