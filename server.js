const app = require("./app");
const logger = require("./logger");
const { ObjectId } = require("mongodb");
const { connectToDB, getCollection, closeDBConnection } = require("./db");
const listeningPort = 3001;

let dbCollection;

async function run() {
    try {
        await connectToDB();
        dbCollection = await getCollection();
        app.listen(listeningPort, () => {
            logger.info(`server is running on port ${listeningPort}`);
        });
    } catch (e) {
        logger.error(e);
        await closeDBConnection(); // Ensure closing the database connection on error
        process.exit(1); // exit with a failure code
    }
}

run().catch(async (e) => {
        logger.error(e);
        await closeDBConnection();
        process.exit(1);
    }
);
