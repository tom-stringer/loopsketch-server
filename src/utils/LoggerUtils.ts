import log4js from "log4js";
import env from "../../env/env";
import path from "path";

export default class LoggerUtils {
    public getLogger(filename: string) {
        const log = log4js.getLogger(path.basename(filename, ".ts"));
        log.level = env.LOG.LEVEL;
        return log;
    }
}
