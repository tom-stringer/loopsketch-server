import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import fileUpload from "express-fileupload";
import { injectable } from "tsyringe";
import ApiRouter from "./routers/ApiRouter";
import ResponseService from "./services/ResponseService";

@injectable()
export default class Application {
    public readonly app = express();

    constructor(private readonly apiRouter: ApiRouter, private readonly responseService: ResponseService) {
        this.configureExpressApp();
        this.attachRouter();
        this.attachErrorMiddleware();
    }

    private configureExpressApp() {
        this.app.use(bodyParser.json());
        this.app.use(
            session({
                secret: "hello world",
                resave: false,
                saveUninitialized: false,
            })
        );
        this.app.use(fileUpload());
    }

    private attachRouter() {
        this.app.use("/api", this.apiRouter.router);
    }

    private attachErrorMiddleware() {
        this.app.use((error: Error, req: Request, res: Response, _next: NextFunction) => {
            return this.responseService.sendError(res, error);
        });
    }
}
