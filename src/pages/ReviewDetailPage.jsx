import { useEffect, useState } from 'react'
import './ReviewDetailPage.css'

export default function ReviewDetailPage({ movieId, onBack }) {
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://headless-cms-source-files-8c59.onrender.com/api/movies/${movieId}?populate=*`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch movie details')
        }
        const data = await response.json()
        console.log('Movie details:', data.data)
        setMovie(data.data)
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

  return (
    <div className="movie-detail">
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
            <h3>Comments & Reviews</h3>
            <div className="comments-list">
              <div className="no-comments">No comments yet</div>
            </div>
            <div className="add-comment">
              <textarea
                placeholder="Add your comment here..."
                className="comment-input"
              />
              <button className="submit-comment-btn">Post Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
