import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req) {
  try {
    const { message } = await req.json();
    // Example: Search for answer in database (FAQ, feedback, etc.)
    // This is a placeholder. Replace with your own DB logic.
    const sql = `SELECT answer FROM faqs WHERE MATCH(question, answer) AGAINST (? IN NATURAL LANGUAGE MODE) LIMIT 1`;
    const results = await query(sql, [message]);
    let reply = 'Sorry, I could not find an answer. Please rephrase or contact support.';
    if (results && results.length > 0) {
      reply = results[0].answer;
    }
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ reply: 'Sorry, something went wrong.' }, { status: 500 });
  }
}
