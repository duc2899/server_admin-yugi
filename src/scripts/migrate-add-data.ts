import { connectDB } from "../config/db";
import AccountAdmin from "../models/accountAdmin";
async function migrate() {
    try {
        connectDB()

        await AccountAdmin.updateMany(
            { lastedLogin: { $exists: false } },
            { $set: { lastedLogin: null } }
        )

        console.log("Done");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }

}

migrate();
