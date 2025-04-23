import * as SQLite from 'expo-sqlite';

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url?: string;
  saved_at?: string;
  category?: string;
}

const db = SQLite.openDatabaseAsync('library.db');

export const initDatabase = async () => {
  const database = await db;
  try {
      await database.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS books (
              id TEXT PRIMARY KEY NOT NULL,
              title TEXT NOT NULL,
              author TEXT,
              cover_url TEXT,
              saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              category TEXT
          );
      `);

      const columns = await database.getAllAsync("PRAGMA table_info(books)");
      const hasCategoryColumn = columns.some((column: any) => column.name === 'category');
      if (!hasCategoryColumn) {
          await database.execAsync(`
              ALTER TABLE books ADD COLUMN category TEXT;
          `);
      }
      console.log('Database initialized successfully');
  } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
  }
};

export const addBook = async (book: Book) => {
  const database = await db;
  try {
      console.log('Attempting to add book to database:', book); 
      await database.runAsync(
          'INSERT OR REPLACE INTO books (id, title, author, cover_url, category) VALUES (?, ?, ?, ?, ?)',
          [book.id, book.title, book.author || '', book.cover_url || '', book.category || '']
      );
      console.log('Book added successfully:', book); 
  } catch (error) {
      console.error('Error adding book to database:', error);
      throw error;
  }
};

export const getBooks = async (): Promise<Book[]> => {
    const database = await db;
    try {
      const books = (await database.getAllAsync('SELECT * FROM books')) as Book[];
      console.log('Books retrieved from database:', books);
      return books.map((book) => ({
        ...book,
        cover_url: book.cover_url || 'https://via.placeholder.com/100x150.png?text=No+Cover',
        title: book.title || 'Untitled',
        author: book.author || 'Unknown Author',
        category: book.category || 'Uncategorized',
      }));
    } catch (error) {
      console.error('Error retrieving books from database:', error);
      return [];
    }
  };

export const deleteBook = async (id: string) => {
  const database = await db;
  try {
      await database.runAsync('DELETE FROM books WHERE id = ?', [id]);
      console.log('Book deleted successfully, ID:', id); 
  } catch (error) {
      console.error('Error deleting book from database:', error);
      throw error;
  }
};