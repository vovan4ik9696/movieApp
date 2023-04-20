import React from 'react';
import { Alert, Spin } from 'antd';

import MovieItem from '../MovieItem/MovieItem';

import './MovieList.css';

const MovieList = ({ movies, guesSessionId, onRated, isLoading, isNothing }) => {
  if (movies.length === 0 && !isNothing) {
    return (
      <Alert
        message="Enter the name of the movie you want to find"
        type="info"
        style={{ marginTop: 20, marginBottom: 20, textAlign: 'center' }}
      />
    );
  }

  if (isNothing) {
    return (
      <Alert
        message="Nothing searched, try again!"
        type="info"
        style={{ marginTop: 20, marginBottom: 20, textAlign: 'center' }}
      />
    );
  }

  if (isLoading) {
    return (
      <Spin tip="Loading..." size="large">
        <ul className="movie__list"></ul>;
      </Spin>
    );
  }

  const cards = movies.map((movie) => {
    return <MovieItem key={movie.id} onRated={onRated} movie={movie} guesSessionId={guesSessionId} />;
  });

  return <ul className="movie__list">{cards}</ul>;
};

export default MovieList;
