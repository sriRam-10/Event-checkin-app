import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { getClient } from "../lib/graphqlClient";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

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

type EventsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Events"
>;

export default function EventListScreen() {
  const navigation = useNavigation<EventsScreenNavigationProp>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const client = getClient();
      return client.request<{ events: Event[] }>(EVENTS_QUERY);
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load events</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data?.events || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("EventDetail", { id: item.id })
            }
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text>{item.location}</Text>
            <Text>{new Date(item.date).toLocaleString()}</Text>
            <Text>Attendees: {item.attendees.length}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  card: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
