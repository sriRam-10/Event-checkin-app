import { GraphQLClient } from "graphql-request";
import { useAuth } from "../hooks/useAuth";

export function getClient() {
  const token = useAuth.getState().token; // get token from Zustand

  return new GraphQLClient("http://localhost:4000/graphql", {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
