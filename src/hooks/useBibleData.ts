// src/hooks/useBibleData.ts
import { useState, useEffect } from 'react';
import { getBibleVersions, getBooks, getChapters, getChapterContent } from '../api/bibleApi';
import { BibleVersion, Book, Chapter, Verse } from '../types/bible';

export const useBibleVersions = () => {
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const data = await getBibleVersions();
        setVersions(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Bible versions');
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();
  }, []);

  return { versions, loading, error };
};

export const useBooks = (bibleId: string) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!bibleId) return;
      
      try {
        setLoading(true);
        const data = await getBooks(bibleId);
        setBooks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [bibleId]);

  return { books, loading, error };
};

export const useChapters = (bibleId: string, bookId: string) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      if (!bibleId || !bookId) return;
      
      try {
        setLoading(true);
        const data = await getChapters(bibleId, bookId);
        setChapters(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch chapters');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [bibleId, bookId]);

  return { chapters, loading, error };
};

export const useChapterContent = (bibleId: string, chapterId: string) => {
  const [chapterContent, setChapterContent] = useState<Verse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapterContent = async () => {
      if (!bibleId || !chapterId) {
        setChapterContent(null);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getChapterContent(bibleId, chapterId);
        console.log("API Response:", data);
        setChapterContent(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching chapter content:", err);
        setError('Failed to fetch chapter content');
        setChapterContent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChapterContent();
  }, [bibleId, chapterId]);

  return { chapterContent, loading, error };
};