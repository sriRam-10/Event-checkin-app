import React from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { getClient } from "../lib/graphqlClient";

const EVENTS_QUERY = gql`
  query {
    events {
      id
      name
      location
      date
      attendees {
        id
      }
    }
  }
`;

interface Event {
  id: string;
  name: string;
  location: string;
  date: string;
  attendees: { id: string }[];
}

export default function EventListScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const client = getClient();
      return client.request<{ events: Event[] }>(EVENTS_QUERY);
    },
  });

  if (isLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (error) return <Text style={styles.error}>Failed to load events</Text>;

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.events || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{new Date(item.date).toLocaleString()}</Text>
            <Text>Attendees: {item.attendees.length}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
});
