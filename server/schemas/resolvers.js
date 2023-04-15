const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

// This object defines the resolvers for GraphQL queries and mutations.
const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            // checks if a user is logged in and returns their data.
            if (context.user) {
                const userData = await User.findOne({
                    _id: context.user._id,
                }).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        //  logs in a user with their email and password.
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            // checks if a user with the given email exists in the database.
            if (!user) {
                throw new AuthenticationError(
                    'No user found with this email address'
                );
            }
            // checks if the password provided matches the user's password in the database.
            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }
            // generates a JWT for the logged-in user.
            const token = signToken(user);
            return { token, user };
        },
        // adds a new user to the database.
        addUser: async (parent, args) => {
            const user = await User.create(args);
            // generates a JWT for the new user.
            const token = signToken(user);
            return { token, user };
        },
        //  saves a book to a user's list of saved books.
        saveBook: async (parent, { input }, context) => {
            // checks if a user is logged in and updates their saved books list.
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input } },
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must be loggin in, duh!');
        },
        //  removes a book from a user's list of saved books.
        removeBook: async (parent, { bookId }, context) => {
            // checks if a user is logged in and removes the specified book from their saved books list.
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must be loggin in, duh!');
        },
    },
};

module.exports = resolvers;
