export default class MovieAppService {
  _apiKey = 'd0ca4d53cbe1e576e66a1311b84e919b';
  _apiGuest = `https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this._apiKey}`;
  _apiGenres = `
	https://api.themoviedb.org/3/genre/movie/list?api_key=${this._apiKey}`;

  getMovies = async (query, page) => {
    const _apiSearch = `https://api.themoviedb.org/3/search/movie?page=${page}&api_key=${this._apiKey}&query=${query}`;
    const result = await fetch(_apiSearch);
    const movies = await result.json();
    const { results, total_results } = movies;

    return [results, total_results];
  };

  getGenres = async () => {
    const result = await fetch(this._apiGenres);
    const genresRes = await result.json();

    const { genres } = genresRes;

    return genres;
  };

  createGuestSession = async () => {
    const result = await fetch(this._apiGuest);
    const response = await result.json();
    const { guest_session_id } = response;

    return guest_session_id;
  };

  rateMovie = async (guestSessionId, moveId, rate) => {
    const apiRateMovie = `https://api.themoviedb.org/3/movie/${moveId}/rating?api_key=${this._apiKey}&guest_session_id=${guestSessionId}`;
    const headers = { 'Content-type': 'application/json;charset=utf-8' };

    return await fetch(apiRateMovie, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        value: rate,
      }),
    });
  };

  getRatedMovies = async (guestSessionId) => {
    const apiGetRated = `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&sort_by=created_at.asc`;
    const result = await fetch(apiGetRated);
    const getRatedMovies = await result.json();
    const { results } = getRatedMovies;

    return results;
  };
}
