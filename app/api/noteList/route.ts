import { NoteListResponseData } from '@/types/response';
import { supabase } from '@/utils/supabase/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data } = await supabase
      .from('note_list')
      .select(
        `
      n_id,
      n_name,
      f_id
    `
      )
      .returns<NoteListResponseData[]>();

    if (!data || !data.length) {
      return NextResponse.json([]);
    }

    return NextResponse.json(
      data.map((note) => {
        return { id: note.n_id, name: note.n_name, fragranceId: note.f_id };
      })
    );
  } catch (error) {
    console.error(error);
    throw new Error('노트 조회 실패');
  }
}
