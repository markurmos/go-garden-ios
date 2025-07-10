import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { CachedImage } from '../utils/imageCache';

const ExploreView = ({ gardeningArticles, setSelectedArticle, setShowArticleModal }) => {
  return (
    <ScrollView style={styles.content}>
      <View style={styles.exploreHeader}>
        <Text style={styles.exploreTitle}>Discover Gardening Wisdom</Text>
        <Text style={styles.exploreSubtitle}>
          Curated tips from the best gardening experts on the web
        </Text>
      </View>

      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All', 'Beginner', 'Advanced', 'Small Space', 'Seasonal'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, { backgroundColor: '#f3f4f6' }]}
            >
              <Text style={[styles.categoryText, { color: '#6b7280' }]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.articlesContainer}>
        {gardeningArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => {
              setSelectedArticle(article);
              setShowArticleModal(true);
            }}
          >
            <CachedImage 
              source={{ uri: article.image }}
              style={styles.articleImage}
              contentFit="cover"
            />
            <View style={styles.articleContent}>
              <View style={styles.articleHeader}>
                <Text style={styles.articleCategory}>{article.category}</Text>
                <Text style={styles.articleReadTime}>{article.readTime}</Text>
              </View>
              <Text style={styles.articleTitle} numberOfLines={2}>
                {article.title}
              </Text>
              <Text style={styles.articleSummary} numberOfLines={2}>
                {article.summary}
              </Text>
              <Text style={styles.articleSource}>by {article.source}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  exploreHeader: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  exploreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  exploreSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  categoryTabs: {
    marginBottom: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  articlesContainer: {
    gap: 16,
    paddingBottom: 100,
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#22c55e',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  articleReadTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  articleSummary: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  articleSource: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default ExploreView; 