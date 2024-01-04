import { PerfumeListResponseData } from '@/types/response';
import { supabase } from '@/utils/supabase/supabase';
import { NextResponse } from 'next/server';

export const revalidate = 1;

export async function GET() {
  try {
    const { data } = await supabase
      .from('perfume_list')
      .select(
        `
      p_id,
      p_name,
      imgurl,
      brand_list (
        b_name
      )
    `
      )
      .returns<PerfumeListResponseData[]>();

    if (!data || !data.length) {
      return NextResponse.json([]);
    }

    return NextResponse.json(
      data.map((perfume) => {
        const {
          p_id: id,
          p_name: name,
          imgurl: imgUrl,
          brand_list: { b_name: brand },
        } = perfume;

        return { id, name, imgUrl, brand };
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error('향수 목록 조회 실패');
  }
}
