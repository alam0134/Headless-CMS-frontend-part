import { useEffect, useState } from 'react'
import './ReviewDetailPage.css'

export default function ReviewDetailPage({ movieId, onBack }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [filteredComments, setFilteredComments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://headless-cms-source-files-8c59.onrender.com/api/movies?filters[id][$eq]=${movieId}&populate=*`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch review details')
        }
        const data = await response.json()
        console.log('Review details:', data.data)
        
        if (data.data && data.data.length > 0) {
          const movieData = data.data[0]
          setMovie(movieData)
          setComments(movieData.reviews || [])
        } else {
          throw new Error('Review not found')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching review:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [movieId])

  // Filter comments based on search term and rating
  useEffect(() => {
    let filtered = [...comments]

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((comment) =>
        comment.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comment.comment.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Rating filter - sort the filtered array
    if (ratingFilter === 'highest') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (ratingFilter === 'lowest') {
      filtered = filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0))
    }

    setFilteredComments(filtered)
  }, [searchTerm, ratingFilter, comments])

  if (loading) {
    return <div className="detail-loading">Loading review details...</div>
  }

  if (error) {
    return (
      <div className="detail-error">
        <p>Error: {error}</p>
        <button onClick={onBack} className="back-btn">
          Back to Reviews
        </button>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="detail-error">
        <p>Review not found</p>
        <button onClick={onBack} className="back-btn">
          Back to Reviews
        </button>
      </div>
    )
  }

  const { title, description, rating, poster } = movie
  const imageUrl = poster?.url || null

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="review-detail">
      <button onClick={onBack} className="back-btn">
        ← Back to Reviews
      </button>

      <div className="detail-container">
        <div className="detail-image">
          {imageUrl && <img src={imageUrl} alt={title} />}
        </div>

        <div className="detail-content">
          <h1>{title}</h1>
          {rating && <div className="detail-rating">⭐ Rating: {rating}/10</div>}
          <div className="detail-description">
            <h3>Description</h3>
            <p>{description}</p>
          </div>

          <div className="comments-section">
            <div className="comments-header">
              <h3>Reviews & Comments ({filteredComments.length})</h3>
              <div className="comments-controls">
                <div className="comment-search-box">
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="comment-search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="rating-filter-select"
                >
                  <option value="all">All Ratings</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>
            <div className="comments-list">
              {filteredComments.length === 0 ? (
                <div className="no-comments">{searchTerm.trim() ? 'No reviews match your search' : 'No reviews yet'}</div>
              ) : (
                filteredComments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-author">{comment.authorName}</span>
                      <span className="comment-time">{formatDate(comment.date)}</span>
                    </div>
                    <div className="comment-rating">⭐ {comment.rating}/10</div>
                    <p className="comment-text">{comment.comment}</p>
                  </div>
                ))
              )}
            </div>
            <div className="add-comment">
              <textarea
                placeholder="Add your review here..."
                className="comment-input"
              />
              <button className="submit-comment-btn">Post Review</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
