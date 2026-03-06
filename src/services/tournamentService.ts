import { GetTournamentOptions } from "../types/tournament";
import Tournament from "../models/tournament";

const getAllTournaments = async (options: GetTournamentOptions) => {
    const { page = 1, limit = 10, name, type, status } = options;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (name) query.name = { $regex: name, $options: "i" };
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

export { getAllTournaments };