export default function IntroBlock({ data }) {
  return (
    <div className="ig3-block ig3-intro">
      <div className="ig3-divider">✦ ─── ✦</div>
      <p className="ig3-intro__text">{data.content}</p>
      <div className="ig3-divider">✦ ─── ✦</div>
    </div>
  );
}
