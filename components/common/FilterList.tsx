'use client';
import useCustomSearchParams from '@/hooks/useCustomSearchParams';
import { queryParamsAtom, SearchParamsKey } from '@/recoil/atom';
import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import FilterItem from './FilterItem';

export interface FilterListElement {
  id: number;
  name: string;
}

interface FilterListProps {
  list: FilterListElement[];
  type: string;
}

function FilterList({ list, type }: FilterListProps) {
  const { searchParams, setSearchParams } = useCustomSearchParams<SearchParamsKey>();
  const [queryParams, setQueryParams] = useRecoilState<SearchParamsKey>(queryParamsAtom);

  const handleFilterSelected = (type: string, id: number) => {
    setQueryParams((prev) => {
      const currentFilterList = prev[type] || [];
      const newFilterList = currentFilterList.includes(id)
        ? currentFilterList.filter((itemId) => itemId !== id)
        : [...currentFilterList, id];
      return { ...prev, [type]: newFilterList };
    });
  };

  useEffect(() => {
    setQueryParams({
      note: [
        ...(searchParams
          ?.get('note')
          ?.split('|')
          .map((string) => +string) || []),
      ],
      brand: [
        ...(searchParams
          ?.get('brand')
          ?.split('|')
          .map((string) => +string) || []),
      ],
    });
  }, [searchParams]);

  useEffect(() => {
    setSearchParams(queryParams);
  }, [queryParams]);

  return (
    <ul className="flex flex-col gap-2 py-1 text-sm">
      {list.length ? (
        list.map((item) => (
          <FilterItem
            key={item.id}
            item={item.name}
            checked={queryParams[type]?.some((id) => id === item.id)}
            onClick={() => handleFilterSelected(type, item.id)}
          />
        ))
      ) : (
        <div className="py-2">{type === 'note' ? '해당 카테고리는 항목이 없습니다.' : '검색 결과가 없습니다.'}</div>
      )}
    </ul>
  );
}

export default FilterList;
