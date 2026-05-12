import React, { useState } from 'react';

const sideLabels = {
  'dai-viet': 'Đại Việt',
  'nguyen-mong': 'Nguyên – Mông',
};

export const CharacterCard = ({ character, index }) => {
  const [expanded, setExpanded] = useState(false);
  const isDaiViet = character.side === 'dai-viet';

  return (
    <button
      className={`char-card ${expanded ? 'char-card--open' : ''} ${isDaiViet ? 'char-card--ally' : 'char-card--enemy'}`}
      onClick={() => setExpanded((prev) => !prev)}
      type="button"
      aria-expanded={expanded}
    >
      {/* Top accent bar */}
      <div className="char-card__accent" aria-hidden="true" />

      <div className="char-card__header">
        <div className="char-card__avatar">
          {character.portrait ? (
            <img
              className="char-card__portrait"
              src={character.portrait}
              alt={`Chân dung ${character.name}`}
              loading="lazy"
            />
          ) : (
            <span className="char-card__initial" aria-hidden="true">
              {character.name.charAt(0)}
            </span>
          )}
        </div>
        <div className="char-card__info">
          <span className="char-card__side">{sideLabels[character.side] ?? ''}</span>
          <span className="char-card__name">{character.name}</span>
          <span className="char-card__role">{character.role}</span>
        </div>
        <svg className="char-card__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      {expanded && (
        <div className="char-card__body">
          <p className="char-card__bio">{character.bio}</p>
          {character.quote && (
            <blockquote className="char-card__quote">
              <p>{character.quote}</p>
            </blockquote>
          )}
        </div>
      )}
    </button>
  );
};

export const CharacterGrid = ({ characters }) => {
  const allies = characters.filter((c) => c.side === 'dai-viet');
  const enemies = characters.filter((c) => c.side !== 'dai-viet');

  return (
    <div className="char-grid">
      <h3 className="char-grid__title">Nhân vật chính</h3>
      <div className="char-grid__sides">
        {allies.length > 0 && (
          <div className="char-grid__group">
            <span className="char-grid__group-label char-grid__group-label--ally">Đại Việt</span>
            <div className="char-grid__stack">
              {allies.map((c, i) => <CharacterCard key={c.id} character={c} index={i} />)}
            </div>
          </div>
        )}
        {enemies.length > 0 && (
          <div className="char-grid__group">
            <span className="char-grid__group-label char-grid__group-label--enemy">Nguyên – Mông</span>
            <div className="char-grid__stack">
              {enemies.map((c, i) => <CharacterCard key={c.id} character={c} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
