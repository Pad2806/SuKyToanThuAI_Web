import React from 'react';

const allySides = new Set([
  'ally',
  'dai-viet',
  'nhan-dan',
  'quân ta',
  'quan ta',
  'quan-khoi-nghia',
  'tay-son',
  'viet-minh',
  'vndcch',
]);

export function isAllySide(side) {
  if (!side) return true;
  return allySides.has(String(side).toLowerCase());
}

export function normalizeSide(side) {
  return isAllySide(side) ? 'Quân ta' : 'Đối phương';
}

const shortText = (value, fallback = '') => {
  const text = Array.isArray(value) ? value.join(', ') : value || fallback || '';
  return text.length > 180 ? `${text.slice(0, 177).trim()}...` : text;
};

const pairCharacters = (characters) => {
  const rows = [];
  for (let index = 0; index < characters.length; index += 2) {
    rows.push(characters.slice(index, index + 2));
  }
  return rows;
};

export const CharacterCard = ({ character, fallbackImage, single = false }) => {
  const isAlly = isAllySide(character.side);
  const sideName = normalizeSide(character.side);
  const image = character.portrait || character.image || fallbackImage || '/images/generated/parchment.png';
  const contribution = shortText(character.contribution || character.description, character.bio);
  const standout = character.standout || character.traits || character.trait || character.keyDetail || character.quote;

  return (
    <article
      className={[
        'char-profile',
        'char-profile--cinematic',
        'char-profile--screen',
        single && 'char-profile--single',
        isAlly ? 'char-profile--ally' : 'char-profile--enemy',
      ].filter(Boolean).join(' ')}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="char-profile__shade" aria-hidden="true" />
      <div className="char-profile__details">
        <span className="char-profile__side">{sideName}</span>
        <h3 className="char-profile__name">{character.name}</h3>
        <span className="char-profile__role">{character.role}</span>
        {standout && <p className="char-profile__standout">{shortText(standout, '')}</p>}
        {contribution && <p className="char-profile__bio">{contribution}</p>}
      </div>
    </article>
  );
};

export const CharacterGrid = ({
  characters,
  fallbackImage,
  showTitle = true,
}) => {
  const rows = pairCharacters(characters);

  return (
    <div className="char-section char-section--rows">
      {showTitle && <h3 className="char-section__title">Nhân vật chính</h3>}
      <div className="char-section__rows">
        {rows.map((row, rowIndex) => (
          <div
            className={`char-row ${row.length === 1 ? 'char-row--single' : ''}`}
            key={`character-row-${rowIndex}`}
          >
            {row.map((character) => (
              <CharacterCard
                key={character.id || character.name}
                character={character}
                fallbackImage={fallbackImage}
                single={row.length === 1}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterCard;
