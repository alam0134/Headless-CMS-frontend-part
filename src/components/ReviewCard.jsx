import { useState } from 'react'
import './ReviewCard.css'

export default function ReviewCard({ movie, onReadMore }) {
  const { id, title, rating, poster, reviews } = movie
  const imageUrl = poster?.url || null
  const [expandedReviewId, setExpandedReviewId] = useState(null)

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="movie-card">
      <div className="card-image">
        {imageUrl && <img src={imageUrl} alt={title} className="movie-cover" />}
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          {rating && <div className="card-rating">⭐ {rating}/10</div>}
        </div>

        <div className="reviews-section">
          <h4 className="reviews-title">Reviews ({reviews?.length || 0})</h4>
          {reviews && reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div 
                    className="review-summary"
                    onClick={() => setExpandedReviewId(expandedReviewId === review.id ? null : review.id)}
                  >
                    <div className="review-author">{review.authorName}</div>
                    <div className="review-rating">⭐ {review.rating}/10</div>
                  </div>
                  
                  {expandedReviewId === review.id && (
                    <div className="review-details">
                      <div className="review-date">{formatDate(review.date)}</div>
                      <p className="review-text">{review.comment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No reviews yet</p>
          )}
        </div>

        <button className="read-more-btn" onClick={() => onReadMore(id)}>
          View Full Details
        </button>
      </div>
    </div>
  )
}
