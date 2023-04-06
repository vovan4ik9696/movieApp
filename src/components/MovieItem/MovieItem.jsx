import React from 'react';
import { Image, Rate, Spin } from 'antd';
import MovieAppService from '../../services/movieAppService';

import './MovieItem.css';

const movieService = new MovieAppService();
const MovieItem = ({ movie: { id, title, poster_path, vote_average, release_date, overview }, guesSessionId }) => {
  const truncateText = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    }
    var truncated = description.substr(0, maxLength);
    // если обрезанный текст заканчивается на пробел, то удаляем его
    if (truncated.charAt(truncated.length - 1) === ' ') {
      truncated = truncated.substr(0, truncated.length - 1);
    }
    // проверяем, не обрезали ли мы в середине слова
    var lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace !== -1) {
      truncated = truncated.substr(0, lastSpace) + '...';
    }
    return truncated;
  };

  const poster = () => {
    if (poster_path === null) {
      return <p className="movie__img-none">Image not found :(</p>;
    }
    return (
      <Image
        src={`https://image.tmdb.org/t/p/original/${poster_path}`}
        alt="movie poster"
        placeholder={
          <div className="spinner__warapper">
            <Spin size="large" />
          </div>
        }
        preview={false}
        style={{ height: '100%' }}
      />
    );
  };

  return (
    <li className="movie__item">
      <div className="movie__poster">{poster()}</div>
      <div className="movie__content">
        <div className="movie__content-box">
          <div className="movie__content-header">
            <h2 className="movie__title">{title}</h2>
            <div className="movie__average-rating">{vote_average.toFixed(1)}</div>
          </div>
          <div className="movie__date">{release_date}</div>
          <ul className="movie__category-list">
            <li className="movie__category-item">Action</li>
            <li className="movie__category-item">Action</li>
          </ul>
          <div className="movie__description">{truncateText(overview, 100)}</div>
        </div>
        <Rate
          count={10}
          allowHalf
          onChange={(rate) => {
            movieService.rateMovie(guesSessionId, id, rate);
          }}
        />
      </div>
    </li>
  );
};

export default MovieItem;
