import { Injectable } from '@angular/core';
import { MovieListComponent } from '../components/movie-list/movie-list.component';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class MovieService {

    constructor(private http: Http) { }

    displayNowShowingMovies() {
        return this.http.get('/api/displayNowShowingMovies')
            .map(res => res.json());
    }

    displayPopularMovies() {
        return this.http.get('/api/displayPopularMovies')
            .map(res => res.json());
    }

    displayTopRatedMovies() {
        return this.http.get('/api/displayTopRatedMovies')
            .map(res => res.json());
    }

    displayMovie(id: number) {

        return this.http.get('/api/displayMovie/' + id)
            .map(res => res.json());
    }

}
