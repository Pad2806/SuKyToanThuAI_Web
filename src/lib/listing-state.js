export const defaultListingState = {
  grade: '',
  sort: 'year-asc',
  topic: '',
  type: '',
};

export const parseListingState = (searchParams) => ({
  grade: searchParams.get('grade') ?? '',
  sort: searchParams.get('sort') ?? defaultListingState.sort,
  topic: searchParams.get('topic') ?? '',
  type: searchParams.get('type') ?? '',
});

export const stringifyListingState = (state) => {
  const params = new URLSearchParams();

  Object.entries({ ...defaultListingState, ...state }).forEach(([key, value]) => {
    if (value && value !== defaultListingState[key]) {
      params.set(key, value);
    }
  });

  return params;
};

export const filterEvents = (events, state) =>
  events.filter((event) => {
    const matchesGrade = !state.grade || event.gradeTags.includes(state.grade);
    const matchesTopic = !state.topic || event.topics?.includes(state.topic);
    const matchesType = !state.type || event.type === state.type;

    return matchesGrade && matchesTopic && matchesType;
  });

export const sortEvents = (events, sort) => {
  const sorted = [...events];

  if (sort === 'year-desc') return sorted.sort((left, right) => right.year - left.year);
  if (sort === 'grade') return sorted.sort((left, right) => left.gradeTags[0].localeCompare(right.gradeTags[0]));
  if (sort === 'featured-first') return sorted.sort((left, right) => Number(right.featured) - Number(left.featured));

  return sorted.sort((left, right) => left.year - right.year);
};

export const applyListingState = (events, state) => sortEvents(filterEvents(events, state), state.sort);
