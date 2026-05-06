export default function QuoteBlock({ data }) {
  return (
    <div className="ig2-block ig2-quote">
      <div className="ig2-quote__container">
        <div className="ig2-quote__mark">❝</div>
        <p className="ig2-quote__text">{data.quote_text}</p>
        <div className="ig2-quote__mark ig2-quote__mark--end">❞</div>
        {data.author && <span className="ig2-quote__author">— {data.author}</span>}
        {data.context && <p className="ig2-quote__context">{data.context}</p>}
      </div>
    </div>
  );
}
