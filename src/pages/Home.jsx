import MovieCard from "../components/MovieCard"
import '../css/Home.css'

import { useState } from "react";
import { searchPopularMovies, getPopularMovies } from "../services/api";
import { useEffect } from "react";

function Home(){

    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(function(){
       const loadPopularMovies = async () => {
        try{
            const popularMovies = await getPopularMovies();
            setMovies(popularMovies);
        } catch(err){
            console.log(err);
            
            setError("Failed to load movies...")
        }
        finally {
            setLoading(false);
        }
       }

       loadPopularMovies();
    },[])

   async function handleSearch(e) {
    e.preventDefault();

    if (!searchQuery.trim()) {
        const popularMovies = await getPopularMovies();
        setMovies(popularMovies);
        return;
    }

    if (loading) return;

    setLoading(true);

    try {
        const searchResults = await searchPopularMovies(searchQuery);
        setMovies(searchResults);
        setError(null);
    } catch (err) {
        console.log(err);
        setError("Failed to load movies...");
    } finally {
        setLoading(false);
    }
}
    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input type="text" placeholder="Search for movies..." value={searchQuery}  onChange={(e)=>{
                    setSearchQuery(e.target.value);
                }}className="search-input" />
                <button type="submit" 
                className="search-button">Search</button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? <div className="loading">Loading... </div> :(
                <div className="movies-grid">
            {movies.map(function(movie){
    return <MovieCard movie={movie} key={movie.id} />
})}
          </div>
            )}
          
        </div>
    )
}

export default Home;