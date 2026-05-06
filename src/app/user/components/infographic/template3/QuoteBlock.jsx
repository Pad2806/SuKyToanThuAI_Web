export default function QuoteBlock({ data }) {
  return (
    <div className="ig3-block ig3-quote">
      <div className="ig3-quote__frame">
        <div className="ig3-quote__mark">❝</div>
        <p className="ig3-quote__text">{data.quote_text}</p>
        {data.author && <span className="ig3-quote__author">— {data.author}</span>}
        {data.context && <p className="ig3-quote__context">{data.context}</p>}
      </div>
    </div>
  );
}
