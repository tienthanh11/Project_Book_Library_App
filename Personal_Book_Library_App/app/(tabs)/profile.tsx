import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { icons } from '@/constants/icons';
import { useEffect, useState } from 'react';
import { getBooks } from '@/lib/database';

const Profile = () => {
  const [bookCount, setBookCount] = useState(0);

  const user = {
    username: 'PersonalLibrary',
    email: 'Personallibrary@example.com',
  };

  useEffect(() => {
    const loadBookCount = async () => {
      try {
        const savedBooks = await getBooks();
        setBookCount(savedBooks.length);
      } catch (error) {
        console.error('Error fetching book count:', error);
      }
    };
    loadBookCount();
  }, []);

  const handleSyncWithOpenLibrary = () => {
    alert('Sync with Open Library functionality coming soon!');
  };

  const handleLogout = () => {
    alert('Logout functionality coming soon!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Profile</Text>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          <Image
            source={icons.person}
            style={styles.avatar}
            tintColor="#FFF"
          />
        </View>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Library Stats</Text>
        <View style={styles.statsCard}>
          <Text style={styles.statLabel}>Books Saved:</Text>
          <Text style={styles.statValue}>{bookCount}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSyncWithOpenLibrary}
        >
          <Text style={styles.actionButtonText}>Sync with Open Library</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF4444' }]}
          onPress={handleLogout}
        >
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 12,
    padding: 20,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.1)',
  },
  avatarWrapper: {
    backgroundColor: '#4A2C2A', 
    borderRadius: 50,
    padding: 15,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A2C2A', 
    marginTop: 15,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    fontStyle: 'italic',
  },
  section: {
    marginVertical: 15,
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
  statsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(74, 44, 42, 0.1)',
  },
  statLabel: {
    fontSize: 16,
    color: '#4A2C2A', 
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A2C2A', 
  },
  actionButton: {
    backgroundColor: '#4A2C2A',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#4A2C2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Profile;