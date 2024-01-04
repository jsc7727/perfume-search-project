'use client';
import SideFilterMenu from '@/components/home/SideFilterMenu';
import FilterButton from '@/components/home/FilterButton';
import PerfumeCard from '@/components/home/PerfumeCard';
import { Brand, FragranceNoteList, Perfume } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useModal from '@/hooks/useModal';
import FilterMenuModal from '@/components/home/FilterMenuModal';
import { useSearchParams } from 'next/navigation';
import Loading from '@/components/common/Loading';

export const revalidate = 900;

function Home() {
  const searchParams = useSearchParams();
  const [perfumeList, setPerfumeList] = useState<Perfume[]>();
  const [noteList, setNoteList] = useState<FragranceNoteList[]>([]);
  const [brandList, setBrandList] = useState<Brand[]>([]);
  const filterModal = useModal('filterModal');

  const fetchPerfumeList = async () => {
    const note = searchParams.get('note');
    const brand = searchParams.get('brand');

    const perfumeListResponse =
      note || brand
        ? await fetch(
            `/api/filteredPerfumeList?notes=${note ? note.split('|') : []}&brands=${brand ? brand.split('|') : []}`
          ).then((res) => res.json())
        : await fetch('/api/perfumeList').then((res) => res.json());

    setPerfumeList(perfumeListResponse);
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const [fragranceNoteResponse, brandResponse] = await Promise.all([
          fetch('/api/fragranceNoteList'),
          fetch('/api/brandList'),
        ]);
        const fragranceNotes = await fragranceNoteResponse.json();
        const brands = await brandResponse.json();

        setNoteList(fragranceNotes);
        setBrandList(brands);
      } catch (error) {
        console.error('노트, 브랜드 목록 조회 실패', error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    fetchPerfumeList();
  }, [searchParams.get('note'), searchParams.get('brand')]);

  if (!perfumeList || !noteList.length || !brandList.length) return <Loading />;
  return (
    <div className="flex gap-11 my-44 w-full max-w-screen-xl max-xs:my-32">
      <SideFilterMenu noteList={noteList} brandList={brandList} />
      {filterModal.isModalOpened && (
        <FilterMenuModal
          noteList={noteList}
          brandList={brandList}
          handleIsModalOpened={filterModal.handleIsModalOpened}
        />
      )}
      <main className="w-full">
        <div className="flex flex-col items-center gap-4 mb-4 relative">
          <h2 className="text-2xl text-stone-800 font-bold max-xs:text-xl">향수</h2>
          <FilterButton handleIsModalOpened={filterModal.handleIsModalOpened} />
          <div className="text-stone-700 max-xs:text-sm">
            {perfumeList.length ? `${perfumeList.length}개의 향수가 검색되었습니다.` : '검색 결과가 없습니다.'}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5 max-xl:px-5 max-lg:grid-cols-3 max-md:grid-cols-2 max">
          {perfumeList.map((perfume) => (
            <Link key={perfume.id} href={`/perfume/${perfume.id}`}>
              <PerfumeCard brand={perfume.brand} name={perfume.name} imgUrl={perfume.imgUrl} id={perfume.id} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Home;
