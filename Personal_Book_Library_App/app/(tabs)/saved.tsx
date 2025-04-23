import { View, Text, FlatList, Button, StyleSheet, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { getBooks, deleteBook, Book } from '@/lib/database';
import BookCard from '@/components/BookCard';

export default function Saved() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categorizedBooks, setCategorizedBooks] = useState<{ [key: string]: Book[] }>({});

  useEffect(() => {
    const loadBooks = async () => {
      const savedBooks = await getBooks();
      setBooks(savedBooks);

      const categorized = savedBooks.reduce((acc: { [key: string]: Book[] }, book: Book) => {
        const category = book.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(book);
        return acc;
      }, {});
      setCategorizedBooks(categorized);
    };
    loadBooks();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteBook(id);
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);

    const categorized = updatedBooks.reduce((acc: { [key: string]: Book[] }, book: Book) => {
      const category = book.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(book);
      return acc;
    }, {});
    setCategorizedBooks(categorized);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5E8C7" />
      <Text style={styles.headerTitle}>Saved Books</Text>
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
                  <Button
                    title="Delete"
                    onPress={() => handleDelete(item.id)}
                    color="#FF4444"
                  />
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
            <Text style={styles.emptyText}>No saved books yet.</Text>
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
    minHeight: 240, 
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