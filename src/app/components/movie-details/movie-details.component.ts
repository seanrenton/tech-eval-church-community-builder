import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { MovieService } from '../../services/movie.service';

@Component({
    selector: 'app-movie-details',
    templateUrl: './movie-details.component.html',
    styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {

    movieDetails: any = {
        poster_path: String,
        adult: Boolean,
        overview: String,
        release_date: String,
        genre_ids: Array,
        id: Number,
        original_title: String,
        original_language: String,
        title: String,
        backdrop_path: String,
        popularity: Number,
        vote_count: Number,
        video: Boolean,
        vote_average: Number,
        budget: Number,
        status: String,
        production_companies: Object
    }

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private router: Router,
        private movieService: MovieService
    ) { }

    ngOnInit() {

        this.route.paramMap
            .switchMap((params: ParamMap) => this.movieService.displayMovie(+params.get('id')
            ))
            .subscribe(movie => {
                console.log(movie.production_companies)

                this.movieDetails.poster_path = movie.poster_path;
                this.movieDetails.adult = movie.adult;
                this.movieDetails.overview = movie.overview;
                this.movieDetails.release_date = movie.release_date;
                this.movieDetails.genre_ids = movie.genre_ids;
                this.movieDetails.id = movie.id;
                this.movieDetails.original_title = movie.original_title;
                this.movieDetails.original_language = movie.original_language;
                this.movieDetails.title = movie.title;
                this.movieDetails.backdrop_path = movie.backdrop_path;
                this.movieDetails.popularity = movie.popularity;
                this.movieDetails.vote_count = movie.vote_count;
                this.movieDetails.video = movie.video;
                this.movieDetails.vote_average = movie.vote_average;
                this.movieDetails.budget = movie.budget;
                this.movieDetails.status = movie.status;
                this.movieDetails.production_companies = movie.production_companies;
            })

    }

}
