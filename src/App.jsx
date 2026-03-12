import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourite from "./components/AddFavourite.jsx";
import RemoveFavourite from "./components/RemoveFavourite.jsx";

const OMDB_API_KEY = 'aeb2b829';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';
const MIN_SEARCH_LENGTH = 3;

function App() {

  const [searchValue, setSearchValue] = useState('');
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getMovieRequest = async (searchValue) => {
    if (searchValue.trim().length < MIN_SEARCH_LENGTH) {
      setMovies([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = `${OMDB_BASE_URL}?s=${encodeURIComponent(searchValue)}&apikey=${OMDB_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? 'Neplatný API klíč. Kontaktujte správce.'
            : response.status === 429
              ? 'Příliš mnoho požadavků. Zkuste to později.'
              : `Server odpověděl chybou (HTTP ${response.status}).`
        );
      }

      const data = await response.json();

      if (data.Response === 'False') {
        if (data.Error === 'Film nebyl nalezen') {
          setMovies([]);
          setError(null);
        } else {
          throw new Error(data.Error || 'Neznámá chyba z OMDB API.');
        }
        return;
      }

      setMovies(data.Search || []);

    } catch (err) {
      if (err.name === 'AbortError') return;

      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        setError('Nepodařilo se spojit se serverem. Zkontrolujte připojení k internetu.');
      } else {
        setError(err.message);
      }
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getMovieRequest(searchValue);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

//stringify - konverze Javascript objektu na string
  const saveToLocalStorage = (items) => {
    localStorage.setItem("movie-app-favourites", JSON.stringify(items));
  }

  const AddFavouriteMovie = (movie) => {
    if (favourites.includes(movie)) {
      alert("Tento film už je v Oblíbených");
    } else {
      const newFavouriteList = [...favourites, movie];
      setFavourites(newFavouriteList);
      saveToLocalStorage(newFavouriteList);
    }
  }

  const RemoveFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter(
        (favourite) => favourite.imdbID !== movie.imdbID
    );
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  }



  return (
      <div className="container-fluid movie-app">
        <div className="row">
          <SearchBox searchValue={searchValue}
                     setSearchValue={setSearchValue}/>
        </div>
        <div className="row">
          <MovieListHeading heading="Seznam filmů"></MovieListHeading>
        </div>

        {loading && (
            <div className="row">
              <div className="col-12 status-message">
                <div className="spinner"></div>
                <span>Načítání filmů...</span>
              </div>
            </div>
        )}

        {error && !loading && (
            <div className="row">
              <div className="col-12 status-message error-message">
                <span>⚠ {error}</span>
              </div>
            </div>
        )}

        {!loading && !error && movies.length === 0 && searchValue.trim().length >= MIN_SEARCH_LENGTH && (
            <div className="row">
              <div className="col-12 status-message info-message">
                <span><b>Žádné filmy nenalezeny pro &quot;{searchValue}&quot;</b></span>
              </div>
            </div>
        )}

        {!loading && !error && movies.length > 0 && (
            <div className="row movie-row">
              <MovieList
                  movies={movies}
                  handleFavouritesClick={AddFavouriteMovie}
                  favouriteComponent={AddFavourite}
              />
            </div>
        )}

        <div className="row">
          <MovieListHeading heading="Oblíbené filmy"></MovieListHeading>
        </div>
        <div className="row movie-row">
          <MovieList
              movies={favourites}
              handleFavouritesClick={RemoveFavouriteMovie}
              favouriteComponent={RemoveFavourite}
          />
        </div>
      </div>


  )
      ;
}

export default App;
