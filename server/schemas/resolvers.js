const { Tech, Matchup } = require('../models');


const resolvers = {
    Query: {
        tech: async () => {
            return Tech.find({});
        },
        matchups: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            return Matchup.find(params);
        },
    },
    Mutation: {
        createMatchup: async (parent, args) => {
            const matchup = await Matchup.create(args);
            return matchup;
        },
        createVote: async (parent, { _id, techNum }) => {
            const vote = await Matchup.findOneAndUpdate(
                { _id },
                { $inc: { [`tech${techNum}_votes`]: 1 } },
                { new: true }
            );
            return vote;
        },
        updateMatchup: async (parent, { _id, tech1, tech2 }) => {
            try {
                const matchup = await Matchup.findByIdAndUpdate(
                    _id,
                    { tech1, tech2 },
                    { new: true }
                );
                return matchup;
            } catch (err) {
                throw new Error('Failed to update matchup');
            }
        },
    },
};

module.exports = resolvers;
