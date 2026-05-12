import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { defaultListingState, parseListingState, stringifyListingState } from '../../lib/listing-state.js';
import { getAllEras } from '../../lib/event-queries.js';

const sortOptions = [
  ['year-asc', 'Theo năm (Cũ nhất trước)'],
  ['year-desc', 'Theo năm (Mới nhất trước)'],
  ['featured-first', 'Tin nổi bật trước'],
];

export const FilterSortBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const state = parseListingState(searchParams);
  const eras = useMemo(() => getAllEras(), []);
  
  const update = (key, value) => setSearchParams(stringifyListingState({ ...state, [key]: value }));

  return (
    <form aria-label="Bộ lọc danh sách sự kiện" className="filter-sort-bar" onSubmit={(event) => event.preventDefault()}>
      <div className="filter-group">
        <label>Sắp xếp</label>
        <div className="select-wrapper">
          <select value={state.sort} onChange={(event) => update('sort', event.target.value)}>
            {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </div>
      </div>
      
      <div className="filter-group">
        <label>Thời kỳ</label>
        <div className="select-wrapper">
          <select value={state.era} onChange={(event) => update('era', event.target.value)}>
            <option value="">Tất cả thời kỳ</option>
            {eras.map((era) => <option key={era.slug} value={era.slug}>{era.name}</option>)}
          </select>
        </div>
      </div>
      
      <div className="filter-group">
        <label>Bài học</label>
        <div className="select-wrapper">
          <select value={state.lesson} onChange={(event) => update('lesson', event.target.value)}>
            <option value="">Tất cả bài học</option>
            <option value="bai-1">Bài 1: Cội nguồn dân tộc</option>
            <option value="bai-2">Bài 2: Các triều đại phong kiến</option>
            <option value="bai-3">Bài 3: Kháng chiến ngoại xâm</option>
            <option value="bai-4">Bài 4: Lịch sử hiện đại</option>
          </select>
        </div>
      </div>
      
      <div className="filter-actions">
        <button type="button" className="btn-filter-clear" onClick={() => setSearchParams(stringifyListingState(defaultListingState))}>
          Xóa bộ lọc
        </button>
      </div>
    </form>
  );
};

export default FilterSortBar;
