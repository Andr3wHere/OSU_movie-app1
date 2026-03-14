import React, { useState } from 'react';
import MovieDetail from './MovieDetail';
import noPhotoImage from'../assets/no-image.jpg';

const MovieList = (props) => {
    const FavouriteComponent = props.favouriteComponent;
    const [selectedMovie, setSelectedMovie] = useState(null);

    const openMovieDetail = (movie) => {
        setSelectedMovie(movie);
    };

    const closeMovieDetail = () => {
        setSelectedMovie(null);
    };

    return(
        <>
            {props.movies.map( (movie) => (
                <div className="image-container" key={movie.imdbID}>
                    <div className="poster-frame">
                        <img src={movie.Poster === "N/A" ? noPhotoImage : movie.Poster} alt="movie" onClick={() => openMovieDetail(movie)} />
                        <div className="heading d-flex justify-content-center align-items-center">
                            <h4>{movie.Title}</h4>
                        </div>
                        <div
                            onClick={() => props.handleFavouritesClick(movie)}
                            className="overlay d-flex
                            align-items-center
                            justify-content-center">
                            <FavouriteComponent/>
                        </div>
                    </div>
                </div>
            ))}
            {selectedMovie && <MovieDetail movie={selectedMovie} onClose={closeMovieDetail} />}
        </>
    )
}
export default MovieList;