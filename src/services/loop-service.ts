import RecordNotFoundError from "../../../interface/src/errors/RecordNotFountError";
import LoopModel from "../repository/models/LoopModel";
import { CreateLoopRequest, Loop, UpdateLoopRequest } from "../types/loop-types";

export const getLoopFromModel = (model: LoopModel): Loop => {
    return {
        id: model.id,
        userId: model.userId,
        title: model.title,
        tempo: model.tempo,
        barLength: model.barLength,
        barCount: model.barCount,
        instruments: JSON.parse(model.instruments),
    };
};

/**
 * @throws RecordNotFoundError
 */
export const getLoopById = async (id: number) => {
    const loop = await LoopModel.findByPk(id);
    if (!loop) {
        throw new RecordNotFoundError(id, LoopModel.tableName);
    }
    return loop;
};

export const getAllLoops = async (): Promise<LoopModel[]> => {
    return LoopModel.findAll();
};

export const getAllLoopsForUser = async (userId: number): Promise<LoopModel[]> => {
    return LoopModel.findAll({ where: { userId } });
};

export const createLoop = async (loop: CreateLoopRequest, userId: number) => {
    const { title, tempo, barLength, barCount, instruments } = loop;
    return LoopModel.create({
        title,
        tempo,
        barLength,
        barCount,
        instruments: JSON.stringify(instruments),
        userId,
    });
};

export const updateLoop = async (model: LoopModel, loop: UpdateLoopRequest): Promise<LoopModel> => {
    const { title, tempo, barLength, barCount, instruments } = loop;
    model.title = title;
    model.tempo = tempo;
    model.barLength = barLength;
    model.barCount = barCount;
    model.instruments = JSON.stringify(instruments);
    return model.save();
};
