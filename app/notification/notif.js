import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const NotificationItem = ({ title, time }) => (
  <View style={styles.notificationItem}>
    <Text style={styles.notificationTitle}>{title}</Text>
    <Text style={styles.notificationTime}>{time}</Text>
  </View>
);

export default function NotificationsScreen() {
  const notifications = [
    {
      id: 1,
      title: "L'agent a été de passage",
      time: 'Recently'
    },
    {
      id: 2,
      title: "L'agent a été de passage",
      time: '10:00 AM'
    },
    {
      id: 3,
      title: "L'agent a été de passage",
      time: '22 June 2023'
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map(notification => (
          <NotificationItem
            key={notification.id}
            title={notification.title}
            time={notification.time}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationTitle: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 4,
    fontWeight: '500',
  },
  notificationTime: {
    fontSize: 14,
    color: '#666666',
  },
});