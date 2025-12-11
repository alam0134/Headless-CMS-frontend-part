import { useState, useEffect } from 'react'
import ReviewCard from '../components/ReviewCard'
import ReviewDetailPage from './ReviewDetailPage'
import './HomePage.css'

export default function HomePage() {
  const [movies, setMovies] = useState([])
  const [filteredMovies, setFilteredMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('all')

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
        console.error('Error fetching reviews:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...movies]

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Rating filter - sort the filtered array
    if (filterRating === 'highest') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (filterRating === 'lowest') {
      filtered = filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0))
    }

    setFilteredMovies(filtered)
  }, [searchTerm, filterRating, movies])

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
      
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search reviews by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-options">
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Ratings</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {loading && <div className="loading">Loading reviews...</div>}
      {error && <div className="error">Error: {error}</div>}
      {!loading && !error && filteredMovies.length === 0 && (
        <div className="no-movies">No reviews found</div>
      )}
      {!loading && !error && filteredMovies.length > 0 && (
        <>
          <div className="results-info">
            Showing {filteredMovies.length} {filteredMovies.length === 1 ? 'review' : 'reviews'}
          </div>
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <ReviewCard
                key={movie.id}
                movie={movie}
                onReadMore={setSelectedMovieId}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
