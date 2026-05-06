export default function IntroBlock({ data }) {
  return (
    <div className="ig2-block ig2-intro">
      <div className="ig2-ornament">❦</div>
      <p className="ig2-intro__text">
        <span className="ig2-intro__dropcap">{data.content?.charAt(0)}</span>
        {data.content?.slice(1)}
      </p>
      <div className="ig2-ornament">❦</div>
    </div>
  );
}
