import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";
import { getClient } from "@lib/graphqlClient";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@navigation/AppNavigator";

const EVENT_QUERY = gql`
  query Event($id: ID!) {
    event(id: $id) {
      id
      name
      location
      startTime
      attendees {
        id
        email
        name
      }
    }
  }
`;

const CHECKIN_MUTATION = gql`
  mutation CheckIn($eventId: ID!) {
    checkIn(eventId: $eventId) {
      id
      attendees {
        id
        email
        name
      }
    }
  }
`;

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Event {
  id: string;
  name: string;
  location?: string;
  startTime: string;
  attendees: User[];
}

interface EventResponse {
  event: Event;
}

interface CheckInResponse {
  checkIn: Event;
}

type EventDetailRouteProp = RouteProp<RootStackParamList, "EventDetail">;

export default function EventDetailScreen() {
  const route = useRoute<EventDetailRouteProp>();
  const { id } = route.params;
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<EventResponse>({
    queryKey: ["event", id],
    queryFn: async () => {
      const client = getClient();
      return client.request<EventResponse>(EVENT_QUERY, { id });
    },
  });

  const mutation = useMutation<CheckInResponse>({
    mutationFn: async () => {
      const client = getClient();
      return client.request<CheckInResponse>(CHECKIN_MUTATION, {
        eventId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", id] });
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading event...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Failed to load event</Text>
      </View>
    );
  }

  const event = data.event;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Text style={styles.desc}>{event.location}</Text>
      <Text style={styles.date}>
        {new Date(event.startTime).toLocaleString()}
      </Text>

      <Text style={styles.section}>Attendees:</Text>
      {event.attendees.length > 0 ? (
        event.attendees.map((att) => (
          <Text key={att.id}>
            {att.name || att.email} ({att.email})
          </Text>
        ))
      ) : (
        <Text>No one has checked in yet</Text>
      )}

      <View style={styles.button}>
        <Button
          title={mutation.isPending ? "Checking in..." : "Check In"}
          onPress={() => mutation.mutate()}
          disabled={mutation.isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  desc: { fontSize: 16, marginBottom: 8 },
  date: { fontSize: 14, color: "#666", marginBottom: 16 },
  section: { fontSize: 18, marginTop: 16, marginBottom: 8 },
  button: { marginTop: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red" },
});
