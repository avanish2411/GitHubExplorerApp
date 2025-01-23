import React, { useState, useCallback } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setRepositories } from '../store/slices/repositoriesSlice';
import RepositoryItem from './RepositoryItem';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';

const SkeletonLoader = () => {
  return (
    <View style={styles.skeletonContainer}>
      {[...Array(5)].map((_, index) => (
        <View key={index} style={styles.skeletonItem}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonTextContainer}>
            <View style={styles.skeletonText} />
            <View style={styles.skeletonSubText} />
          </View>
        </View>
      ))}
    </View>
  );
};

export default function RepositoryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const repositories = useSelector((state) => state.repositories);
  const dispatch = useDispatch();

  const scrollY = new Animated.Value(0);
  const [showSearchBar, setShowSearchBar] = useState(true);

  const searchRepositories = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(`https://api.github.com/search/repositories?q=${query}`);
      dispatch(setRepositories(response.data.items));
    } catch (error) {
      alert('Error fetching repositories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Using debounce to limit API calls
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.length >= 3) {
        searchRepositories(query);
      }
    }, 500),
    []
  );

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  scrollY.addListener(({ value }) => {
    if (value > 50 && showSearchBar) {
      setShowSearchBar(false);
    } else if (value <= 50 && !showSearchBar) {
      setShowSearchBar(true);
    }
  });

  return (
    <View style={styles.container}>
      {showSearchBar && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search Repositories"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
        </View>
      )}
      {isLoading ? (
        <SkeletonLoader />
      ) : repositories.length === 0 ? (
        <Text style={styles.emptyText}>No repositories found. Start searching!</Text>
      ) : (
        <FlatList
          data={repositories}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RepositoryItem repository={item} />}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  emptyText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
  skeletonContainer: {
    padding: 15,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  skeletonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonText: {
    height: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 5,
    borderRadius: 4,
  },
  skeletonSubText: {
    height: 10,
    backgroundColor: '#e0e0e0',
    width: '60%',
    borderRadius: 4,
  },
});
