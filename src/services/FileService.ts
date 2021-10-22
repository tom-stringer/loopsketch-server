import fileUpload from "express-fileupload";
import path from "path";
import appRootPath from "app-root-path";

export default class FileService {
    private static async saveFile(file: fileUpload.UploadedFile, ...pathFromRoot: string[]) {
        const filePath = path.join(appRootPath.toString(), ...pathFromRoot);
        await file.mv(filePath);
    }
}
