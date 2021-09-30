import { SuperAgentRequest } from "superagent";
import { RETRY_COUNT, SECONDS_PER_REQUEST } from "../config";
import APIConnector, { APIResponse } from "./connector";

export interface ScheduledAPIRequest<T> {
    request: SuperAgentRequest;
    resolve: (result: T) => any;
    reject: (err: Error) => any;
    retryCount: number;
}

class RequestSchedulerClass {
    queueRunning: boolean = false;
    requestQueue: ScheduledAPIRequest<any>[] = [];

    execute() {
        if(this.requestQueue.length > 0) {
            const newReq = this.requestQueue[0];

            APIConnector.send_request(newReq.request)
                .then((data) => {
                    newReq.resolve(data);
                })
                .catch((err) => {
                    if(newReq.retryCount === RETRY_COUNT) {
                        newReq.reject(err);
                    } else {
                        newReq.retryCount++;
                        this.requestQueue.push(newReq);
                    }
                })
                .finally(() => {
                    this.requestQueue = this.requestQueue.splice(1);
                    setTimeout(() => this.execute(), SECONDS_PER_REQUEST * 1000);
                });
        } else {
            this.queueRunning = false;
        }
    }

    enqueue<T>(req: SuperAgentRequest): Promise<APIResponse<T>> {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({
                request: req,
                resolve,
                reject,
                retryCount: 0,
            });
            if(!this.queueRunning) {
                this.queueRunning = true;
                this.execute();
            }
        });
    }

    
}

const RequestScheduler = new RequestSchedulerClass();

export default RequestScheduler;