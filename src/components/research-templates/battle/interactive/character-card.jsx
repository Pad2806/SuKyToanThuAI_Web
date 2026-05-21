import React from 'react';

/**
 * Battle template — Character list.
 * Simplified: name + role only, no avatar, no expand, deduped by name.
 * Factions are dynamic based on AI generation.
 */

export const CharacterCard = ({ character, isAlly }) => {
  return (
    <div className={`char-card ${isAlly ? 'char-card--ally' : 'char-card--enemy'}`}>
      <div className="char-card__accent" aria-hidden="true" />
      <div className="char-card__header">
        <div className="char-card__avatar">
          <span className="char-card__initial" aria-hidden="true">
            {character.name.charAt(0)}
          </span>
        </div>
        <div className="char-card__info">
          <span className="char-card__name">{character.name}</span>
          <span className="char-card__role">{character.role}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Deduplicates characters by name (keeps first occurrence).
 */
function dedupeCharacters(characters) {
  const seen = new Set();
  return characters.filter((c) => {
    const key = c.name?.toLowerCase?.();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const CharacterGrid = ({ characters }) => {
  const unique = dedupeCharacters(characters);
  const allies = unique.filter((c) => c.side === 'ally');
  const enemies = unique.filter((c) => c.side === 'enemy');

  return (
    <div className="char-grid">
      <h3 className="char-grid__title">Nhân vật chính</h3>
      <div className="char-grid__sides">
        {allies.length > 0 && (
          <div className="char-grid__group">
            <span className="char-grid__group-label char-grid__group-label--ally">Đồng Minh</span>
            <div className="char-grid__stack">
              {allies.map((c) => <CharacterCard key={c.id} character={c} isAlly />)}
            </div>
          </div>
        )}
        {enemies.length > 0 && (
          <div className="char-grid__group">
            <span className="char-grid__group-label char-grid__group-label--enemy">Quân Địch</span>
            <div className="char-grid__stack">
              {enemies.map((c) => <CharacterCard key={c.id} character={c} isAlly={false} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCard;
