export default function QuoteBlock({ data }) {
  const imageUrl = data.image_url || null;

  return (
    <div className="ig-block ig-quote">
      <div className="ig-ornament">⚔ ═══ ◆ ═══ ⚔</div>
      <div className="ig-quote__mark">"</div>
      <p className="ig-quote__text">{data.quote_text}</p>
      {data.author && <span className="ig-quote__author">— {data.author}</span>}
      {data.context && <p className="ig-quote__context">{data.context}</p>}

      {imageUrl && (
        <div className="ig-block__image-frame ig-block__image-frame--circle">
          <img src={imageUrl} alt={data.author} onError={e => { e.target.parentElement.style.display = "none"; }} />
        </div>
      )}
    </div>
  );
}
