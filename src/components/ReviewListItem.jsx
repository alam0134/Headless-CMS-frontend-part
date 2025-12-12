import './ReviewListItem.css'

export default function ReviewListItem({ review, movieTitle, movieImage, onViewMovie }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="review-list-item">
      <div className="review-item-image">
        {movieImage && <img src={movieImage} alt={movieTitle} />}
      </div>
      
      <div className="review-item-content">
        <div className="review-movie-info">
          <h3 className="review-movie-title">{movieTitle}</h3>
          <span className="review-rating">⭐ {review.rating}/10</span>
        </div>
        
        <div className="review-author-info">
          <span className="review-author">{review.authorName}</span>
          <span className="review-date">{formatDate(review.date)}</span>
        </div>
        
        <p className="review-comment">{review.comment}</p>
        
        <button 
          className="view-movie-btn"
          onClick={onViewMovie}
        >
          Read Review
        </button>
      </div>
    </div>
  )
}
