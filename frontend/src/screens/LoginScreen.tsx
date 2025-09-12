import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { getClient } from "../lib/graphqlClient";
import { gql } from "graphql-request";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

interface LoginResponse {
  login: {
    token: string;
    user: {
      id: string;
      email: string;
      name?: string;
    };
  };
}

interface LoginVariables {
  email: string;
}

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const { setToken } = useAuth();
  const navigation = useNavigation();

  const mutation = useMutation<LoginResponse, Error, LoginVariables>({
    mutationFn: async (variables) => {
      const client = getClient();
      return client.request<LoginResponse>(LOGIN_MUTATION, variables);
    },
    onSuccess: (data) => {
      setToken(data.login.token);
      navigation.navigate("Events" as never);
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <Button
        title={mutation.isPending ? "Logging in..." : "Login"}
        onPress={() => mutation.mutate({ email })}
        disabled={mutation.isPending}
      />

      {mutation.isError && (
        <Text style={styles.error}>Login failed. Try again.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  error: { color: "red", marginTop: 10, textAlign: "center" },
});
