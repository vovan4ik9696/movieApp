import React, { Component } from 'react';
import { debounce } from 'lodash';
import { Alert, Pagination, Tabs } from 'antd';
import { Online, Offline } from 'react-detect-offline';

import MovieAppService from '../../services/movieAppService';
import MovieList from '../MovieList/MovieList';
import SearchBar from '../SearchBar/SearchBar';
import { GenresProvider } from '../context/genres-context';

import './App.css';

export default class App extends Component {
  movieService = new MovieAppService();

  state = {
    guesSessionId: '',
    movies: [],
    ratedMovies: [],
    moviesCount: 0,
    genres: [],
    query: '',
    error: false,
    page: 1,
    isLoading: false,
    isNothing: false,
  };

  componentDidMount() {
    this.movieService.createGuestSession().then((guesSessionId) => {
      this.setState({ guesSessionId });
    });
    this.movieService.getGenres().then((genres) => {
      this.setState({ genres });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { query } = this.state;

    if (query !== prevState.query) {
      this.movieUpdate(query, 1);
    }
  }

  movieUpdate = (query, page = 1) => {
    this.movieService.getMovies(query, page).then(([movies, moviesCount]) => {
      if (movies.length === 0) {
        this.setState({
          isNothing: true,
        });
      } else {
        this.setState({ isNothing: false });
      }
      this.setState({
        movies,
        moviesCount,
        page,
        isLoading: false,
      });
    });
  };

  onChangeQuery = debounce((e) => {
    this.setState(() => ({ query: e.target.value, isLoading: true, moviesCount: 0 }));
  }, 1000);

  onRated = (id, rate) => {
    const { guesSessionId } = this.state;
    this.movieService.rateMovie(guesSessionId, id, rate);
  };

  onRatedTabClick = (idTab) => {
    const { guesSessionId } = this.state;
    if (idTab === '2') {
      this.movieService.getRatedMovies(guesSessionId).then((ratedMovies) => {
        this.setState({
          ratedMovies,
        });
      });
    }
  };

  onPaginationClick(page) {
    const { query } = this.state;

    this.setState({ movies: [0], isLoading: true });
    this.movieUpdate(query, page);
  }

  render() {
    const { movies, ratedMovies, moviesCount, page, guesSessionId, isLoading, isNothing, genres } = this.state;

    const searchTab = (
      <React.Fragment>
        <SearchBar onChangeQuery={this.onChangeQuery} />
        <MovieList
          movies={movies}
          guesSessionId={guesSessionId}
          onRated={this.onRated}
          isLoading={isLoading}
          isNothing={isNothing}
        />
        <Pagination
          total={moviesCount}
          current={page}
          defaultPageSize={20}
          style={{ textAlign: 'center' }}
          showSizeChanger={false}
          onChange={(page) => this.onPaginationClick(page)}
        />
      </React.Fragment>
    );

    const ratedTab = (
      <MovieList movies={ratedMovies} guesSessionId={guesSessionId} onRated={this.onRated} isLoading={isLoading} />
    );

    const tabs = [
      {
        key: '1',
        label: 'Search',
        children: searchTab,
      },
      {
        key: '2',
        label: 'Rated',
        children: ratedTab,
      },
    ];

    return (
      <div className="container">
        <Offline>
          <Alert type="error" message="Oops! I think your network is dead :\" />
        </Offline>
        <Online>
          <GenresProvider value={genres}>
            <Tabs items={tabs} centered defaultActiveKey="1" onChange={this.onRatedTabClick} />
          </GenresProvider>
        </Online>
      </div>
    );
  }
}
