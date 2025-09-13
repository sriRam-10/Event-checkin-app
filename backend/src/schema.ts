import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String
  }

  type Event {
    id: ID!
    name: String!
    location: String!
    date: String
    attendees: [User!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    me: User
  }

  type Mutation {
    login(email: String!): AuthPayload!
    checkIn(eventId: ID!): Event!
  }
`;
