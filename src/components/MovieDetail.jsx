import React, { useState, useEffect } from 'react';
import noPhotoImage from '../assets/no-image.jpg';

const OMDB_API_KEY = 'e0f18418';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

const MovieDetail = ({ movie, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!movie) return;

    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        const url = `${OMDB_BASE_URL}?i=${movie.imdbID}&plot=full&apikey=${OMDB_API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.Response === 'True') {
          setDetails(data);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movie]);

  if (!movie) {
    return null;
  }

  return (
    <div className='movie-detail-modal' onClick={onClose}>
      <div className='movie-detail-content' onClick={(e) => e.stopPropagation()}>
        <span className='close' onClick={onClose}>
          &times;
        </span>
        <div className='container-fluid'>
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Načítání...</span>
              </div>
            </div>
          ) : (
            <div className='row'>
              <div className='col-md-4'>
                <img 
                  src={movie.Poster !== 'N/A' ? movie.Poster : noPhotoImage}
                  alt='movie' 
                  className='img-fluid rounded'
                />
              </div>
              <div className='col-md-8 detail-text'>
                <h2>{movie.Title}</h2>
                <p className="text-muted">{details?.Genre} | {details?.Runtime} | {movie.Year}</p>
                
                <div className="mb-3">
                  <strong>Režie:</strong> {details?.Director || 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Herci:</strong> {details?.Actors || 'N/A'}
                </div>
                <div className="mb-3">
                  <strong>Popis:</strong>
                  <p>{details?.Plot || 'Načítání popisu...'}</p>
                </div>

                <ul className='list-group list-group-flush'>
                  <li className='list-group-item bg-transparent border-secondary px-0'>
                    <strong>Hodnocení IMDb:</strong> {details?.imdbRating || 'N/A'}
                  </li>
                  <li className='list-group-item bg-transparent border-secondary px-0'>
                    <strong>Typ:</strong> {movie.Type}
                  </li>
                  <li className='list-group-item bg-transparent border-secondary px-0'>
                    <strong>imdbID:</strong> {movie.imdbID}
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
