import { Injectable } from "@angular/core";
import { HttpHelperService } from "./http-helper-service";
import { AppUrlConstants } from "../app-url.constants";

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private httpHelper: HttpHelperService){}

    public analyzeFile(payload: any) {
        return this.httpHelper.post(AppUrlConstants.ANALYZE_FILE, 
            payload, {}
        );
    }

    public genPackage(payload: any) {
        return this.httpHelper.post(AppUrlConstants.GEN_DOWNLOAD_PACKAGE, 
            payload, {
                options: {
                requestType: 'blob',
                observe: 'response'
            }
        }
        );
    }


}