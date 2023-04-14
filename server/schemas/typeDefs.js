const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        me: [User]
        tech: [Tech]
        matchups(_id: ID): [Matchup]
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(input: BookInput!): User
        removeBook(bookId: ID!): User
        createMatchup(
            team1: String!
            team2: String!
            date: String!
            location: String!
        ): Matchup
        updateMatchup(_id: ID!, tech1: String!, tech2: String!): Matchup
        createVote(_id: ID!, techNum: Int!): Matchup
    }
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String!
        image: String
        link: String
    }

    input BookInput {
        authors: [String]
        description: String
        title: String!
        bookId: ID!
        image: String
        link: String
    }

    type Auth {
        token: ID!
        user: User
    }
    type Matchup {
        id: ID!
        team1: String!
        team2: String!
        date: String!
        location: String!
        tech1_votes: Int!
        tech2_votes: Int!
    }
    type Tech {
        id: ID!
        name: String!
    }
`;

module.exports = typeDefs;
