import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kindergarden } from './interfaces/Kindergarden';
import { StoreService } from './store.service';
import { Child, ChildResponse } from './interfaces/Child';
import { CHILDREN_PER_PAGE } from './constants';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient, private storeService: StoreService) { }

  public getKindergardens(): Observable<Kindergarden[]> { 
    return this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens');
  }

  public getChildren(page: number): Observable<void> {
    return this.http.get<ChildResponse[]>(`http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}`, { observe: 'response' }).pipe(
      tap(data => {
        this.storeService.children = data.body!.map(child => {
          // Assuming registrationDate is part of your ChildResponse
          return { ...child, registrationDate: new Date() }; 
        });
        this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
      }),
      map(() => {})
    );
  }

    public addChildData(child: Child, page:  number) {
      this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
        this.getChildren(page);
      })
    }

    public deleteChildData(childId: string, page: number): Observable<void> {
      return this.http.delete(`http://localhost:5000/childs/${childId}`).pipe(
        tap(() => this.getChildren(page)),
        // Ensure the observable returns void
        map(() => {})
      );
    }
  }
