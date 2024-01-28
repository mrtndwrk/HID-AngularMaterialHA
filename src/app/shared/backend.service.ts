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
    return this.http.get<Kindergarden[]>('http://localhost:5000/kindergardens').pipe(
      tap(data => {
        this.storeService.kindergardens = data;
      })
    );
  }
  

  public getChildren(page: number): Observable<void> {
    const cacheBuster = new Date().getTime();
    const url = `http://localhost:5000/childs?_expand=kindergarden&_page=${page}&_limit=${CHILDREN_PER_PAGE}&_cb=${cacheBuster}`;
  
    return this.http.get<ChildResponse[]>(url, { observe: 'response' }).pipe(
      tap(data => {
        this.storeService.children = data.body!.map(child => {
          return { ...child, registrationDate: new Date(child.registrationDate) }; 
        });
        this.storeService.childrenTotalCount = Number(data.headers.get('X-Total-Count'));
      }),
      map(() => {})
    );
  }
  

  

    public addChildData(child: Child, page:  number) {

      child.registrationDate = new Date();

      this.http.post('http://localhost:5000/childs', child).subscribe(_ => {
        this.getChildren(page);
      })
    }

    public deleteChildData(childId: string, page: number): Observable<void> {
      return this.http.delete(`http://localhost:5000/childs/${childId}`).pipe(
        tap(() => this.getChildren(page)),
        
        map(() => {})
      );
    }
  }
