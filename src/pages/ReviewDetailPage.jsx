import { useEffect, useState } from 'react'
import './ReviewDetailPage.css'

export default function ReviewDetailPage({ movieId, review, onBack }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://headless-cms-source-files-8c59.onrender.com/api/movies?filters[id][$eq]=${movieId}&populate=*`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch movie details')
        }
        const data = await response.json()
        console.log('Movie details:', data.data)
        
        if (data.data && data.data.length > 0) {
          const movieData = data.data[0]
          setMovie(movieData)
        } else {
          throw new Error('Movie not found')
        }
      } catch (err) {
        setError(err.message)
        console.error('Error fetching movie:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [movieId])

  if (loading) {
    return <div className="detail-loading">Loading details...</div>
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

  if (!movie || !review) {
    return (
      <div className="detail-error">
        <p>Details not found</p>
        <button onClick={onBack} className="back-btn">
          Back to Reviews
        </button>
      </div>
    )
  }

  const { title, poster } = movie
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
          
          <div className="review-details-section">
            <div className="review-header">
              <div className="review-author-info">
                <h2 className="review-author-name">{review.authorName}</h2>
                <div className="review-date-time">{formatDate(review.date)}</div>
              </div>
              <div className="review-rating-badge">⭐ {review.rating}/10</div>
            </div>

            <div className="review-comment-content">
              <h3>Review</h3>
              <p>{review.comment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
