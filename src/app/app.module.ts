import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgForOf } from '@angular/common';
import { CanActivate, RouterModule, Routes } from '@angular/router';
import { FormsModule, FormBuilder } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { EditOrderComponent } from './components/edit-order/edit-order.component';
import { FlashMessagesModule } from 'ngx-flash-messages';
import { FileUploader } from 'ng2-file-upload';


import { OrdersServiceService } from './services/orders-service.service';
import { MovieService } from './services/movie.service';


import { FocusDirective } from './directives/focus.directive';
import { OrderByPipe } from './components/order-display/order-by.pipe';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';



const appRoutes: Routes = [
]

@NgModule({
    declarations: [
        AppComponent,
        EditOrderComponent,
        FocusDirective,
        OrderByPipe,
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
    providers: [OrdersServiceService, FormBuilder, MovieService, OrderByPipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
