import PropertyInvalidError from "../../../interface/src/errors/PropertyInvalidError";
import LoopModel from "../repository/models/LoopModel";
import { CreateLoopRequest, Loop, UpdateLoopRequest } from "../types/loop-types";
import { validateRequest, ValidationTemplate } from "./request-validation";
import LoopAuthenticationError from "../../../interface/src/errors/LoopAuthenticationError";

export const CREATE_LOOP_TEMPLATE: ValidationTemplate = {
    title: "string",
    tempo: "number",
    barLength: "number",
    barCount: "number",
    instruments: "object",
};

/**
 * @throws PropertyInvalidError
 */
export const validateCreateLoopRequest = (loop: CreateLoopRequest) => {
    validateRequest(loop, CREATE_LOOP_TEMPLATE);

    const { tempo, barLength, barCount, instruments } = loop;

    if (tempo < 0 || tempo > 300) {
        throw new PropertyInvalidError("tempo");
    }
    if (barLength !== 4) {
        throw new PropertyInvalidError("barLength", "Bar length must be 4");
    }
    if (barCount < 1) {
        throw new PropertyInvalidError("barCount", "Bar count must be positive");
    }
    if (Object.keys(instruments).length < 1) {
        throw new PropertyInvalidError("instruments", "Instruments cannot be empty");
    }
};

export const UPDATE_LOOP_TEMPLATE: ValidationTemplate = {
    userId: "number",
    title: "string",
    tempo: "number",
    barLength: "number",
    barCount: "number",
    instruments: "object",
};

/**
 * @throws PropertyInvalidError
 */
export const validateUpdateLoopRequest = (loop: UpdateLoopRequest) => {
    validateRequest(loop, UPDATE_LOOP_TEMPLATE);

    const { tempo, barLength, barCount, instruments } = loop;

    if (tempo < 0 || tempo > 300) {
        throw new PropertyInvalidError("tempo");
    }
    if (barLength !== 4) {
        throw new PropertyInvalidError("barLength", "Bar length must be 4");
    }
    if (barCount < 1) {
        throw new PropertyInvalidError("barCount", "Bar count must be positive");
    }
    if (Object.keys(instruments).length < 1) {
        throw new PropertyInvalidError("instruments", "Instruments cannot be empty");
    }
};

/**
 * @throws LoopAuthenticationError
 */
export const validateUserOwnsLoop = (userId: number, loop: Loop | LoopModel) => {
    if (userId !== loop.userId) {
        throw new LoopAuthenticationError(userId, loop.title);
    }
};
