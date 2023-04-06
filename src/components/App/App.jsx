import React, { Component } from 'react';
import { debounce } from 'lodash';

import MovieAppService from '../../services/movieAppService';
import MovieList from '../MovieList/MovieList';
import SearchBar from '../SearchBar/SearchBar';

import './App.css';
import { Pagination, Spin } from 'antd';

export default class App extends Component {
  movieService = new MovieAppService();

  state = {
    guesSessionId: '',
    movies: [],
    moviesCount: 0,
    query: 'return',
    page: 1,
    isLoading: false,
  };

  componentDidMount() {
    this.movieService.createGuestSession().then((guesSessionId) => {
      this.setState({
        guesSessionId,
      });
    });

    this.movieUpdate(this.state.query);
  }

  componentDidUpdate(prevProps, prevState) {
    const { query } = this.state;

    if (query !== prevState.query) {
      this.movieUpdate(query, 1);
    }
  }

  movieUpdate = (query, page = 1) => {
    this.movieService.getMovies(query, page).then(([movies, moviesCount]) => {
      this.setState({
        movies,
        moviesCount,
        page,
        isLoading: true,
      });
    });
  };

  onChangeQuery = debounce((e) => {
    this.setState(() => ({ query: e.target.value }));
  }, 1000);

  render() {
    const { movies, query, moviesCount, page, isLoading } = this.state;

    return (
      <div className="container">
        <SearchBar onChangeQuery={this.onChangeQuery} />
        {!isLoading ? <Spin /> : <MovieList movies={movies} guesSessionId={this.state.guesSessionId} />}
        <Pagination
          total={moviesCount}
          current={page}
          defaultPageSize={20}
          style={{ textAlign: 'center' }}
          showSizeChanger={false}
          onChange={(page) => {
            this.movieUpdate(query, page);
          }}
        />
      </div>
    );
  }
}
