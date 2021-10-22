import { getLogger } from "../../src/utils/log-utils";

describe("getLogger", () => {
    test("gets logger for file", () => {
        const logger = getLogger(__filename);
        expect(logger.category).toBe("log-utils.test");
    });
});
