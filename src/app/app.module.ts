import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgForOf } from '@angular/common';
import { CanActivate, RouterModule, Routes } from '@angular/router';
import { FormsModule, FormBuilder } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { FileUploader } from 'ng2-file-upload';


import { MovieService } from './services/movie.service';

import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';



const appRoutes: Routes = [
    {
        path: '',
        component: MovieListComponent
    },
    {
        path: 'movie-details/:id',
        component: MovieDetailsComponent
    }
]

@NgModule({
    declarations: [
        AppComponent,
        MovieListComponent,
        MovieDetailsComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(appRoutes),
        FlashMessagesModule
    ],
    providers: [FormBuilder, MovieService],
    bootstrap: [AppComponent]
})
export class AppModule { }
