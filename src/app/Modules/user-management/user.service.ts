import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  sub=new Subject()

  constructor(private http:HttpClient) { }

  getUserList(){
   return this.http.get<any[]>('http://localhost:3000/signup')
  }

  reloadUserList(){
    this.sub.next(null);
  }

  Approve(payload:any){
    return this.http.put(`http://localhost:3000/signup/${payload.id}`,payload)
  }
  getUserById(id:any){
    return this.http.get(`http://localhost:3000/signup/${id}`)
  }
  
  saveNewUser(payload:any){
    return this.http.post('http://localhost:3000/signup',payload)
   }

  updateUser(payload:any){
    return this.http.put(`http://localhost:3000/signup/${payload.id}`,payload)
  }

  deleteUser(id:number){
    return this.http.delete(`http://localhost:3000/signup/${id}`)
  }
}
