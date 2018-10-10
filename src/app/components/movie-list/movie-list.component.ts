import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '@angular/common';
import { NgForOf } from '@angular/common';
import { MovieService } from '../../services/movie.service';
import { Movies } from '../../models/movies';

@Component({
    selector: 'app-movie-list',
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {

    movies = [];
    nowShowing = false;
    topRated = false;
    mostPopular = false;

    movieList: any = {
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
        vote_average: Number
    }



    constructor(private movieService: MovieService, private router: Router, private location: Location) { }

    ngOnInit(): void {


    }

    displayNowShowingMovies() {
        this.movies = [];
        this.nowShowing = true;
        this.mostPopular = false;
        this.topRated = false;
        this.movieService.displayNowShowingMovies()
            .subscribe(
                data => {

                    const movieResponse = data;

                    console.log(movieResponse);


                    for (const i in movieResponse.results) {

                        if (movieResponse.results[i]) {

                            this.movies.push(new Movies(
                                movieResponse.results[i].poster_path,
                                movieResponse.results[i].adult,
                                movieResponse.results[i].overview,
                                movieResponse.results[i].release_date,
                                movieResponse.results[i].genre_ids,
                                movieResponse.results[i].id,
                                movieResponse.results[i].original_title,
                                movieResponse.results[i].original_language,
                                movieResponse.results[i].title,
                                movieResponse.results[i].backdrop_path,
                                movieResponse.results[i].popularity,
                                movieResponse.results[i].vote_count,
                                movieResponse.results[i].video,
                                movieResponse.results[i].vote_average
                            ))
                        }
                    };
                    console.log(this.movies);


                },
                error => alert(error),
                () => console.log('displaying now playing movies')
            );
    }

    displayPopularMovies() {
        this.movies = [];
        this.nowShowing = false;
        this.mostPopular = true;
        this.topRated = false;
        this.movieService.displayPopularMovies()
            .subscribe(
                data => {

                    const movieResponse = data;

                    console.log(movieResponse);


                    for (const i in movieResponse.results) {

                        if (movieResponse.results[i]) {

                            this.movies.push(new Movies(
                                movieResponse.results[i].poster_path,
                                movieResponse.results[i].adult,
                                movieResponse.results[i].overview,
                                movieResponse.results[i].release_date,
                                movieResponse.results[i].genre_ids,
                                movieResponse.results[i].id,
                                movieResponse.results[i].original_title,
                                movieResponse.results[i].original_language,
                                movieResponse.results[i].title,
                                movieResponse.results[i].backdrop_path,
                                movieResponse.results[i].popularity,
                                movieResponse.results[i].vote_count,
                                movieResponse.results[i].video,
                                movieResponse.results[i].vote_average
                            ))
                        }
                    };

                    console.log(this.movies)

                },
                error => alert(error),
                () => console.log('displaying most popular movies')
            );
    }

    displayTopRatedMovies() {
        this.movies = [];
        this.nowShowing = false;
        this.mostPopular = false;
        this.topRated = true;
        this.movieService.displayTopRatedMovies()
            .subscribe(
                data => {

                    const movieResponse = data;

                    console.log(movieResponse);


                    for (const i in movieResponse.results) {

                        if (movieResponse.results[i]) {

                            this.movies.push(new Movies(
                                movieResponse.results[i].poster_path,
                                movieResponse.results[i].adult,
                                movieResponse.results[i].overview,
                                movieResponse.results[i].release_date,
                                movieResponse.results[i].genre_ids,
                                movieResponse.results[i].id,
                                movieResponse.results[i].original_title,
                                movieResponse.results[i].original_language,
                                movieResponse.results[i].title,
                                movieResponse.results[i].backdrop_path,
                                movieResponse.results[i].popularity,
                                movieResponse.results[i].vote_count,
                                movieResponse.results[i].video,
                                movieResponse.results[i].vote_average
                            ))
                        }
                    };




                },
                error => alert(error),
                () => console.log('displaying top rated movies')
            );
    }

}
