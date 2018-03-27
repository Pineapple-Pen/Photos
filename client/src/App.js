import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import '../dist/styles.css';

//if window exists append it otherwise export
if (window){
  window.App = App;
  ReactDOM.render(<App />, document.getElementById('gallery-app'));

} 

export default App;
