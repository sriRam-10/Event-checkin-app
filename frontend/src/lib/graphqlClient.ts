import { GraphQLClient } from "graphql-request";
import { useAuth } from "../hooks/useAuth"; // ✅ fixed path

export function getClient() {
  // Zustand store state is accessed like this:
  const token = useAuth.getState().token;

  return new GraphQLClient("http://localhost:4000/graphql", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
