import { Injectable } from '@angular/core';
import { OrderDisplayComponent } from '../components/order-display/order-display.component';
import { MovieListComponent } from '../components/movie-list/movie-list.component';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class MovieService {

    constructor(private http: Http) { }

    displayMovies() {
        return this.http.get('/api/displayMovies')
            .map(res => res.json());
    }

    displayFilteredMovies(filteringObject) {
        return this.http.post('/api/displayfilteredmovies/', filteringObject)
            .map(res => res.json());
    }


    getMovie(id: number) {
        return this.http.get('/api/displaymovies/' + id)
            .map(res => res.json());
    }

    getNewMovie(orderNumber: number) {

        return this.http.get('/api/displayorders/' + orderNumber)
            .map(res => res.json());
    }


    filterMovies(orderFilter) {
        return this.http.get('/api/displayFilteredOrders/' + orderFilter)
            .map(res => res.json())
    }

}
