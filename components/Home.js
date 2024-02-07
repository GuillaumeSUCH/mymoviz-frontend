import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';
import styles from '../styles/Home.module.css';

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  // Movies list
  const [moviesData, setMoviesData] = useState([]);

  useEffect(() => {
    fetch('https://mymoviz-backend-seven-weld.vercel.app')
      .then(response => {
       return response.json();
      })
      .then(data => {
        console.log(data.movies)
        setMoviesData(data.movies);
      })
      .catch(error => {
        console.error('Erreur :', error);
      });
  }, []);

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    const limitedOverview = data.overview.length > 250 ? `${data.overview.substring(0, 250)}...` : data.overview;
    const poster = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;

    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.original_title} overview={limitedOverview} poster={poster} voteAverage={data.vote_average} voteCount={data.vote_count} />;
  });

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logocontainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      <div className={styles.title}>LAST RELEASES</div>
      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;