import React from 'react';

import './SearchBar.css';

const SearchBar = ({ onChangeQuery }) => {
  return <input className="movie__search" type="text" placeholder="Type to search..." onChange={onChangeQuery} />;
};

export default SearchBar;
