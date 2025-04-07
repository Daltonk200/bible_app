// src/api/bibleApi.ts
import axios from 'axios';
import { BibleVersion, Book, Chapter, Verse } from '../types/bible';

const API_KEY = '1f9c9863d7835942ffa4bfbe8196fc6f';
const BASE_URL = 'https://api.scripture.api.bible/v1';

const bibleApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'api-key': API_KEY,
  },
});

export const getBibleVersions = async (): Promise<BibleVersion[]> => {
  try {
    const response = await bibleApi.get('/bibles');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching Bible versions:', error);
    throw error;
  }
};

export const getBooks = async (bibleId: string): Promise<Book[]> => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/books`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const getChapters = async (bibleId: string, bookId: string): Promise<Chapter[]> => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/books/${bookId}/chapters`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chapters:', error);
    throw error;
  }
};

export const getChapterContent = async (bibleId: string, chapterId: string): Promise<Verse> => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/chapters/${chapterId}`, {
      params: {
        'content-type': 'text',  // Try 'text' format first
        'include-notes': false,
        'include-titles': true,
        'include-chapter-numbers': false,
        'include-verse-numbers': true,
        'include-verse-spans': true,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching chapter content:', error);
    throw error;
  }
};

export const searchVerses = async (bibleId: string, query: string): Promise<any> => {
  try {
    const response = await bibleApi.get(`/bibles/${bibleId}/search`, {
      params: {
        query,
        limit: 20,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching verses:', error);
    throw error;
  }
};