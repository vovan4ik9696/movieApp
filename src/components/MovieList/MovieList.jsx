import React from 'react';
import MovieItem from '../MovieItem/MovieItem';

import './MovieList.css';

const MovieList = ({ movies, guesSessionId }) => {
  const cards = movies.map((movie) => {
    return <MovieItem key={movie.id} movie={movie} guesSessionId={guesSessionId} />;
  });

  return <ul className="movie__list">{cards}</ul>;
};

export default MovieList;
