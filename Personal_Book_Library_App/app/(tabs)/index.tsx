import { View, Text, FlatList, StyleSheet, StatusBar } from 'react-native';
import { useCallback, useState } from 'react';
import { getBooks, Book } from '@/lib/database';
import { getBookById } from '@/lib/api';
import { useFocusEffect } from 'expo-router';
import BookCard from '@/components/BookCard';

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categorizedBooks, setCategorizedBooks] = useState<{ [key: string]: Book[] }>({});

  const loadBooks = useCallback(async () => {
    try {
      const savedBooks = await getBooks();
      console.log('Books loaded in Home:', savedBooks);
      const enrichedBooks = await Promise.all(
        savedBooks.map(async (book: Book) => {
          try {
            const bookDetails = await getBookById(book.id);
            if (!bookDetails) return book;
            return {
              ...book,
              title: bookDetails.title || book.title,
              author: book.author && book.author !== 'Unknown Author' ? book.author : bookDetails.author || book.author, 
              cover_url: bookDetails.cover_url || book.cover_url,
              saved_at: book.saved_at,
            } as Book;
          } catch (error) {
            console.error(`Error fetching details for book ${book.id}:`, error);
            return book;
          }
        })
      );
      setBooks(enrichedBooks);

      const categorized = enrichedBooks.reduce((acc: { [key: string]: Book[] }, book: Book) => {
        const category = book.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(book);
        return acc;
      }, {});
      setCategorizedBooks(categorized);
    } catch (error) {
      console.error('Error loading books:', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [loadBooks])
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E8C7" />
      <Text style={styles.headerTitle}>My Book Library</Text>
      <FlatList
        data={Object.keys(categorizedBooks)}
        keyExtractor={(item) => item}
        renderItem={({ item: category }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            <FlatList
              data={categorizedBooks[category]}
              renderItem={({ item }) => (
                <View style={styles.bookItem}>
                  <BookCard book={item} />
                </View>
              )}
              keyExtractor={(book) => book.id}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.bookList}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Your library is empty. Add books from the Search tab!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E8C7',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A2C2A',
    marginBottom: 20,
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A2C2A',
    marginBottom: 12,
    paddingHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 4,
    borderRadius: 8,
  },
  bookList: {
    paddingHorizontal: 5,
  },
  bookItem: {
    flex: 1,
    margin: 8,
    minHeight: 220,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },
});
