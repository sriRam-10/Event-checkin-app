import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { getClient } from "@lib/graphqlClient";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@navigation/AppNavigator";

const EVENTS_QUERY = gql`
  query Events {
    events {
      id
      title
      description
      date
    }
  }
`;

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
}

interface EventsResponse {
  events: Event[];
}

type EventsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Events"
>;

export default function EventListScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();

  const { data, isLoading, isError } = useQuery<EventsResponse>({
    queryKey: ["events"],
    queryFn: async () => {
      const client = getClient();
      return client.request<EventsResponse>(EVENTS_QUERY);
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load events</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data.events}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("EventDetail", { id: item.id })}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  date: { fontSize: 12, color: "#666", marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red" },
});
