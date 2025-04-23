import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { searchBooks } from '@/lib/api';
import { addBook, Book } from '@/lib/database';
import BookCard from '@/components/BookCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);

  const handleSearch = async () => {
    try {
      const books = await searchBooks(query);
      const booksWithCategory = books.map(book => ({
        ...book,
        category: query.toLowerCase(),
      }));
      setResults(booksWithCategory);
    } catch (error) {
      console.error('Error searching books:', error);
      alert('Failed to search books. Please try again.');
    }
  };

  const handleAddBook = async (book: Book) => {
    try {
      const bookToAdd = { ...book, category: query.toLowerCase() };
      console.log('Adding book to database:', bookToAdd);
      await addBook(bookToAdd);
      console.log('Book added successfully:', bookToAdd);
      alert(`${book.title} added to your library!`);
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Search Books</Text>

      <View style={styles.searchContainer}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search for books..."
          style={styles.input}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <BookCard book={item} />
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddBook(item)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bookList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Search for a book to add it to your library.</Text>
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
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A2C2A', 
    marginBottom: 20,
    marginLeft: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 12,
    padding: 10,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 10,
    fontSize: 16,
    color: '#2F2F2F',
  },
  searchButton: {
    backgroundColor: '#4A2C2A', 
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookList: {
    paddingHorizontal: 5,
  },
  bookItem: {
    flex: 1,
    margin: 8,
    minHeight: 240, 
  },
  addButton: {
    backgroundColor: '#4A2C2A', 
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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