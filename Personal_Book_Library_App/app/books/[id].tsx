import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Book, getBooks } from '@/lib/database';
import { useEffect, useState } from 'react';
import { getBookDetails, getCoverUrl, BookDetails } from '@/lib/api';
import Icon from 'react-native-vector-icons/Feather';

export default function BookDetail() {
  const { id: rawId } = useLocalSearchParams();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const id = typeof rawId === 'string' ? decodeURIComponent(rawId) : Array.isArray(rawId) ? decodeURIComponent(rawId[0]) : '';

  useEffect(() => {
    const loadBookDetails = async () => {
      try {
        const savedBooks = await getBooks();
        console.log('Saved books in database (books/[id].tsx):', savedBooks);
        console.log('Looking for book with ID (processed):', id);
        const foundBook = savedBooks.find((b) => b.id === id);
        if (foundBook) {
          console.log('Found book:', foundBook);
          setBook(foundBook);
        } else {
          console.log('Book not found in database with ID:', id);
          setError('Book not found in your library.');
          return;
        }

        const details = await getBookDetails(id as string);
        console.log('Book details from API:', details);
        if (details) {
          setBookDetails(details);
        } else {
          setError('Failed to fetch book details from Open Library.');
        }
      } catch (error) {
        console.error('Error loading book details:', error);
        setError('An unexpected error occurred while loading book details.');
      }
    };

    loadBookDetails();
  }, [id]);

  const retryFetch = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const savedBooks = await getBooks();
      console.log('Retrying - Saved books in database:', savedBooks);
      const foundBook = savedBooks.find((b) => b.id === id);
      if (foundBook) {
        console.log('Retrying - Found book:', foundBook);
        setBook(foundBook);
      } else {
        console.log('Retrying - Book not found in database with ID:', id);
        setError('Book not found in your library.');
        return;
      }

      const details = await getBookDetails(id as string);
      console.log('Retrying - Book details from API:', details);
      if (details) {
        setBookDetails(details);
        setSuccessMessage('Book details loaded successfully!');
      } else {
        setError('Failed to fetch book details from Open Library.');
      }
    } catch (error) {
      console.error('Error during retry:', error);
      setError('An unexpected error occurred while retrying.');
    }
  };

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Loading...'}</Text>
        {error && (
          <TouchableOpacity onPress={retryFetch} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const description =
    bookDetails && bookDetails.description
      ? typeof bookDetails.description === 'string'
        ? bookDetails.description
        : bookDetails.description?.value || 'No description available'
      : 'No description available';

  const coverUrl =
    book.cover_url ||
    (bookDetails?.covers && bookDetails.covers.length > 0
      ? getCoverUrl(bookDetails.covers[0], 'L')
      : 'https://via.placeholder.com/150x225.png?text=No+Cover');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#4A2C2A" style={styles.backIcon} />
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={retryFetch} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {successMessage && (
        <Text style={styles.successText}>{successMessage}</Text>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={{ uri: coverUrl }} style={styles.coverImage} />
          <View style={styles.headerText}>
            <Text style={styles.title}>{bookDetails?.title || book.title}</Text>
            <Text style={styles.author}>
              {bookDetails?.authors?.map((a) => a.name).join(', ') || book.author || 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{book.category || 'Uncategorized'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Publisher:</Text>
            <Text style={styles.value}>
              {bookDetails?.publishers?.join(', ') || 'Unknown'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Publish Date:</Text>
            <Text style={styles.value}>{bookDetails?.publish_date || 'Unknown'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Number of Pages:</Text>
            <Text style={styles.value}>
              {bookDetails?.number_of_pages || 'Unknown'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E8C7', 
    padding: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    marginRight: 8,
  },
  backButtonText: {
    color: '#4A2C2A', 
    fontSize: 18,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  successText: {
    color: '#28A745',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButton: {
    backgroundColor: '#4A2C2A',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.1)',
  },
  coverImage: {
    width: 130,
    height: 195,
    borderRadius: 8,
    marginRight: 15,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A2C2A', 
    marginBottom: 8,
    lineHeight: 26,
  },
  author: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 12,
    padding: 15,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.1)',
  },
  detailRow: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2C2A', 
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: '#2F2F2F',
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: '#2F2F2F',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});