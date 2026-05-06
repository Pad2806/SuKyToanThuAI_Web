export default function IntroBlock({ data }) {
  const imageUrl = data.image_url || null;

  return (
    <div className="ig-block ig-intro">
      <div className="ig-ornament">☬ ═══════════════ ☬</div>


      <p className="ig-intro__text">{data.content}</p>
    </div>
  );
}
