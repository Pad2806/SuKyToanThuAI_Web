import React, { useState } from 'react';

const sideLabels = {
  'dai-viet': 'Đại Việt',
  'viet-nam': 'Việt Nam',
  'viet-minh': 'Việt Minh',
  'tay-son': 'Tây Sơn',
  'nha-tran': 'Nhà Trần',
  'nha-le': 'Nhà Lê',
  'nha-nguyen': 'Nhà Nguyễn',
  'nha-ly': 'Nhà Lý',
  'nha-tong': 'Nhà Tống',
  'tong': 'Nhà Tống',
  'minh': 'Nhà Minh',
  'nha-minh': 'Nhà Minh',
  'thanh': 'Nhà Thanh',
  'nha-thanh': 'Nhà Thanh',
  'nguyen-mong': 'Nguyên – Mông',
  'nguyen': 'Nhà Nguyên',
  'phap': 'Thực dân Pháp',
  'my': 'Đế quốc Mỹ',
  'other': 'Khác',
};

const ALLY_SIDES = [
  'dai-viet', 'viet-nam', 'viet-minh', 'tay-son', 
  'nha-tran', 'nha-le', 'nha-nguyen', 'nha-ly',
  'nha-ngo', 'nha-dinh', 'tien-le'
];

const isAllySide = (side, sideType) => {
  if (sideType === 'ally') return true;
  if (sideType === 'enemy') return false;
  if (!side) return false;
  return ALLY_SIDES.includes(side.toLowerCase());
};

const getSideLabel = (side, sideName) => {
  if (sideName) return sideName;
  if (!side) return '';
  const sideLower = side.toLowerCase();
  if (sideLabels[sideLower]) return sideLabels[sideLower];
  
  return side
    .split('-')
    .map(word => {
      if (word === 'nha') return 'Nhà';
      if (word === 'viet') return 'Việt';
      if (word === 'nam') return 'Nam';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
};

export const CharacterCard = ({ character, index }) => {
  const [expanded, setExpanded] = useState(false);
  const sideType = character.sideType || character.side_type;
  const sideName = character.sideName || character.side_name;
  const isAlly = isAllySide(character.side, sideType);

  return (
    <button
      className={`char-card ${expanded ? 'char-card--open' : ''} ${isAlly ? 'char-card--ally' : 'char-card--enemy'}`}
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
          <span className="char-card__side">{getSideLabel(character.side, sideName)}</span>
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
  const allies = characters.filter((c) => isAllySide(c.side, c.sideType || c.side_type));
  const enemies = characters.filter((c) => !isAllySide(c.side, c.sideType || c.side_type));

  const firstAlly = allies[0];
  const allySideName = firstAlly ? getSideLabel(firstAlly.side, firstAlly.sideName || firstAlly.side_name) : 'Đại Việt';
  
  const firstEnemy = enemies[0];
  const enemySideName = firstEnemy ? getSideLabel(firstEnemy.side, firstEnemy.sideName || firstEnemy.side_name) : 'Đối Phương';

  return (
    <div className="char-grid">
      <h3 className="char-grid__title">Nhân vật chính</h3>
      <div className="char-grid__sides">
        {allies.length > 0 && (
          <div className="char-grid__group">
            <span className="char-grid__group-label char-grid__group-label--ally">{allySideName}</span>
            <div className="char-grid__stack">
              {allies.map((c, i) => <CharacterCard key={c.id} character={c} index={i} />)}
            </div>
          </div>
        )}
        {enemies.length > 0 && (
          <div className="char-grid__group">
            <span className="char-grid__group-label char-grid__group-label--enemy">{enemySideName}</span>
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


