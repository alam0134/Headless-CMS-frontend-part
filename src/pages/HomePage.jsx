import { useState, useEffect } from 'react'
import ReviewListItem from '../components/ReviewListItem'
import ReviewDetailPage from './ReviewDetailPage'
import './HomePage.css'

export default function HomePage() {
  const [movies, setMovies] = useState([])
  const [allReviews, setAllReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovieId, setSelectedMovieId] = useState(null)
  const [selectedReview, setSelectedReview] = useState(null)
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
        
        const moviesData = data.data || []
        setMovies(moviesData)
        
        // Mix all reviews together with their movie info
        const reviews = []
        moviesData.forEach((movie) => {
          if (movie.reviews && movie.reviews.length > 0) {
            movie.reviews.forEach((review) => {
              reviews.push({
                ...review,
                movieId: movie.id,
                movieTitle: movie.title,
                movieImage: movie.poster?.url || null,
              })
            })
          }
        })
        
        setAllReviews(reviews)
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
    let filtered = [...allReviews]

    // Search filter - search by movie title or review comment
    if (searchTerm.trim()) {
      filtered = filtered.filter((review) =>
        review.movieTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.authorName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Rating filter - sort the filtered array
    if (filterRating === 'highest') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (filterRating === 'lowest') {
      filtered = filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0))
    }

    setFilteredReviews(filtered)
  }, [searchTerm, filterRating, allReviews])

  if (selectedMovieId && selectedReview) {
    return (
      <ReviewDetailPage
        movieId={selectedMovieId}
        review={selectedReview}
        onBack={() => {
          setSelectedMovieId(null)
          setSelectedReview(null)
        }}
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
            placeholder="Search reviews by title, author, or comment..."
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
      {!loading && !error && filteredReviews.length === 0 && (
        <div className="no-movies">No reviews found</div>
      )}
      {!loading && !error && filteredReviews.length > 0 && (
        <>
          <div className="results-info">
            Showing {filteredReviews.length} {filteredReviews.length === 1 ? 'review' : 'reviews'}
          </div>
          <div className="reviews-list">
            {filteredReviews.map((review) => (
              <ReviewListItem
                key={review.id}
                review={review}
                movieTitle={review.movieTitle}
                movieImage={review.movieImage}
                onViewMovie={() => {
                  setSelectedMovieId(review.movieId)
                  setSelectedReview(review)
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
