import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Session } from '../Session';
import { of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { ServerResponse } from '../ServerResponse';
import { environment } from 'src/environments/environment';

@Injectable()
export class SessionService {
    private cachedScenarioSessions: Map<string, Session> = new Map();

    constructor(
        private http: HttpClient
    ) {
    }

    public new(sessionId: string, courseId: string) {
        let params = new HttpParams()
            .set("scenario", sessionId);
            if (courseId) {
                params = params.set("course", courseId);
            }
        return this.http.post(`${environment.server}/sessions`, params)
            .pipe(
                map((s: ServerResponse) => {
                    return JSON.parse(atob(s.content));
                }),
                tap((s: Session) => {
                    this.cachedScenarioSessions.set(s.id, s);
                })
            )
    }

    public pause(sessionId: string) {
        return this.http.put(`${environment.server}/sessions/${sessionId}/pause`, {});
    }

    public resume(sessionId: string) {
        return this.http.put(`${environment.server}/sessions/${sessionId}/resume`, {});
    }

    public keepalive(sessionId: string) {
        return this.http.put(`${environment.server}/sessions/${sessionId}/keepalive`, {})
    }

    public get(id: string) {
        if (this.cachedScenarioSessions.get(id) != null) {
            return of(this.cachedScenarioSessions.get(id));
            // HOW DO WE MAKE THIS EXPIRE?
        } else {
            return this.http.get(`${environment.server}/sessions/${id}`)
                .pipe(
                    // do a "map and tap"
                    map((s: ServerResponse) => {
                        return JSON.parse(atob(s.content));
                    }),
                    tap((s: Session) => {
                        this.cachedScenarioSessions.set(s.id, s);
                    })
                )
        }
    }

}
