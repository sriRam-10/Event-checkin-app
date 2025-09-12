import { GraphQLClient } from "graphql-request";
import { useAuth } from "../hooks/useAuth";

export const getClient = () => {
  const token = useAuth.getState().token;
  return new GraphQLClient("http://localhost:4000/graphql", {
    headers: token ? { authorization: token } : {},
  });
};
