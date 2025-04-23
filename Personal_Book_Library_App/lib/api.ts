export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  category?: string;
}

export interface BookDetails {
  title: string;
  authors?: { name: string }[];
  publishers?: string[];
  publish_date?: string;
  number_of_pages?: number;
  description?: string | { value: string };
  isbn_10?: string[];
  isbn_13?: string[];
  covers?: number[];
}

export const getCoverUrl = (coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M') => {
  if (!coverId || isNaN(coverId)) {
    return 'https://via.placeholder.com/100x150.png?text=No+Cover';
  }
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

export const searchBooks = async (query: string): Promise<Book[]> => {
  const response = await fetch(
    `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
  );
  const data = await response.json();
  return data.docs.map((doc: any) => ({
    id: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] || '',
    cover_url: doc.cover_i ? getCoverUrl(doc.cover_i) : undefined,
  }));
};

export const getBookDetails = async (workId: string): Promise<BookDetails | null> => {
  try {
    // Lấy thông tin Work
    const workResponse = await fetch(`https://openlibrary.org${workId}.json`);
    const workData = await workResponse.json();

    // Lấy thông tin Editions để lấy number_of_pages
    const editionsResponse = await fetch(`https://openlibrary.org${workId}/editions.json`);
    const editionsData = await editionsResponse.json();

    let numberOfPages: number | undefined;
    if (editionsData.entries && editionsData.entries.length > 0) {
      const firstEditionKey = editionsData.entries[0].key;
      const editionResponse = await fetch(`https://openlibrary.org${firstEditionKey}.json`);
      const editionData = await editionResponse.json();
      numberOfPages = editionData.number_of_pages;
    }

    // Dữ liệu mặc định nếu API không trả về
    const fallbackData: { [key: string]: { publishers: string[], publish_date: string, number_of_pages: number } } = {
      '/works/OL1184991W': { publishers: ['Harper & Row'], publish_date: '1956', number_of_pages: 133 },
      '/works/OL18294W': { publishers: ['Candlewick Press'], publish_date: '1994', number_of_pages: 32 },
      '/works/OL1527819W': { publishers: ['Thomas Seltzer'], publish_date: '1920', number_of_pages: 548 },
      '/works/OL518029W': { publishers: ['Roberts Brothers'], publish_date: '1868', number_of_pages: 759 },
      '/works/OL563703W': { publishers: ['Penguin Classics'], publish_date: '1353', number_of_pages: 750 },
      '/works/OL579192W': { publishers: ['Riverhead Books'], publish_date: '2003', number_of_pages: 371 },
      '/works/OL463307W': { publishers: ["Charles Scribner's Sons"], publish_date: '1952', number_of_pages: 127 },
      '/works/OL362149W': { publishers: ['Penguin Classics'], publish_date: '2006', number_of_pages: 191 },
    };

    // Lấy thông tin tác giả
    const authors = workData.authors?.map(async (authorEntry: any) => {
      const authorResponse = await fetch(`https://openlibrary.org${authorEntry.author.key}.json`);
      const authorData = await authorResponse.json();
      return { name: authorData.name };
    }) || [];

    const resolvedAuthors = await Promise.all(authors);

    return {
      title: workData.title,
      authors: resolvedAuthors,
      publishers: workData.publishers || fallbackData[workId]?.publishers || [],
      publish_date: workData.first_publish_date || workData.publish_date || fallbackData[workId]?.publish_date,
      number_of_pages: numberOfPages || fallbackData[workId]?.number_of_pages,
      description: workData.description,
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await fetch(`https://openlibrary.org${id}.json`);
    const data = await response.json();

    let author = 'Unknown Author';
    if (data.authors && data.authors.length > 0) {
      const authorEntry = data.authors[0];
      if (authorEntry.author && authorEntry.author.key) {
        const authorResponse = await fetch(`https://openlibrary.org${authorEntry.author.key}.json`);
        const authorData = await authorResponse.json();
        author = authorData.name || 'Unknown Author';
      }
    }

    return {
      id: id,
      title: data.title || 'Untitled',
      author: author,
      cover_url: data.cover_i ? getCoverUrl(data.cover_i) : undefined,
    };
  } catch (error) {
    console.error(`Error fetching book by ID ${id}:`, error);
    return null;
  }
};