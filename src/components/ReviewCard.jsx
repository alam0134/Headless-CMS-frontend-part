import './ReviewCard.css'

export default function ReviewCard({ movie, onReadMore }) {
  const { id, title, rating, poster } = movie
  const imageUrl = poster?.url || null

  return (
    <div className="movie-card">
      <div className="card-image">
        {imageUrl && <img src={imageUrl} alt={title} className="movie-cover" />}
      </div>
      <div className="card-footer">
        {rating && <div className="rating">⭐ {rating}/10</div>}
        <button className="read-more-btn" onClick={() => onReadMore(id)}>
          Check Reviews
        </button>
      </div>
    </div>
  )
}
