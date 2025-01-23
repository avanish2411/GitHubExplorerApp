import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';
import moment from 'moment';

export default function RepositoryItem({ repository }) {
  const favorites = useSelector((state) => state.favorites);
  const dispatch = useDispatch();

  const isFavorite = favorites.some((fav) => fav.id === repository.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFavorite(repository.id));
    } else {
      dispatch(addFavorite(repository));
    }
  };

  // Formatting creation and last update dates using moment
  const creationDate = moment(repository.created_at).format('MMMM Do YYYY');
  const lastUpdateDate = moment(repository.updated_at).format('MMMM Do YYYY');

  return (
    <View style={styles.container}>
      <Image source={{ uri: repository.owner.avatar_url }} style={styles.avatar} />
      <View style={styles.details}>
        <Text style={styles.name}>{repository.name}</Text>
        <Text>{repository.description}</Text>
        <Text>⭐ Stars: {repository.stargazers_count}</Text>
        <Text>🍴 Forks: {repository.forks_count}</Text>
        <Text>🛠 Language: {repository.language || 'N/A'}</Text>
        <Text>📅 Created: {creationDate}</Text>
        <Text>📅 Last Update: {lastUpdateDate}</Text>
        <TouchableOpacity onPress={toggleFavorite}>
          <Text style={styles.favorite}>{isFavorite ? 'Unfavorite' : 'Favorite'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  favorite: {
    color: 'blue',
    marginTop: 5,
  },
});
