import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchView from './components/search-view';

const App = () => {
  return (
    <div className="App">
        <header>
            <h1>LegalEase Wikipedia Search App</h1>
        </header>
        <SearchView />
    </div>
  );
}

export default App;
