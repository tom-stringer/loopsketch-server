import appRootPath from "app-root-path";
import path from "path";

export default class PathUtils {
    static pathFromRoot(...paths: string[]): string {
        return path.join(appRootPath.toString(), ...paths);
    }
}
