import noPhotoImage from'../assets/no-image.jpg';
const MovieList = (props) => {
    const FavouriteComponent = props.favouriteComponent;
    return(
        <>
            {props.movies.map( (movie) => (
                <div className="image-container">
                    <div className="poster-frame">
                        <img src={movie.Poster === "N/A" ? noPhotoImage : movie.Poster} alt="movie"/>
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
        </>
    )
}
export default MovieList;