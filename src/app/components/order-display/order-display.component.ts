import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import { OrdersServiceService } from '../../services/orders-service.service';
import { EditedOrder } from './editedOrder';
import { Location } from '@angular/common';
import { Order } from './order';
import { OrderSnippet } from './ordersnippet';
import { LineItems } from './lineitems';
import { NgForOf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderByPipe } from './order-by.pipe';

@Component({
    selector: 'app-order-display',
    templateUrl: './order-display.component.html',
    styleUrls: ['./order-display.component.css']
})



export class OrderDisplayComponent implements OnInit {
    userLevel: any;
    showOrdersByEmail: any;
    showOrders: Object;
    showKittedOrders: Object;

    displayEditButton = false;
    submitEditedOrder = false;
    showFilterOptions = false;
    // Order: any;
    data: any;
    mode = 'Observable';
    editable: boolean;
    roundedTotal: any;
    finalRoundedTotal: any;
    industryFilter = false;

    isDesc = false;
    column = 'CategoryName';
    direction: number;




    errorMsg: any;
    orders = [];
    orderDetail = '';
    statusTypes = ['completed', 'processing']
    // testString = 'HELLO WORLD';
    // testobject:any =  {
    //   test1: '',
    //   test2: 'TEST2',
    //   test3: [
    //     {
    //       test4: 'yoyoyoyoyo'
    //     }
    //   ]
    // }

    // testPush(){
    //   this.testobject.test3.push({
    //     test5: 'Hello'
    //   })
    //   console.log(this.testobject);
    // }

    // form variables
    industryList: any;
    statusList: any;

    filterObject: any = {
        industry: '',
        orderNumber: '',
        status: '',
        total: '',
        companyName: ''
    }
    orderEdited: any = {
        orderNumber: Number,
        status: String,
        total: Number,
        invoiceTotal: Number,
        finalTotal: Number,
        invoiceFinalTotal: Number,
        tax: Number,
        invoiceTax: Number,
        lineItems: [
            {
                bases: '',
                skins: '',
                lengths: '',
                qty: Number,
                total: Number,
                sku: '',
                preFabType: '',
                unitPrice: Number,
                discountPrice: Number,
                name: '',
            }
        ],
        sFirstName: '',
        sLastName: '',
        sEmail: '',
        sPhone: '',
        sCompany: '',
        sAddress1: '',
        sCity: '',
        sState: '',
        sZip: '',
        sCountry: '',
        sLoadingDock: '',
        sDeliveryHours: '',
        sMiscNotes: '',
        sDeadLine: '',
        sIndustry: '',
        sPalletJack: '',
        bFirstName: '',
        bLastName: '',
        bCompany: '',
        bAddress1: '',
        bCity: '',
        bState: '',
        bZip: '',
        bCountry: '',
        bEmail: '',
        bPhone: '',
        shippingCost: Number,
        invoiceShippingCost: Number,
        salesName: String,
        salesEmail: String,
        wbQuoteURL: String,
        wbFinalURL: String,
        erp2qboinvoice: Boolean,
        erp2qbocustomer: Boolean,
        paymentTerms: String,
        cin7SalesOrderShipped: Boolean,
        qboInvoiceSent: Boolean,
        qboInvoicePaid: Boolean,
        cin7SalesOrderShippedTimeStamp: String,
        qboInvoiceSentTimeStamp: String,
        qboInvoicePaidTimeStamp: String,
        amtOfInvoicePaid: Number,
        orderTotalCoGs: String,
        invoiceStatus: String
    }

    constructor(private ordersService: OrdersServiceService, private router: Router, private location: Location, private auth: AuthService) { }
    update(value: string) {
        this.orderDetail = value;
        console.log('Can we do more here?')
    }

    round(number, precision) {
        const factor = Math.pow(10, precision);
        const tempNumber = number * factor;
        const roundedTempNumber = Math.round(tempNumber);
        this.finalRoundedTotal = roundedTempNumber / factor;
        return this.finalRoundedTotal;
    };

    ngOnInit(): void {

        this.filterObject = {
            industry: '',
            orderNumber: '',
            status: '',
            total: '',
            companyName: ''
        }

        this.userLevel = this.auth.userLevel;
        this.displayEditButton = true;
        // this.isDesc = !this.isDesc;
        // this.direction = -1;
        // this.column = 'invoiceFinalTotal';
        // this.sort('orderNumber');

        if (this.userLevel >= 5) {
            // this.ordersService.displayOrdersSnippet()
            //     .subscribe(
            //     data => {

            //         const orderResponse = data;

            //         for (const i in orderResponse) {
            //             if (orderResponse[i]) {
            //                 this.round(orderResponse[i].finalTotal, 2);

            //                 this.orders.push(new OrderSnippet(
            //                     orderResponse[i].orderNumber,
            //                     orderResponse[i].invoiceFinalTotal,
            //                     orderResponse[i].bCompany,
            //                     orderResponse[i].salesName,
            //                     orderResponse[i].status,
            //                     orderResponse[i].salesEmail,
            //                     orderResponse[i].invoiceStatus
            //                 ))
            //             }
            //         };



            //         // this.orderEdited = {};
            //         // console.log(this.orderEdited);
            //         // console.log(this.orders);
            //         this.showOrders = orderResponse;

            //         // this.orders.sort(function (a, b) {
            //         //     return b.orderNumber - a.orderNumber;
            //         // })
            //         const tempSet = new Set();
            //         for (const i in this.orders) {
            //             tempSet.add(this.orders[i].sIndustry)
            //         }
            //         const tempSetStatus = new Set();
            //         for (const i in this.orders) {
            //             tempSetStatus.add(this.orders[i].status)
            //         }
            //         this.statusList = tempSetStatus
            //         this.industryList = tempSet
            //         console.log(this.industryList)

            //         // console.log('HEY HEY HEY')


            //     },
            //     error => alert(error),
            //     () => console.log('Displaying Order by ID')
            //     );

            this.ordersService.displayOrders()
                .subscribe(
                data => {

                    const orderResponse = data;

                    console.log(orderResponse);


                    for (const i in orderResponse) {

                        if (orderResponse[i]) {

                            if (orderResponse[i].invoiceStatus !== 'fully paid' || orderResponse[i].status !== 'completed' ) {

                                this.round(orderResponse[i].finalTotal, 2);
                                for (const z in orderResponse[i].line_items) {
                                    if (orderResponse[i].line_items[z]) {
                                        // console.log('Z Loop')
                                        // console.log(orderResponse[i].line_items[z])
                                        this.orderEdited.line_items.push(new LineItems(
                                            orderResponse[i].line_items[z].bases, orderResponse[i].line_items[z].skins, orderResponse[i].line_items[z].lengths, orderResponse[i].line_items[z].quantity, orderResponse[i].line_items[z].total, orderResponse[i].line_items[z].preFabType, orderResponse[i].line_items[z].sku
                                        ))
                                    }
                                }
                                this.orders.push(new Order(
                                    orderResponse[i].orderNumber,
                                    orderResponse[i].total,
                                    orderResponse[i].invoiceTotal,
                                    orderResponse[i].tax,
                                    orderResponse[i].finalTotal,
                                    orderResponse[i].shippingCost,
                                    orderResponse[i].invoiceFinalTotal,
                                    orderResponse[i].invoiceTax,
                                    orderResponse[i].invoiceShippingCost,
                                    orderResponse[i].lineItems,
                                    orderResponse[i].sFirstName,
                                    orderResponse[i].sLastName,
                                    orderResponse[i].sCompany,
                                    orderResponse[i].sAddress1,
                                    orderResponse[i].sCity,
                                    orderResponse[i].sState,
                                    orderResponse[i].sZip,
                                    orderResponse[i].sCountry,
                                    orderResponse[i].bFirstName,
                                    orderResponse[i].bLastName,
                                    orderResponse[i].bCompany,
                                    orderResponse[i].bAddress1,
                                    orderResponse[i].bCity,
                                    orderResponse[i].bState,
                                    orderResponse[i].bZip,
                                    orderResponse[i].bCountry,
                                    orderResponse[i].sEmail,
                                    orderResponse[i].sPhone,
                                    orderResponse[i].bEmail,
                                    orderResponse[i].bPhone,
                                    orderResponse[i].sLoadingDock,
                                    orderResponse[i].sDeliveryHours,
                                    orderResponse[i].sMiscNotes,
                                    orderResponse[i].sDeadLine,
                                    orderResponse[i].sIndustry,
                                    orderResponse[i].salesName,
                                    orderResponse[i].wbQuoteURL,
                                    orderResponse[i].wbFinalURL,
                                    orderResponse[i].erp2qboinvoice,
                                    orderResponse[i].erp2qbocustomer,
                                    orderResponse[i].status,
                                    orderResponse[i].paymentTerms,
                                    orderResponse[i].cin7SalesOrderShipped,
                                    orderResponse[i].qboInvoiceSent,
                                    orderResponse[i].cin7SalesOrderShippedTimeStamp,
                                    orderResponse[i].qboInvoiceSentTimeStamp,
                                    orderResponse[i].salesEmail,
                                    orderResponse[i].qboInvoicePartiallyPaid,
                                    orderResponse[i].qboInvoicePaidTimeStamp,
                                    orderResponse[i].amtOfInvoicePaid,
                                    orderResponse[i].qboInvoicePaid,
                                    orderResponse[i].qboInvoicePartiallyPaidTimeStamp,
                                    orderResponse[i].orderTotalCoGs,
                                    orderResponse[i].invoiceStatus,
                                    orderResponse[i].iAddress,
                                    orderResponse[i].iCity,
                                    orderResponse[i].iState,
                                    orderResponse[i].iPostalCode,
                                    orderResponse[i].iCountry
                                ))
                            }
                        }
                    };



                    // this.orderEdited = {};
                    // console.log(this.orderEdited);
                    // console.log(this.orders);
                    this.showOrders = orderResponse;

                    this.orders.sort(function (a, b) {
                        return b.orderNumber - a.orderNumber;
                    })
                    const tempSet = new Set();
                    for (const i in this.orders) {

                        tempSet.add(this.orders[i].sIndustry)
                    }
                    const tempSetStatus = new Set();
                    for (const i in this.orders) {
                        tempSetStatus.add(this.orders[i].status)
                    }
                    this.statusList = tempSetStatus
                    this.industryList = tempSet
                    console.log(this.industryList)

                    // console.log('HEY HEY HEY')


                },
                error => alert(error),
                () => console.log('Displaying Order by ID')
                );
        } else if (this.userLevel < 5) {

            const userEmail = this.auth.email;

            this.ordersService.displayDistributorOrders(userEmail)
                .subscribe(
                data => {

                    const distributorOrders = data;

                    for (const i in distributorOrders) {
                        if (distributorOrders[i]) {

                            this.orders.push(new Order(
                                distributorOrders[i].orderNumber,
                                distributorOrders[i].total,
                                distributorOrders[i].invoiceTotal,
                                distributorOrders[i].tax,
                                distributorOrders[i].finalTotal,
                                distributorOrders[i].shippingCost,
                                distributorOrders[i].invoiceFinalTotal,
                                distributorOrders[i].invoiceTax,
                                distributorOrders[i].invoiceShippingCost,
                                distributorOrders[i].lineItems,
                                distributorOrders[i].sFirstName,
                                distributorOrders[i].sLastName,
                                distributorOrders[i].sCompany,
                                distributorOrders[i].sAddress1,
                                distributorOrders[i].sCity,
                                distributorOrders[i].sState,
                                distributorOrders[i].sZip,
                                distributorOrders[i].sCountry,
                                distributorOrders[i].bFirstName,
                                distributorOrders[i].bLastName,
                                distributorOrders[i].bCompany,
                                distributorOrders[i].bAddress1,
                                distributorOrders[i].bCity,
                                distributorOrders[i].bState,
                                distributorOrders[i].bZip,
                                distributorOrders[i].bCountry,
                                distributorOrders[i].sEmail,
                                distributorOrders[i].sPhone,
                                distributorOrders[i].bEmail,
                                distributorOrders[i].bPhone,
                                distributorOrders[i].sLoadingDock,
                                distributorOrders[i].sDeliveryHours,
                                distributorOrders[i].sMiscNotes,
                                distributorOrders[i].sDeadLine,
                                distributorOrders[i].sIndustry,
                                distributorOrders[i].salesName,
                                distributorOrders[i].wbQuoteURL,
                                distributorOrders[i].wbFinalURL,
                                distributorOrders[i].erp2qboinvoice,
                                distributorOrders[i].erp2qbocustomer,
                                distributorOrders[i].status,
                                distributorOrders[i].paymentTerms,
                                distributorOrders[i].cin7SalesOrderShipped,
                                distributorOrders[i].qboInvoiceSent,
                                distributorOrders[i].cin7SalesOrderShippedTimeStamp,
                                distributorOrders[i].qboInvoiceSentTimeStamp,
                                distributorOrders[i].salesEmail,
                                distributorOrders[i].qboInvoicePartiallyPaid,
                                distributorOrders[i].qboInvoicePaidTimeStamp,
                                distributorOrders[i].amtOfInvoicePaid,
                                distributorOrders[i].qboInvoicePaid,
                                distributorOrders[i].qboInvoicePartiallyPaidTimeStamp,
                                distributorOrders[i].orderTotalCoGs,
                                distributorOrders[i].invoiceStatus,
                                distributorOrders[i].iAddress,
                                distributorOrders[i].iCity,
                                distributorOrders[i].iState,
                                distributorOrders[i].iPostalCode,
                                distributorOrders[i].iCountry
                            ))



                        }
                    }

                    this.showOrders = distributorOrders;

                    this.orders.sort(function (a, b) {
                        return b.orderNumber - a.orderNumber;
                    })

                    const filter = this.orders.filter(orders => orders.status !== 'completed')

                    this.orders = filter


                },
                error => alert(error),
                () => console.log('Displaying Order by ID')
                );
        }
    }

    showFilterObject() {
        this.showFilterOptions = true;
    }

    hideFilterObject() {
        this.showFilterOptions = false;
    }



    filter(filteringObject) {
        console.log(filteringObject);
        this.ordersService.displayFilteredOrders(filteringObject)
            .subscribe(
            data => {

                const newFilteredOrders = data;
                this.orders = [];

                for (const i in newFilteredOrders) {
                    if (newFilteredOrders[i]) {
                        this.orders.push(new Order(
                            newFilteredOrders[i].orderNumber,
                            newFilteredOrders[i].total,
                            newFilteredOrders[i].invoiceTotal,
                            newFilteredOrders[i].tax,
                            newFilteredOrders[i].finalTotal,
                            newFilteredOrders[i].shippingCost,
                            newFilteredOrders[i].invoiceFinalTotal,
                            newFilteredOrders[i].invoiceTax,
                            newFilteredOrders[i].invoiceShippingCost,
                            newFilteredOrders[i].lineItems,
                            newFilteredOrders[i].sFirstName,
                            newFilteredOrders[i].sLastName,
                            newFilteredOrders[i].sCompany,
                            newFilteredOrders[i].sAddress1,
                            newFilteredOrders[i].sCity,
                            newFilteredOrders[i].sState,
                            newFilteredOrders[i].sZip,
                            newFilteredOrders[i].sCountry,
                            newFilteredOrders[i].bFirstName,
                            newFilteredOrders[i].bLastName,
                            newFilteredOrders[i].bCompany,
                            newFilteredOrders[i].bAddress1,
                            newFilteredOrders[i].bCity,
                            newFilteredOrders[i].bState,
                            newFilteredOrders[i].bZip,
                            newFilteredOrders[i].bCountry,
                            newFilteredOrders[i].sEmail,
                            newFilteredOrders[i].sPhone,
                            newFilteredOrders[i].bEmail,
                            newFilteredOrders[i].bPhone,
                            newFilteredOrders[i].sLoadingDock,
                            newFilteredOrders[i].sDeliveryHours,
                            newFilteredOrders[i].sMiscNotes,
                            newFilteredOrders[i].sDeadLine,
                            newFilteredOrders[i].sIndustry,
                            newFilteredOrders[i].salesName,
                            newFilteredOrders[i].wbQuoteURL,
                            newFilteredOrders[i].wbFinalURL,
                            newFilteredOrders[i].erp2qboinvoice,
                            newFilteredOrders[i].erp2qbocustomer,
                            newFilteredOrders[i].status,
                            newFilteredOrders[i].paymentTerms,
                            newFilteredOrders[i].cin7SalesOrderShipped,
                            newFilteredOrders[i].qboInvoiceSent,
                            newFilteredOrders[i].cin7SalesOrderShippedTimeStamp,
                            newFilteredOrders[i].qboInvoiceSentTimeStamp,
                            newFilteredOrders[i].salesEmail,
                            newFilteredOrders[i].qboInvoicePartiallyPaid,
                            newFilteredOrders[i].qboInvoicePaidTimeStamp,
                            newFilteredOrders[i].amtOfInvoicePaid,
                            newFilteredOrders[i].qboInvoicePaid,
                            newFilteredOrders[i].qboInvoicePartiallyPaidTimeStamp,
                            newFilteredOrders[i].orderTotalCoGs,
                            newFilteredOrders[i].invoiceStatus,
                            newFilteredOrders[i].iAddress,
                            newFilteredOrders[i].iCity,
                            newFilteredOrders[i].iState,
                            newFilteredOrders[i].iPostalCode,
                            newFilteredOrders[i].iCountry
                        ))
                    }
                }

                this.showOrders = [];
                this.showOrders = data;
                console.log(data);
            },
            error => {
                console.log(error);
            },
            () => {
                console.log('displaying filtered orders')
            }
            )

    }

    onGoToOrderDetails(url) {
        this.location.go('/order-details/' + url);
        this.location.forward();
    }

    createNewOrder() {

        this.ordersService.createNewOrder()
            .subscribe(
            newOrder => {
                this.data = this.router.navigate(['/order-details/' + newOrder.orderNumber]);
            },
            error => {
                this.errorMsg = 'Could not create new order';
            }
            )
    }

    // display order function
    onFindOrderById() {
        this.displayEditButton = true;
        this.ordersService.displayOrders()
            .subscribe(
            data => {
                const orderResponse = data;
                this.orders = [];
                for (const i in orderResponse) {
                    if (orderResponse[i]) {
                        this.orders.push(new Order(
                            orderResponse[i].orderNumber,
                            orderResponse[i].total,
                            orderResponse[i].invoiceTotal,
                            orderResponse[i].tax,
                            orderResponse[i].finalTotal,
                            orderResponse[i].shippingCost,
                            orderResponse[i].invoiceFinalTotal,
                            orderResponse[i].invoiceTax,
                            orderResponse[i].invoiceShippingCost,
                            orderResponse[i].lineItems,
                            orderResponse[i].sFirstName,
                            orderResponse[i].sLastName,
                            orderResponse[i].sCompany,
                            orderResponse[i].sAddress1,
                            orderResponse[i].sCity,
                            orderResponse[i].sState,
                            orderResponse[i].sZip,
                            orderResponse[i].sCountry,
                            orderResponse[i].bFirstName,
                            orderResponse[i].bLastName,
                            orderResponse[i].bCompany,
                            orderResponse[i].bAddress1,
                            orderResponse[i].bCity,
                            orderResponse[i].bState,
                            orderResponse[i].bZip,
                            orderResponse[i].bCountry,
                            orderResponse[i].sEmail,
                            orderResponse[i].sPhone,
                            orderResponse[i].bEmail,
                            orderResponse[i].bPhone,
                            orderResponse[i].sLoadingDock,
                            orderResponse[i].sDeliveryHours,
                            orderResponse[i].sMiscNotes,
                            orderResponse[i].sDeadLine,
                            orderResponse[i].sIndustry,
                            orderResponse[i].salesName,
                            orderResponse[i].wbQuoteURL,
                            orderResponse[i].wbFinalURL,
                            orderResponse[i].erp2qboinvoice,
                            orderResponse[i].erp2qbocustomer,
                            orderResponse[i].status,
                            orderResponse[i].paymentTerms,
                            orderResponse[i].cin7SalesOrderShipped,
                            orderResponse[i].qboInvoiceSent,
                            orderResponse[i].cin7SalesOrderShippedTimeStamp,
                            orderResponse[i].qboInvoiceSentTimeStamp,
                            orderResponse[i].salesEmail,
                            orderResponse[i].qboInvoicePartiallyPaid,
                            orderResponse[i].qboInvoicePaidTimeStamp,
                            orderResponse[i].amtOfInvoicePaid,
                            orderResponse[i].qboInvoicePaid,
                            orderResponse[i].qboInvoicePartiallyPaidTimeStamp,
                            orderResponse[i].orderTotalCoGs,
                            orderResponse[i].invoiceStatus,
                            orderResponse[i].iAddress,
                            orderResponse[i].iCity,
                            orderResponse[i].iState,
                            orderResponse[i].iPostalCode,
                            orderResponse[i].iCountry
                        ))
                        // for (let z in orderResponse[i].line_items){
                        //   this.orders.push(new Order.line_items(
                        //     orderResponse[i].line_items[z]
                        //   ))
                        // }
                    }
                };
                this.showOrders = orderResponse;
            },
            error => alert(error),
            () => console.log('Displaying Order by ID')
            );
    }

    consoleIt(individualOrder, lineitems) {
        if (individualOrder.orderNumber === '3012') {
            this.editable = true;

        } else {
            this.editable = false;
        }
        this.orderEdited.orderNumber = individualOrder.orderNumber;
        this.orderEdited.total = individualOrder.total;
        this.orderEdited.finalTotal = individualOrder.finalTotal;
        this.orderEdited.total_tax = individualOrder.tax;
        this.orderEdited.line_items.id = lineitems.bases;
        this.orderEdited.line_items.name = lineitems.skins;
        this.orderEdited.line_items.productid = lineitems.sku;
        this.orderEdited.line_items.quantity = lineitems.quantity;
        this.orderEdited.line_items.total = lineitems.total;
        this.orderEdited.line_items.total_tax = lineitems.preFabType;

        this.orderEdited.sfirst_name = individualOrder.sFirstName;
        this.orderEdited.slast_name = individualOrder.sLastName;
        this.orderEdited.scompany = individualOrder.sCompany;
        this.orderEdited.saddress_1 = individualOrder.sAddress1;
        this.orderEdited.scity = individualOrder.sCity;
        this.orderEdited.sstate = individualOrder.sState;
        this.orderEdited.spostcode = individualOrder.sZip;
        this.orderEdited.scountry = individualOrder.sCountry;

        this.orderEdited.bfirst_name = individualOrder.bFirstName;
        this.orderEdited.blast_name = individualOrder.bLastName;
        this.orderEdited.bcompany = individualOrder.bCompany;
        this.orderEdited.baddress_1 = individualOrder.bAddress1;
        this.orderEdited.bcity = individualOrder.bCity;
        this.orderEdited.bstate = individualOrder.bState;
        this.orderEdited.bpostcode = individualOrder.bZip;
        this.orderEdited.bcountry = individualOrder.bCountry;
        this.orderEdited.bemail = individualOrder.bEmail;
        this.orderEdited.bphone = individualOrder.bPhone;
        this.orderEdited.sloadingdock = individualOrder.sLoadingDock;
        this.orderEdited.sDeliveryHours = individualOrder.sDeliveryHours;
        this.orderEdited.cin7SalesOrderShipped = individualOrder[0].cin7SalesOrderShipped;
        this.orderEdited.qboInvoiceSent = individualOrder[0].qboInvoiceSent;
        this.orderEdited.cin7SalesOrderShippedTimeStamp = individualOrder[0].cin7SalesOrderShippedTimeStamp;
        this.orderEdited.qboInvoiceSentTimeStamp = individualOrder[0].qboInvoiceSentTimeStamp;
        this.orderEdited.orderTotalCoGs = individualOrder[0].orderTotalCoGs;
        this.orderEdited.invoiceStatus = individualOrder[0].invoiceStatus;



        this.orderDetail = 'Id is: ' + individualOrder.id + ' and Status is: ' + individualOrder.status;

    }







    // onEditOrder() {
    //   this.editOrder = true;

    // }
    onUpdateOrder() {
        this.submitEditedOrder = true;
    }

    // edit order function
    onSubmitEditedOrder(order: any) {
        if (!order) {
            return;
        }
        this.ordersService.updateOrder(order)
            .subscribe(
            editedOrder => this.data = 'You have successfully updated your order!',
            error => this.errorMsg = 'There was an error updating your order. Please try again.'
            )

    }


    sort(property) {

        this.isDesc = !this.isDesc;
        this.column = property;
        this.direction = this.isDesc ? -1 : 1;
    };


    filterOrders(orderFilter) {
        if (orderFilter.length >= 3) {
            this.ordersService.filterOrders(orderFilter)
                .subscribe(
                filteredOrders => {
                    console.log(filteredOrders)
                },
                error => {
                    console.log('there was an issue filtering the orders')
                }
                )
        }
    }




}
