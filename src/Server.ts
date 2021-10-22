import Application from "./Application";
import env from "../env/env";
import { injectable } from "tsyringe";
import Repository from "./repository/Repository";
import { Logger } from "log4js";
import logger from "./decorators/logger";

@injectable()
export default class Server {
    @logger
    private readonly logger!: Logger;

    constructor(private readonly application: Application, private readonly _repository: Repository) {
        this.logger.info(`Using environment '${env.NODE_ENV}'`);
        this.listen();
    }

    private listen() {
        this.application.app.listen(env.PORT, () => this.logger.info("Listening on port %d", env.PORT));
    }
}
