// src/components/VerseCard.tsx
import React from 'react';

interface VerseCardProps {
  verseNumber: number;
  content: string;
}

const VerseCard: React.FC<VerseCardProps> = ({ verseNumber, content }) => {
  // Clean up content - remove potential HTML tags if needed
  const cleanContent = () => {
    // If content already has HTML formatting, use it directly
    if (content.includes('<') && content.includes('>')) {
      return content;
    }
    
    // Otherwise, just return the plain text
    return content;
  };
  
  return (
    <div className="py-2 px-1 border-b border-gray-200 dark:border-gray-700 group hover:bg-gray-50 dark:hover:bg-gray-800">
      <span className="inline-block w-8 text-sm font-semibold text-gray-500 dark:text-gray-400 mr-2">
        {verseNumber}
      </span>
      <span className="text-gray-800 dark:text-white" dangerouslySetInnerHTML={{ __html: cleanContent() }} />
    </div>
  );
};

export default VerseCard;