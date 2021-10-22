import log4js from "log4js";
import env from "../../env/env";

/**
 * Property decorator defining the given property as a log4js logger.
 * Logger name and level are automatically assigned from the given class
 * and value set in .env file.
 */
export default function logger(target: Object, propertyKey: string) {
    const logger = log4js.getLogger(target.constructor.name);
    logger.level = env.LOG.LEVEL;
    Object.defineProperty(target, propertyKey, {
        value: logger,
    });
}
