import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
} from "react-native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { getClient } from "../lib/graphqlClient";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";
import { useAuth } from "../hooks/useAuth";
import io from "socket.io-client";

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
  const { setToken } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const client = getClient();
      return client.request<{ events: Event[] }>(EVENTS_QUERY);
    },
  });

  // ✅ Listen to real-time event updates
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("eventUpdated", (updatedEvent: Event) => {
      console.log("📢 Event updated:", updatedEvent);

      queryClient.setQueryData(["events"], (oldData: any) => {
        if (!oldData) return { events: [updatedEvent] };

        return {
          events: oldData.events.map((ev: Event) =>
            ev.id === updatedEvent.id ? updatedEvent : ev
          ),
        };
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const handleLogout = () => {
    setToken(null);
    navigation.navigate("Login");
  };

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
      {/* ✅ Logout Button */}
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} />
      </View>

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
  logoutContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
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
