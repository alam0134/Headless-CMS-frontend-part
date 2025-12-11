import { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'
import ReviewDetailPage from './ReviewDetailPage'
import './HomePage.css'

export default function HomePage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovieId, setSelectedMovieId] = useState(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          'https://headless-cms-source-files-8c59.onrender.com/api/movies?populate=*'
        )
        if (!response.ok) {
          throw new Error('Failed to fetch movies')
        }
        const data = await response.json()
        console.log('Movies data:', data.data)
        setMovies(data.data || [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching movies:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (selectedMovieId) {
    return (
      <ReviewDetailPage
        movieId={selectedMovieId}
        onBack={() => setSelectedMovieId(null)}
      />
    )
  }

  return (
    <div className="home-page">
      <h1>Reviews</h1>
      {loading && <div className="loading">Loading reviews...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && movies.length === 0 && (
        <div className="no-movies">No reviews found</div>
      )}
      {!loading && !error && movies.length > 0 && (
        <div className="movies-grid">
          {movies.map((movie) => (
            <ReviewCard
              key={movie.id}
              movie={movie}
              onReadMore={setSelectedMovieId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
