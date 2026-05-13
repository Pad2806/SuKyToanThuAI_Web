/**
 * Canonical schema for the Storytelling Event Page System.
 * All interactive event pages render from this shape.
 *
 * @typedef {'dai-viet' | 'nguyen-mong' | 'phap' | 'my' | 'viet-minh' | 'other'} CharacterSide
 *
 * @typedef {Object} Character
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {CharacterSide} side
 * @property {string|null} portrait - URL or null (initial fallback)
 * @property {string} bio
 * @property {string|null} quote
 *
 * @typedef {Object} TimelineMilestone
 * @property {string} id
 * @property {string} year
 * @property {string} month
 * @property {string} title
 * @property {string} description
 * @property {string} [icon] - Optional emoji/icon
 * @property {string} [mood] - Mood key for color mapping
 *
 * @typedef {Object} ClimaxPhase
 * @property {string} id
 * @property {string} label
 * @property {string} summary
 * @property {string} description - Supports \\n\\n for paragraph breaks
 * @property {string} [keyDetail]
 * @property {string} [image] - Phase-specific image override
 *
 * @typedef {Object} Hotspot
 * @property {string} id
 * @property {number} x - Percentage 0-100
 * @property {number} y - Percentage 0-100
 * @property {string} label
 * @property {string} description
 *
 * @typedef {Object} ClimaxSceneData
 * @property {string} title
 * @property {string} backgroundImage
 * @property {string[]} [phaseImages] - One image per phase
 * @property {ClimaxPhase[]} phases
 * @property {Hotspot[]} hotspots
 *
 * @typedef {Object} AftermathStat
 * @property {string} label
 * @property {string} value
 * @property {string} [sublabel]
 *
 * @typedef {Object} AftermathData
 * @property {string} title
 * @property {AftermathStat[]} stats
 * @property {{ title: string, items: string[] }} before
 * @property {{ title: string, items: string[] }} after
 *
 * @typedef {Object} TakeawayData
 * @property {string} happened
 * @property {string} whyItMatters
 * @property {string} lesson
 *
 * @typedef {Object} QuizQuestion
 * @property {string} id
 * @property {string} question
 * @property {string[]} options
 * @property {number} correct - Index of correct option
 * @property {string} explanation
 *
 * @typedef {Object} ContentBlock
 * @property {'text'|'quote'|'image'|'quick-facts'} type
 * @property {string} [body]
 * @property {string} [quote]
 * @property {string} [source]
 * @property {string} [image]
 * @property {string} [caption]
 * @property {string} [title]
 * @property {{ label: string, value: string }[]} [items]
 *
 * @typedef {Object} StoryBeat
 * @property {'hook'|'setup'|'rising'|'climax'|'falling'|'takeaway'} type
 * @property {string} title
 * @property {ContentBlock[]} blocks
 *
 * @typedef {Object} StoryEventData
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} eraId
 * @property {string} eraSlug
 * @property {number} year
 * @property {string[]} gradeTags
 * @property {string[]} topics
 * @property {string} type
 * @property {boolean} featured
 * @property {string} summary
 * @property {string} excerpt
 * @property {string} image
 * @property {string} [fallbackImage]
 * @property {string} [location]
 * @property {string[]} [actors]
 * @property {string} [opponent]
 * @property {string} [result]
 * @property {Character[]} characters
 * @property {TimelineMilestone[]} timeline
 * @property {ClimaxSceneData} [climaxScene]
 * @property {AftermathData} [aftermath]
 * @property {TakeawayData} [takeaway]
 * @property {QuizQuestion[]} quiz
 * @property {{ templateType: string, beats: StoryBeat[] }} story
 * @property {string} [theme] - Theme ID override
 * @property {string[]} [relatedEventSlugs]
 */

export {};
