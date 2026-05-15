/**
 * @typedef {'TH' | 'THCS' | 'THPT'} GradeTag
 * @typedef {'battle' | 'dynasty' | 'movement' | 'culture' | 'diplomacy' | 'other'} EventType
 * @typedef {'universal' | 'battle' | 'dynasty' | 'movement' | 'culture' | 'diplomacy'} TemplateType
 * @typedef {'hook' | 'setup' | 'rising' | 'climax' | 'falling' | 'takeaway'} BeatType
 */

/**
 * @typedef {Object} Era
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} yearRange
 * @property {number} startYear
 * @property {number} endYear
 * @property {string} summary
 * @property {string} coverImage
 * @property {string=} fallbackImage
 * @property {number} order
 * @property {string[]=} featuredEventIds
 */

/**
 * @typedef {Object} StoryBeat
 * @property {BeatType} type
 * @property {string} title
 * @property {ContentBlock[]} blocks
 */

/**
 * @typedef {Object} EventStory
 * @property {TemplateType} templateType
 * @property {StoryBeat[]} beats
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} eraId
 * @property {string} eraSlug
 * @property {number} year
 * @property {number=} startYear
 * @property {number=} endYear
 * @property {GradeTag[]} gradeTags
 * @property {EventType} type
 * @property {boolean} featured
 * @property {string} summary
 * @property {string} excerpt
 * @property {string} image
 * @property {string=} fallbackImage
 * @property {string=} location
 * @property {string[]=} actors
 * @property {EventStory} story
 */

/**
 * @typedef {Object} ContentBlock
 * @property {'text' | 'quote' | 'image' | 'map' | 'timeline' | 'comparison' | 'question' | 'stats' | 'quick-facts' | 'figure' | 'fact-box' | 'glossary' | 'illustration-first' | 'event-meta'} type
 */

export {};
