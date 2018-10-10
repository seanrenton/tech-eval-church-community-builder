import { Injectable } from '@angular/core';
import { OrderDisplayComponent } from '../components/order-display/order-display.component';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class OrdersServiceService {
    private editOrderUrl = '/dbconnections/editorder';

    // a service is called in the smart component to handle data and pass information to and from backend to front end and vice versa

    constructor(private http: Http) { }

    // dipslay order route to connect to backend
    displayOrders() {
        return this.http.get('/dbconnections/displayorders')
            .map(res => res.json());
    }

    displayFilteredOrders(filteringObject) {
        return this.http.post('/dbconnections/displayfilteredorders/', filteringObject)
            .map(res => res.json());
    }


    getOrder(id: number) {
        return this.http.get('/dbconnections/displayorders/' + id)
            .map(res => res.json());
    }

    helloWorld(orderNumber: number) {

        return this.http.get('/dbconnections/displayorders/' + orderNumber)
            .map(res => res.json());
    }

    
    filterOrders(orderFilter) {
        return this.http.get('/dbconnections/displayFilteredOrders/' + orderFilter)
            .map(res => res.json())
    }

    


}
 
