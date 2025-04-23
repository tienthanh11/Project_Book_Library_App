import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Book } from '@/lib/database';

const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter();

  const encodedId = encodeURIComponent(book.id);

  const href = {
    pathname: '/books/[id]' as const,
    params: { id: encodedId },
  };

  return (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => router.push(href)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: book.cover_url || 'https://via.placeholder.com/100x150.png?text=No+Cover' }}
        style={styles.bookCover}
        defaultSource={{ uri: 'https://via.placeholder.com/100x150.png?text=Loading...' }}
        onError={(e) => console.log(`Failed to load image for ${book.title}:`, book.cover_url, e.nativeEvent.error)}
      />
      <View style={styles.textContainer}>
        <Text style={styles.bookTitle}>
          {book.title || 'Untitled'}
        </Text>
        <Text style={styles.bookAuthor}>
          {book.author || 'Unknown Author'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    margin: 4,
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.1)',
  },
  bookCover: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A2C2A',
    marginBottom: 4,
    lineHeight: 20,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});

export default BookCard;