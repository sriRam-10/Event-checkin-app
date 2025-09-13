import { GraphQLClient } from "graphql-request";
import { useAuth } from "../hooks/useAuth"; // ✅ adjust path if needed

export function getClient() {
  // Get the latest token from auth store (set after login)
  const token = useAuth.getState().token;

  return new GraphQLClient("http://localhost:4000/graphql", {
    headers: token
      ? { Authorization: `Bearer ${token}` } // ✅ use token from store
      : {},
  });
}
