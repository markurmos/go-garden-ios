import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ErrorMessage = ({ 
  visible = true,
  title = 'Something went wrong',
  message = 'Please try again later',
  onRetry = null,
  retryText = 'Try Again',
  style = {},
  type = 'error' // 'error', 'warning', 'info'
}) => {
  if (!visible) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'warning':
        return { icon: 'warning', color: '#f59e0b' };
      case 'info':
        return { icon: 'information-circle', color: '#3b82f6' };
      default:
        return { icon: 'alert-circle', color: '#ef4444' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Ionicons name={icon} size={48} color={color} />
        <Text style={styles.title}>{title}</Text>
        {message && <Text style={styles.message}>{message}</Text>}
        {onRetry && (
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: color }]} onPress={onRetry}>
            <Ionicons name="refresh" size={16} color="white" style={styles.retryIcon} />
            <Text style={styles.retryText}>{retryText}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  retryIcon: {
    marginRight: 6,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ErrorMessage; 