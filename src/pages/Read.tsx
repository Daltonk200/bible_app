// src/pages/Read.tsx
import React, { useState, useEffect } from 'react';
import Select from '../components/Select';
import Loader from '../components/Loader';
import VerseCard from '../components/VerseCard';
import ErrorMessage from '../components/ErrorMessage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useBibleVersions, useBooks, useChapters, useChapterContent } from '../hooks/useBibleData';
import { searchVerses } from '../api/bibleApi';

interface ReadPosition {
  bibleId: string;
  bookId: string;
  chapterId: string;
}

const Read: React.FC = () => {
  // Get saved reading position from localStorage or use defaults
  const [readPosition, setReadPosition] = useLocalStorage<ReadPosition>('lastReadPosition', {
    bibleId: '',
    bookId: '',
    chapterId: ''
  });

  // States for selections
  const [selectedBibleId, setSelectedBibleId] = useState<string>(readPosition.bibleId || '');
  const [selectedBookId, setSelectedBookId] = useState<string>(readPosition.bookId || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(readPosition.chapterId || '');
  
  // State for search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Get Bible data using custom hooks
  const { versions, loading: loadingVersions, error: versionsError } = useBibleVersions();
  const { books, loading: loadingBooks, error: booksError } = useBooks(selectedBibleId);
  const { chapters, loading: loadingChapters, error: chaptersError } = useChapters(selectedBibleId, selectedBookId);
  const { chapterContent, loading: loadingContent, error: contentError } = useChapterContent(selectedBibleId, selectedChapterId);

  // Effect to save reading position
  useEffect(() => {
    if (selectedBibleId && selectedBookId && selectedChapterId) {
      setReadPosition({
        bibleId: selectedBibleId,
        bookId: selectedBookId,
        chapterId: selectedChapterId,
      });
    }
  }, [selectedBibleId, selectedBookId, selectedChapterId]);

  // Handle Bible version change
  const handleBibleChange = (bibleId: string) => {
    setSelectedBibleId(bibleId);
    setSelectedBookId('');
    setSelectedChapterId('');
    setSearchResults(null);
  };

  // Handle book change
  const handleBookChange = (bookId: string) => {
    setSelectedBookId(bookId);
    setSelectedChapterId('');
    setSearchResults(null);
  };

  // Handle chapter change
  const handleChapterChange = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setSearchResults(null);
  };

  // Handle search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBibleId || !searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      setSearchError(null);
      const results = await searchVerses(selectedBibleId, searchQuery);
      setSearchResults(results);
    } catch (err) {
      setSearchError('Failed to search verses');
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Parse chapter content into verses
  const parseVerses = () => {
    if (!chapterContent || !chapterContent.content) return [];

    try {
      // The API might return content in different formats
      // If it's HTML, we need to parse it
      if (typeof chapterContent.content === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = chapterContent.content;
        
        // First try to get verses with data-number attribute
        let verses = Array.from(tempDiv.querySelectorAll('[data-number]'));
        
        // If that fails, try another approach - this depends on API response format
        if (!verses.length) {
          // Try to find verse elements by class or structure
          verses = Array.from(tempDiv.querySelectorAll('.verse, span.v'));
        }
        
        // If we still can't find verses, split by verse numbers (1, 2, 3, etc.)
        if (!verses.length) {
          const content = tempDiv.textContent || '';
          const versePattern = /(\d+)\s+([^0-9]+)/g;
          const matches = Array.from(content.matchAll(versePattern));
          
          return matches.map(match => ({
            number: parseInt(match[1], 10),
            content: match[2].trim()
          }));
        }
        
        return verses.map(verse => {
          const number = verse.getAttribute('data-number') || 
                         verse.getAttribute('data-verse-number') || 
                         verse.textContent?.match(/^(\d+)/)?.[1] || '0';
          
          return {
            number: parseInt(number, 10),
            content: verse.innerHTML || verse.textContent || ''
          };
        });
      } 
      
      // If the content is already structured data
      if (typeof chapterContent.content === 'object' && chapterContent.content.verses) {
        return Object.entries(chapterContent.content.verses).map(([num, content]) => ({
          number: parseInt(num, 10),
          content: content as string
        }));
      }
      
      return [];
    } catch (error) {
      console.error("Error parsing verses:", error);
      return [];
    }
  };

  // Options for select components
  const bibleOptions = versions.map((bible) => ({
    value: bible.id,
    label: `${bible.name} (${bible.abbreviation})`,
  }));

  const bookOptions = books.map((book) => ({
    value: book.id,
    label: book.name,
  }));

  const chapterOptions = chapters
    .filter(chapter => chapter.number !== 'intro') // Filter out intro chapters if any
    .map((chapter) => ({
      value: chapter.id,
      label: `Chapter ${chapter.number}`,
    }));

  // Loading states
  const isLoading = loadingVersions || loadingBooks || loadingChapters || loadingContent;
  
  // Error states
  const error = versionsError || booksError || chaptersError || contentError;

  // Debug logs
  console.log("Selected Bible ID:", selectedBibleId);
  console.log("Selected Book ID:", selectedBookId);
  console.log("Selected Chapter ID:", selectedChapterId);
  console.log("Chapter Content:", chapterContent);

  // Render verses or search results
  const renderContent = () => {
    if (isSearching) return <Loader />;
    
    if (searchResults) {
      return (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Search Results for "{searchQuery}"</h2>
          {searchResults.verses?.length > 0 ? (
            <div className="space-y-4">
              {searchResults.verses.map((verse: any) => (
                <div key={verse.id} className="bg-gray-50 p-4 rounded-md dark:bg-gray-700">
                  <p className="font-semibold text-sm text-gray-500 dark:text-gray-300 mb-1">{verse.reference}</p>
                  <p className="dark:text-white" dangerouslySetInnerHTML={{ __html: verse.text }}></p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No results found.</p>
          )}
        </div>
      );
    }
    
    if (selectedChapterId && !loadingContent) {
      if (!chapterContent) {
        return <p className="text-gray-600 dark:text-gray-300 mt-6">No chapter content available.</p>;
      }
      
      const verses = parseVerses();
      
      if (verses.length === 0) {
        // If we couldn't parse verses properly, display raw content
        return (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">{chapterContent.reference || 'Chapter Content'}</h2>
            <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
              <div dangerouslySetInnerHTML={{ __html: typeof chapterContent.content === 'string' ? chapterContent.content : JSON.stringify(chapterContent.content) }}></div>
            </div>
          </div>
        );
      }
      
      return (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">{chapterContent.reference || 'Chapter Content'}</h2>
          <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800">
            {verses.map((verse) => (
              <VerseCard key={verse.number} verseNumber={verse.number} content={verse.content} />
            ))}
          </div>
          
          {chapterContent.copyright && (
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">{chapterContent.copyright}</p>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Read the Bible</h1>
      
      {error && <ErrorMessage message={error} />}
      
      <div className="grid md:grid-cols-3 gap-4">
        <Select
          label="Bible Version"
          value={selectedBibleId}
          onChange={handleBibleChange}
          options={bibleOptions}
          disabled={loadingVersions}
        />
        
        <Select
          label="Book"
          value={selectedBookId}
          onChange={handleBookChange}
          options={bookOptions}
          disabled={!selectedBibleId || loadingBooks}
        />
        
        <Select
          label="Chapter"
          value={selectedChapterId}
          onChange={handleChapterChange}
          options={chapterOptions}
          disabled={!selectedBookId || loadingChapters}
        />
      </div>
      
      <div className="mt-6">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search verses..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!selectedBibleId}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={!selectedBibleId || !searchQuery.trim() || isSearching}
          >
            Search
          </button>
        </form>
        
        {searchError && <p className="mt-2 text-red-500 text-sm">{searchError}</p>}
      </div>
      
      {isLoading ? <Loader /> : renderContent()}
    </div>
  );
};

export default Read;