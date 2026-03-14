import { GetTournamentOptions, GetTournamentDetail } from "../types/tournament";
import Tournament from "../models/tournament";
import throwError from "../utils/throwError";

const getAllTournamentsService = async (options: GetTournamentOptions) => {
    const { page = 1, limit = 10, name, type, status } = options;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (name) query.name = { $regex: name.trim(), $options: "i" };
    if (type) query.type = type;
    if (status) query.status = status;

    const [data, total] = await Promise.all([
        Tournament.find(query)
            .sort({ createdTime: -1 })
            .select("-roundMatches -roundPlayerIds")
            .skip(skip)
            .limit(limit)
            .lean(),
        Tournament.countDocuments(query)
    ]);

    return {
        data,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
}

const getTournamentDetailService = async ({ id }: GetTournamentDetail) => {
    const converId = Number(id);

    const [tournament] = await Tournament.aggregate([
        { $match: { _id: converId } },

        {
            $lookup: {
                from: "account",
                localField: "registers.playerId",
                foreignField: "_id",
                as: "registerPlayers"
            }
        },

        {
            $lookup: {
                from: "account",
                localField: "roundPlayerIds",
                foreignField: "_id",
                as: "roundPlayers"
            }
        },

        {
            $project: {
                name: 1,
                bannishCardCodes: 1,
                createdTime: 1,
                desc: 1,
                image: 1,
                limitNumberPlayers: 1,
                roundIndex: 1,
                roundStartedTime: 1,
                rubyFee: 1,
                rubyReward: 1,
                sponser: 1,
                status: 1,
                tournamentStartedTime: 1,
                type: 1,
                updatedTime: 1,
                winPlayerId: 1,

                registers: {
                    $map: {
                        input: "$registers",
                        as: "r",
                        in: {
                            playerId: "$$r.playerId",
                            deckId: "$$r.deckId",
                            displayName: {
                                $first: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$registerPlayers",
                                                as: "p",
                                                cond: { $eq: ["$$p._id", "$$r.playerId"] }
                                            }
                                        },
                                        as: "p",
                                        in: "$$p.displayName"
                                    }
                                }
                            },
                            avatarImage: {
                                $first: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$registerPlayers",
                                                as: "p",
                                                cond: { $eq: ["$$p._id", "$$r.playerId"] }
                                            }
                                        },
                                        as: "p",
                                        in: "$$p.avatarImage"
                                    }
                                }
                            },
                            coverImage: {
                                $first: {
                                    $map: {
                                        input: {
                                            $filter: {
                                                input: "$registerPlayers",
                                                as: "p",
                                                cond: { $eq: ["$$p._id", "$$r.playerId"] }
                                            }
                                        },
                                        as: "p",
                                        in: "$$p.coverImage"
                                    }
                                }
                            }
                        }
                    }
                },

                roundPlayers: {
                    $map: {
                        input: "$roundPlayers",
                        as: "p",
                        in: {
                            _id: "$$p._id",
                            displayName: "$$p.displayName",
                            avatarImage: "$$p.avatarImage",
                            coverImage: "$$p.coverImage"
                        }
                    }
                }
            }
        }
    ]);
    if (!tournament) {
        return throwError('Tournament not found', 404)
    }

    return tournament;
}

export { getAllTournamentsService, getTournamentDetailService };