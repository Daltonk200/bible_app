// src/types/bible.ts
export interface BibleVersion {
    id: string;
    dblId: string;
    name: string;
    abbreviation: string;
    description?: string;
    language: {
      id: string;
      name: string;
    };
  }
  
  export interface Book {
    id: string;
    bibleId: string;
    abbreviation: string;
    name: string;
    nameLong: string;
  }
  
  export interface Chapter {
    id: string;
    bibleId: string;
    number: string;
    bookId: string;
    reference: string;
  }
  
  export interface Verse {
    id: string;
    orgId: string;
    bibleId: string;
    bookId: string;
    chapterId: string;
    content: string;
    reference: string;
    verseCount: number;
    copyright: string;
    next?: {
      id: string;
      bookId: string;
    };
    previous?: {
      id: string;
      bookId: string;
    };
  }