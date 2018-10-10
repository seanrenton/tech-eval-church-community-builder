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
import { Order } from '../order-display/order';
import { Contact } from '../order-display/contact';
import { Users } from '../order-display/users';
import { LineItems } from '../order-display/lineitems';
import { WallBuilderPlans } from '../order-display/wallbuilderplans';
import { WallBuilderPlansForDistributors } from '../order-display/wallbuilderplansfordistributors';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { OrdersServiceService } from '../../services/orders-service.service';
import { AuthService } from '../../services/auth.service';
import { CurrencyPipe } from '@angular/common';
import { FlashMessagesService } from 'ngx-flash-messages';
import * as pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { setTimeout } from 'timers';
pdfMake.vfs = pdfFonts.pdfMake.vfs;




@Component({
    selector: 'app-edit-order',
    templateUrl: './edit-order.component.html',
    styleUrls: ['./edit-order.component.css']
})
export class EditOrderComponent implements OnInit {


    public contactTriggeringEventEmitter = new EventEmitter<boolean>();
    public wallbuilderTriggeringEventEmitter = new EventEmitter<boolean>();
    public wallbuilderTriggeringEventEmitterForDistributors = new EventEmitter<boolean>()
    public productTriggeringEventEmitter = new EventEmitter<boolean>();
    public closedwonTriggeringEventEmitter = new EventEmitter<boolean>();

    tempUser: any;
    errorCheck = false;
    hasTaxBeenCalculated = false;
    lastUpdateTimeStamp: any;
    editOrder = false;
    testPassUp = 'HEY!';
    order: Order;
    unitedstatesshipping = false;
    canadashipping = false;
    unitedstatesbilling = false;
    canadabilling = false;
    billingtoo = false;
    taxJarTax: any;
    lineitemtotal = [];
    data: any;
    dataMessage = false;
    errorMsg: any;
    currentTotal: number;
    finalTotal: any;
    addProductFlag: boolean;
    addWallBuilderPlanFlag: boolean;
    addSalesForceAccountFlag: boolean;
    addSalesForceClosedWonFlag: boolean;
    subtotal: any;
    invoiceSubtotal: any;
    invoicing = false;
    user: any = [];
    userLevel: any;
    distributorEmail: any;
    goingGreen: any;
    activeIndex: any;
    spinner: Boolean = false;
    // automaticFireCheck: Boolean = false;

    newLineItem: any = {
        bases: '',
        skins: '',
        lengths: '',
        qty: Number,
        line_total: Number,
        sku: '',
        preFabType: '',
        unitPrice: Number,
        discountPrice: Number,
        name: '',
        description: String
    }
    newInvoiceLineItem: any = {
        bases: '',
        skins: '',
        lengths: '',
        qty: Number,
        line_total: Number,
        sku: '',
        preFabType: '',
        unitPrice: Number,
        discountPrice: Number,
        name: '',
        description: String
    }

    wallBuilderPlan: any = {
        id: Number,
        planName: '',
        total: ''
    }

    wallBuilderPlanForDistributors: any = {
        id: Number,
        planName: '',
        total: '',
        distributorEmail: this.distributorEmail
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
                description: String
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
        orderCreatedTimeStamp: String,
        qboInvoiceSent: Boolean,
        qboInvoicePaid: Boolean,
        cin7SalesOrderShippedTimeStamp: String,
        qboInvoiceSentTimeStamp: String,
        qboInvoicePaidTimeStamp: String,
        amtOfInvoicePaid: Number,
        deliveryTradeConvention: '',
        sInsideDelivery: '',
        invoiceStatus: String,
        automaticFire: true,
        QBOInvoiceReceiver: 'Sales Person',
        operationsApproved: Boolean,
        needsProduction: true
    }

    @Input('passedWall') passedWall: Object;

    @Input('testPass') testPass: string;

    constructor(
        private ordersService: OrdersServiceService,
        private auth: AuthService,
        private route: ActivatedRoute,
        private location: Location,
        private router: Router,
        private flashMessage: FlashMessagesService) { }

    contacts: Observable<Contact[]>;
    newLineItems: Observable<LineItems[]>;
    newLineItemsForDistributors: Observable<LineItems[]>;
    WallBuilderPlans: Observable<WallBuilderPlans[]>;
    WallBuilderPlansForDistributors: Observable<WallBuilderPlansForDistributors[]>;
    private searchTerms = new Subject<any>();
    private searchTermsProdId = new Subject<any>();
    private searchTermsProdIdForDistributors = new Subject<any>();
    private searchTermsWallBuilderPlanName = new Subject<any>();
    private searchTermsWallBuilderPlanNameForDistributors = new Subject<any>();
    private searchTermsClosedWon = new Subject<any>();


    round(number, precision) {
        const factor = Math.pow(10, precision);

        const currentNumber = number * factor;

        const roundedTempNumber = Math.round(currentNumber);

        const finalRoundedTotal = roundedTempNumber / factor;

        return finalRoundedTotal;


    };


    search(term: string): void {
        console.log('In order details function search')
        if (term.length > 2) {
            this.searchTerms.next(term);
        }
    }

    searchNewProductId(term: string): void {
        console.log('In order details function searchNewProductId')
        if (term.length > 2) {
            this.searchTermsProdId.next(term);

        }
        // add error handling here warning if search is less than 3
    }

    searchNewProductIdForDistributors(term: string): void {
        console.log('In order details function searchNewProductId')
        if (term.length > 2) {
            this.searchTermsProdIdForDistributors.next(term);
        }
        // add error handling here warning if search is less than 3
    }

    searchNewWallBuilderName(term: string): void {
        console.log('In order details function searchNewWallBuilderName')
        if (term.length > 2) {
            this.searchTermsWallBuilderPlanName.next(term);
        }
        // add error handling here warning if search is less than 3
    }

    searchNewWallBuilderNameForDistributors(term: string): void {
        console.log('In order details function searchNewWallBuilderNameForDistributors')
        if (term.length > 2) {
            this.searchTermsWallBuilderPlanNameForDistributors.next(term);
        }
        // add error handling here warning if search is less than 3
    }

    searchClosedWonQuotes(term: string): void {
        console.log('In order details function searchClosedWonQuotes')
        if (term.length > 2) {
            this.searchTermsClosedWon.next(term);
        }
        // add error handling here warning if search is less than 3
    }





    ngOnInit(): void {

        this.userLevel = this.auth.userLevel;
        this.distributorEmail = this.auth.email;




        this.contacts = this.searchTerms
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time the term changes
                // return the http search observable
                ? this.ordersService.search(term)
                // or the observable of empty heroes if there was no search term
                : Observable.of<Contact[]>([]))
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<Contact[]>([]);
            });

        this.newLineItems = this.searchTermsProdId
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time the term changes
                // return the http search observable
                ? this.ordersService.searchProdId(term)
                // or the observable of empty heroes if there was no search term
                : Observable.of<LineItems[]>([]))
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<LineItems[]>([]);
            });

        this.newLineItemsForDistributors = this.searchTermsProdIdForDistributors
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time the term changes
                // return the http search observable
                ? this.ordersService.searchProdIdForDistributors(term)
                // or the observable of empty heroes if there was no search term
                : Observable.of<LineItems[]>([]))
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<LineItems[]>([]);
            });


        this.wallBuilderPlan = this.searchTermsWallBuilderPlanName
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time the term changes
                // return the http search observable

                ? this.ordersService.searchWallBuilderName(term)
                // or the observable of empty heroes if there was no search term
                : Observable.of<WallBuilderPlans[]>([]))
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<WallBuilderPlans[]>([]);
            });

        this.wallBuilderPlanForDistributors = this.searchTermsWallBuilderPlanNameForDistributors
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new observable each time the term changes
                // return the http search observable
                ? this.ordersService.searchWallBuilderNameForDistributors(this.distributorEmail, term)
                // or the observable of empty heroes if there was no search term
                : Observable.of<WallBuilderPlans[]>([]))
            .catch(error => {
                // TODO: add real error handling
                console.log(error);
                return Observable.of<WallBuilderPlans[]>([]);
            });

       
        // // const roundedTotal = this.round(order[0].finalTotal, 2)
        // this.orderEdited.finalTotal = this.passedWall[0].finalTotal;
        // this.orderEdited.orderNumber = this.passedWall[0].orderNumber;
        // this.orderEdited.tax = this.passedWall[0].tax;
        // this.orderEdited.lineItems = this.passedWall[0].lineItems;
        // console.log(this.passedWall[0].lineItems);
        // this.orderEdited.total = this.passedWall[0].total;
        // // this.orderEdited.total = roundedTotal;
        // this.orderEdited.sFirstName = this.passedWall[0].sFirstName;
        // this.orderEdited.sLastName = this.passedWall[0].sLastName;
        // this.orderEdited.sCompany = this.passedWall[0].sCompany;
        // this.orderEdited.sAddress1 = this.passedWall[0].sAddress1;
        // this.orderEdited.sCity = this.passedWall[0].sCity;
        // this.orderEdited.sState = this.passedWall[0].sState;
        // this.orderEdited.sZip = this.passedWall[0].sZip;
        // this.orderEdited.sCountry = this.passedWall[0].sCountry;
        // this.orderEdited.bFirstName = this.passedWall[0].bFirstName;
        // this.orderEdited.bLastName = this.passedWall[0].bLastName;
        // this.orderEdited.bCompany = this.passedWall[0].bCompany;
        // this.orderEdited.bAddress1 = this.passedWall[0].bAddress1;
        // this.orderEdited.bEmail = this.passedWall[0].bEmail;
        // this.orderEdited.bPhone = this.passedWall[0].bPhone;
        // this.orderEdited.bCity = this.passedWall[0].bCity;
        // this.orderEdited.bState = this.passedWall[0].bState;
        // this.orderEdited.bZip = this.passedWall[0].bZip;
        // this.orderEdited.bCountry = this.passedWall[0].bCountry;
        // this.orderEdited.sLoadingDock = this.passedWall[0].sLoadingDock;
        // this.orderEdited.sDeliveryHours = this.passedWall[0].sDeliveryHours;
        // this.orderEdited.shippingCost = this.passedWall[0].shippingCost;



        this.route.paramMap
            .switchMap((params: ParamMap) => this.ordersService.helloWorld(+params.get('orderNumber')))
            .subscribe(order => {
                this.editOrder = true;

                // const roundedTotal = this.round(order[0].finalTotal, 2)
                this.orderEdited.sIndustry = order[0].sIndustry;
                this.orderEdited.sMiscNotes = order[0].sMiscNotes;
                this.orderEdited.finalTotal = order[0].finalTotal;
                this.orderEdited.invoiceFinalTotal = order[0].invoiceFinalTotal;
                this.orderEdited.invoiceTax = order[0].invoiceTax;
                this.orderEdited.invoiceShippingCost = order[0].invoiceShippingCost;
                this.orderEdited.status = order[0].status;
                this.orderEdited.orderNumber = order[0].orderNumber;
                this.orderEdited.tax = order[0].tax;
                this.orderEdited.lineItems = order[0].lineItems;
                this.orderEdited.total = order[0].total;
                this.orderEdited.invoiceTotal = order[0].invoiceTotal;
                // this.orderEdited.total = roundedTotal;
                this.orderEdited.sFirstName = order[0].sFirstName;
                this.orderEdited.sLastName = order[0].sLastName;
                this.orderEdited.sCompany = order[0].sCompany;
                this.orderEdited.sPhone = order[0].sPhone;
                this.orderEdited.sEmail = order[0].sEmail;
                this.orderEdited.sAddress1 = order[0].sAddress1;
                this.orderEdited.sCity = order[0].sCity;
                this.orderEdited.sState = order[0].sState;
                this.orderEdited.sZip = order[0].sZip;
                this.orderEdited.sCountry = order[0].sCountry;
                this.orderEdited.bFirstName = order[0].bFirstName;
                this.orderEdited.bLastName = order[0].bLastName;
                this.orderEdited.bCompany = order[0].bCompany;
                this.orderEdited.bAddress1 = order[0].bAddress1;
                this.orderEdited.bEmail = order[0].bEmail;
                this.orderEdited.bPhone = order[0].bPhone;
                this.orderEdited.bCity = order[0].bCity;
                this.orderEdited.bState = order[0].bState;
                this.orderEdited.bZip = order[0].bZip;
                this.orderEdited.bCountry = order[0].bCountry;
                this.orderEdited.sLoadingDock = order[0].sLoadingDock;
                this.orderEdited.sDeliveryHours = order[0].sDeliveryHours;
                this.orderEdited.shippingCost = order[0].shippingCost;
                this.orderEdited.sDeadLine = order[0].sDeadLine;
                this.orderEdited.salesName = order[0].salesName;
                this.orderEdited.salesEmail = order[0].salesEmail;
                this.orderEdited.wbQuoteURL = order[0].wbQuoteURL;
                this.orderEdited.wbFinalURL = order[0].wbFinalURL;
                this.orderEdited.erp2qboinvoice = order[0].erp2qboinvoice;
                this.orderEdited.erp2qbocustomer = order[0].erp2qbocustomer;
                this.orderEdited.paymentTerms = order[0].paymentTerms;
                this.orderEdited.cin7SalesOrderShipped = order[0].cin7SalesOrderShipped;
                this.orderEdited.qboInvoiceSent = order[0].qboInvoiceSent;
                this.orderEdited.cin7SalesOrderShippedTimeStamp = order[0].cin7SalesOrderShippedTimeStamp;
                this.orderEdited.qboInvoiceSentTimeStamp = order[0].qboInvoiceSentTimeStamp;
                this.orderEdited.qboInvoicePaid = order[0].qboInvoicePaid;
                this.orderEdited.qboInvoicePaidTimeStamp = order[0].qboInvoicePaidTimeStamp;
                this.orderEdited.amtOfInvoicePaid = order[0].amtOfInvoicePaid;
                this.orderEdited.orderTotalCoGs = order[0].orderTotalCoGs;
                this.orderEdited.orderCreatedTimeStamp = order[0].orderCreatedTimeStamp;
                this.orderEdited.sPalletJack = order[0].sPalletJack;
                this.orderEdited.sInsideDelivery = order[0].sInsideDelivery;
                this.orderEdited.deliveryTradeConvention = order[0].deliveryTradeConvention;
                this.orderEdited.invoiceStatus = order[0].invoiceStatus;
                this.orderEdited.automaticFire = order[0].automaticFire;
                this.orderEdited.QBOInvoiceReceiver = 'Sales Person';
                this.orderEdited.operationsApproved = order[0].operationsApproved;
                this.orderEdited.needsProduction = true;
                // this.orderEdited.billingtoo.value = order[0].billingtoo;

                // console.log('logging order edited total post this assignments')
                // console.log(this.orderEdited.total);



                // checking for discount price, if none replacing with default prices
                for (const i in this.orderEdited.lineItems) {
                    if (this.orderEdited.lineItems[i]) {

                        // const discountPrice = temptotal / qty;
                        if (this.orderEdited.lineItems[i].discountPrice === null) {
                            this.orderEdited.lineItems[i].discountPrice = this.orderEdited.lineItems[i].unitPrice
                        }
                    }
                }

                if (!this.orderEdited.billingtoo) {
                    this.orderEdited.billingtoo = null;
                }

                if (!this.orderEdited.operationsApproved) {
                    this.orderEdited.operationsApproved = null;
                }

                if (this.userLevel === 3) {
                    this.orderEdited.tax = 0;
                    this.orderEdited.invoiceTax = 0;
                    this.hasTaxBeenCalculated = true;
                }

                if (this.auth.userLevel < 10) {
                    this.orderEdited.salesEmail = this.auth.email;
                    this.orderEdited.salesName = this.auth.name;
                }

                if (!this.orderEdited.salesName) {
                    this.orderEdited.salesName = this.auth.name;
                } else if (this.orderEdited.salesName) {
                    this.orderEdited.salesName = order[0].salesName;
                }

                this.isUnitedStatesBilling();
                this.isUnitedStatesShipping();
                this.updateTotals();
                this.updateTotalsClosedWonQuote();
                this.pullUsersList();
            })

        // for(const i in this.orderEdited.lineItems){
        //   console.log('Test')
        //   console.log(this.orderEdited.lineItems[i].sku)
        //   this.ordersService.getProduct(this.orderEdited.lineItems[i].sku)
        //   .subscribe(
        //     Order => {this.orderEdited.lineItems[i].line_total = Order[0].finalTotal; console.log(Order);},
        //     error => this.errorMsg = 'There Was An Error Updating Your Order.'
        //   )
        // }




        //   function updateListPrices() {
        //   for(const i in this.orderEdited.lineItems){
        //     console.log('Test')
        //     console.log(this.orderEdited.lineItems[i].id)
        //     this.ordersService.getProduct(this.orderEdited.lineItems[i].id)
        //     .subscribe(
        //       Order => {this.data = 'Your Order has been Updated!'; console.log(Order);},
        //       error => this.errorMsg = 'There Was An Error Updating Your Order.'
        //     )
        //   }
        // }

    }

  

    pullUsersList() {
        this.ordersService.pullUsersList()
            .subscribe(
                data => {
                    // console.log(data[i].name)
                    this.user = data
                },
                err => {
                    console.log(err);
                }
            )
    }

    generatePDFInvoiceForDistributor(orderEdited) {
        const test: any = {
            content: [
                {
                    image: 'data:image/png;base64,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',
                    width: 250
                },
                { text: 'Quote For Order Number: ' + orderEdited.orderNumber, style: 'header', margin: 5, alignment: 'right' },
                { text: 'Created Date: ' + orderEdited.orderCreatedTimeStamp, style: 'header', margin: 5, alignment: 'right' },
                { text: 'Prepared By: ' + orderEdited.salesName, style: 'header', margin: 5, alignment: 'right' },
                {
                    table: {
                        headerRows: 1,
                        alignment: 'left',
                        background: '#080808',
                        margin: 10,
                        widths: [150, 90, 70, 70, 90],
                        body: [
                            ['Product', 'Quantity', 'Unit Price', 'Distributor Price', 'Total Price'],
                        ]
                    }
                },
                { text: 'Subtotal: $' + this.invoiceSubtotal, decoration: 'underline', bold: true, margin: 5, alignment: 'left' },
                { text: 'Shipping: $' + orderEdited.invoiceShippingCost, decoration: 'underline', bold: true, margin: 5, alignment: 'left' },
                { text: 'Tax: $' + orderEdited.invoiceTax, decoration: 'underline', bold: true, margin: 5, alignment: 'left' },
                { text: 'Grand Total: $' + orderEdited.invoiceFinalTotal, decoration: 'underline', bold: true, margin: 5, fontSize: 15, alignment: 'left' },
                { text: 'Terms of Sale', fontSize: 15, style: 'header', margin: 10, alignment: 'left' },
                { text: 'Emagispace, Inc., STANDARD TERMS AND CONDITIONS As of 08-09-2016', fontSize: 15, bold: true, margin: 10, alignment: 'center' },
                { text: 'The prices shown are F.O.B. origin. Customer shall pay all shipping, insurance, license fees and similar charges which shall be added to purchase prices. Title and risk of loss transfer upon tender of shipment to the carrier, and Customer bears all risk of loss in transit. COD shipments are not permitted. Prices are exclusive of federal, state and local sales, use, excise, and similar taxes. Customer is responsible for payment of all applicable taxes, or for providing a valid sales tax exemption certificate. When placing an order, customer shall indicate whether the products are tax exempt.', fontSize: 10, style: ['quote', 'small'], italics: true, alignment: 'center' },
                { text: 'For a complete view of all terms please see: https://www.emagispace.com/terms', link: 'https://www.emagispace.com/terms', color: 'blue', style: ['quote', 'small'], margin: 10, italics: true, alignment: 'center' },
                // { footer: 'Emagispace 6781 Nautique Cir. Larkspur, CO 80018 (844) 949-2557 emagispace.com', alignment: 'center', fontSize: 10}


            ],
            footer: {
                columns: [
                    { text: 'Emagispace 6781 Nautique Cir. Larkspur, CO 80018 (844) 949-2557 emagispace.com', alignment: 'center' }
                ]
            },
            // {
            //   text: 'Invoice For Order: ' + orderEdited.orderNumber
            // },


        }
        for (const i in orderEdited.lineItems) {
            if (orderEdited.lineItems[i]) {
                const distributorPricing = this.round(this.orderEdited.lineItems[i].discountPrice * .65, 2)
                const products = [this.orderEdited.lineItems[i].name, this.orderEdited.lineItems[i].qty, '$' + this.orderEdited.lineItems[i].discountPrice, '$' + distributorPricing, '$' + this.orderEdited.lineItems[i].total];

                // for()
                test.content[4].table.body.push(products);
            }
        }



        // const testString = JSON.stringify(testJson)



        pdfMake.createPdf(test).download('test.pdf')
    }

    settingActiveIndex(i) {
        this.activeIndex = i;

    }


    searchName() {
        const searchOn = this.orderEdited.sfirst_name;
        if (searchOn.length >= 3) {
            this.ordersService.looseSearchContacts(searchOn)
                .subscribe(
                    data => { console.log(data) }
                )
        }

    }

    errorCheckFunction() {
        this.errorCheck = true;

    }


    populateFromContact(contact) {

        if (!contact.Phone) {
            contact.Phone = contact.MobilePhone;
        }

        if (!contact) {
            this.orderEdited.sFirstName = this.orderEdited.sFirstName;
            this.orderEdited.sLastName = this.orderEdited.sLastName;
            this.orderEdited.sPhone = this.orderEdited.sPhone;
            this.orderEdited.sEmail = this.orderEdited.sEmail;
            this.orderEdited.sAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.sCity = this.orderEdited.sCity;
            this.orderEdited.sZip = this.orderEdited.sZip;
            this.orderEdited.sCountry = this.orderEdited.sCountry;
            this.orderEdited.sState = this.orderEdited.sState;
            this.orderEdited.bFirstName = this.orderEdited.bFirstName;
            this.orderEdited.bLastName = this.orderEdited.bLastName;
            this.orderEdited.bAddress1 = this.orderEdited.bAddress1;
            this.orderEdited.bEmail = this.orderEdited.bEmail;
            this.orderEdited.bPhone = this.orderEdited.bPhone;
            this.orderEdited.bCity = this.orderEdited.bCity;
            this.orderEdited.bState = this.orderEdited.bState;
            this.orderEdited.bZip = this.orderEdited.bZip;
            this.orderEdited.bcountry = this.orderEdited.bcountry;

        }
        this.orderEdited.sFirstName = contact.Name;
        this.orderEdited.sLastName = contact.Name;
        this.orderEdited.sPhone = contact.Phone;
        this.orderEdited.sEmail = contact.Email;
        this.orderEdited.sAddress1 = contact.Address1;
        this.orderEdited.sCity = contact.City;
        this.orderEdited.sState = contact.State;
        this.orderEdited.sZip = contact.Zip;
        this.orderEdited.sCountry = contact.Country;
        this.orderEdited.bFirstName = contact.Name;
        this.orderEdited.bLastName = contact.Name;
        this.orderEdited.bAddress1 = contact.Address1;
        this.orderEdited.bEmail = contact.Email;
        this.orderEdited.bPhone = contact.Phone;
        this.orderEdited.bCity = contact.City;
        this.orderEdited.bState = contact.State;
        this.orderEdited.bZip = contact.Zip;
        this.orderEdited.bCountry = contact.Country;
    }

    populateFromNewLineItem(LineItem) {


        const LineItemToAdd = {
            sku: LineItem.SKU,
            name: LineItem.ItemName,
            unitPrice: LineItem.CustomerPrice,
            discountPrice: LineItem.CustomerPrice,
            qty: 1

        }

        const checkExistence = this.inArrayCheck(LineItemToAdd);

        if (checkExistence === true) {
            this.addToSku(LineItemToAdd);
        } else {
            this.orderEdited.lineItems.push(LineItemToAdd);
        }
    }





    populateFromNewLineItemForDistributors(LineItem) {


        const LineItemToAdd = {
            sku: LineItem.SKU,
            name: LineItem.ItemName,
            unitPrice: LineItem.CustomerPrice,
            discountPrice: LineItem.CustomerPrice,
            qty: 1

        }

        const checkExistence = this.inArrayCheck(LineItemToAdd);

        if (checkExistence === true) {
            this.addToSku(LineItemToAdd)
        } else {
            this.orderEdited.lineItems.push(LineItemToAdd);
        }


        this.updateTotals();

    }

    deleteLineItem(lineitem) {
        const count = this.orderEdited.lineItems.length;
        console.log('hitting delete')

        for (let i = 0; i < count; i++) {

            if (this.orderEdited.lineItems[i].sku === lineitem.sku) {
                if (confirm('Are you sure you wish to delete this line item?') === true) {
                    this.orderEdited.lineItems.splice(i, 1)
                    this.updateTotals();
                    return
                } else {
                    return
                }
            }


        }

    }
    



    billingToShipping() {
        // this.errorCheck = true;

        if (this.orderEdited.billingtoo = true) {
            this.orderEdited.bFirstName = this.orderEdited.sFirstName;
            this.orderEdited.bLastName = this.orderEdited.sLastName;
            this.orderEdited.bEmail = this.orderEdited.sEmail;
            this.orderEdited.bPhone = this.orderEdited.sPhone;
            this.orderEdited.bAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.bAddress2 = this.orderEdited.sAddress2;
            this.orderEdited.bCity = this.orderEdited.sCity;
            this.orderEdited.bState = this.orderEdited.sState;
            this.orderEdited.bZip = this.orderEdited.sZip;
            this.orderEdited.bCountry = this.orderEdited.sCountry;
            this.orderEdited.bCompany = this.orderEdited.sCompany;
        }
        console.log(this.orderEdited);


    }

    checkForOther(paymentTerms) {
        if (this.orderEdited.paymentTerms === 'Other') {
            alert('IF YOU ARE CHOOSING OTHER FOR PAYMENT TERMS BE SURE TO CONTACT OPERATIONS AND ACCOUNTING TO NOTIFY THEM OF THE PAYMENT TERMS YOU WISH TO APPLY TO THIS ORDER. MANUAL TRACKING AND FIRING OF INVOICES WILL BE REQUIRED.');
        }
    }

    populateFromWallBuilderPlans(WallBuilderPlan) {
        console.log('Hit Populate From Wall Builder Plan')

        console.log(WallBuilderPlan.productionItems);

        const wallbuilderPlan = WallBuilderPlan.productionItems;

        if (!WallBuilderPlan) { console.log('no Plan found'); return; }
        this.ordersService.tiePriceToWallBuilderPlan(wallbuilderPlan)
            .subscribe(
                WallBuilderPlans => {


                    this.orderEdited.wbFinalURL = ('https://wallbuilder.emagispace.com/#/builder?b=' + WallBuilderPlan.id);

                    console.log('Hit Wallbuilder Plans Options')


                    // WallBuilderPlan = WallBuilderPlans;
                    console.log(WallBuilderPlans);

                    for (const lineItem in WallBuilderPlans) {
                        if (WallBuilderPlans[lineItem]) {
                            console.log(WallBuilderPlans[lineItem]);
                            this.pushToProductionLineItems(WallBuilderPlans[lineItem]);
                        }
                    }
                    this.updateTotals();
                },
                error => this.errorMsg = 'There Was An Error Updating Your Order.'
            )
    }


    populateFromWallBuilderPlansForDistributors(WallBuilderPlan) {
        console.log('Hit Populate From Wall Builder Plan')

        if (!WallBuilderPlan) { console.log('no Plan found'); return; }
        this.ordersService.tiePriceToWallBuilderPlanForDistributors(WallBuilderPlan)
            .subscribe(
                WallBuilderPlans => {


                    this.orderEdited.wbFinalURL = ('https://wallbuilder.emagispace.com/#/builder?b=' + WallBuilderPlan.id);

                    console.log('Hit Wallbuilder Plans Options')


                    WallBuilderPlan = WallBuilderPlans;

                    console.log(WallBuilderPlan)

                    for (const lineItem in WallBuilderPlans.productionItems) {
                        if (WallBuilderPlans.productionItems[lineItem]) {
                            this.pushToDistributorLineItems(WallBuilderPlans.productionItems[lineItem]);
                        }
                    }

                    for (const quoteLineItem in WallBuilderPlans.quoteItems) {
                        if (WallBuilderPlans.quoteItems[quoteLineItem]) {
                            console.log(WallBuilderPlans.quoteItems[quoteLineItem])
                            this.pushToDistributorLineItemsQuote(WallBuilderPlans.quoteItems[quoteLineItem])
                        }
                    }
                    this.updateTotalsClosedWonQuote();
                },
                error => this.errorMsg = 'There Was An Error Updating Your Order.'
            )
    }


    abbrState(input, to) {

        const states = [
            ['Alabama', 'AL'],
            ['Alaska', 'AK'],
            ['Arizona', 'AZ'],
            ['Arkansas', 'AR'],
            ['California', 'CA'],
            ['Colorado', 'CO'],
            ['Connecticut', 'CT'],
            ['Delaware', 'DE'],
            ['Florida', 'FL'],
            ['Georgia', 'GA'],
            ['Hawaii', 'HI'],
            ['Idaho', 'ID'],
            ['Illinois', 'IL'],
            ['Indiana', 'IN'],
            ['Iowa', 'IA'],
            ['Kansas', 'KS'],
            ['Kentucky', 'KY'],
            ['Louisiana', 'LA'],
            ['Maine', 'ME'],
            ['Maryland', 'MD'],
            ['Massachusetts', 'MA'],
            ['Michigan', 'MI'],
            ['Minnesota', 'MN'],
            ['Mississippi', 'MS'],
            ['Missouri', 'MO'],
            ['Montana', 'MT'],
            ['Nebraska', 'NE'],
            ['Nevada', 'NV'],
            ['New Hampshire', 'NH'],
            ['New Jersey', 'NJ'],
            ['New Mexico', 'NM'],
            ['New York', 'NY'],
            ['North Carolina', 'NC'],
            ['North Dakota', 'ND'],
            ['Ohio', 'OH'],
            ['Oklahoma', 'OK'],
            ['Oregon', 'OR'],
            ['Pennsylvania', 'PA'],
            ['Rhode Island', 'RI'],
            ['South Carolina', 'SC'],
            ['South Dakota', 'SD'],
            ['Tennessee', 'TN'],
            ['Texas', 'TX'],
            ['Utah', 'UT'],
            ['Vermont', 'VT'],
            ['Virginia', 'VA'],
            ['Washington', 'WA'],
            ['West Virginia', 'WV'],
            ['Wisconsin', 'WI'],
            ['Wyoming', 'WY'],
        ];

        if (to === 'abbr') {
            input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
            for (let i = 0; i < states.length; i++) {
                if (states[i][0] === input) {
                    return (states[i][1]);
                }
            }
        } else if (to === 'name') {
            input = input.toUpperCase();
            for (let i = 0; i < states.length; i++) {
                if (states[i][1] === input) {
                    return (states[i][0]);
                }
            }
        }
    }


    // commented out for deletion

    // populateInvoiceLineItemsWithClosedWonInformation(lineitems) {
    //     // pop a javascript warning about over write to all existing shipping, billing and invoice line item data
    //     // assign shipping billing data from the quote to our form

    //     // console.log(lineitems);
    //     if (this.orderEdited.lineItems[0]) {
    //         const confirmationCheck = confirm('Are you sure you wish to clear production and invoice line items and repopulate with Salesforce quote line items')
    //         if (confirmationCheck === true) {
    //             this.orderEdited.lineItems = [];
    //         }
    //     }
    //     console.log('Hit Populate From Closed Won Info')
    //     if (lineitems.ShippingCountry === 'USA' || lineitems.ShippingCountry === 'United States') {
    //         lineitems.ShippingCountry = 'US';
    //         this.unitedstatesshipping = true;
    //     }
    //     if (lineitems.BillingCountry === 'USA' || lineitems.BillingCountry === 'United States') {
    //         lineitems.BillingCountry = 'US';
    //         this.unitedstatesbilling = true;
    //     }
    //     if (lineitems.Tax === null) {
    //         lineitems.Tax = 0;
    //     }


    //     if (lineitems.BillingState.length > 2) {
    //         lineitems.BillingState = this.abbrState(lineitems.BillingState, 'abbr');
    //     }
    //     if (lineitems.ShippingState.length > 2) {
    //         lineitems.ShippingState = this.abbrState(lineitems.ShippingState, 'abbr');
    //     }



    //     if (lineitems.Contact) {
    //         this.orderEdited.sFirstName = lineitems.Contact.FirstName;
    //         this.orderEdited.sLastName = lineitems.Contact.LastName;
    //         this.orderEdited.bFirstName = lineitems.Contact.FirstName;
    //         this.orderEdited.bLastName = lineitems.Contact.LastName;
    //     } else {
    //         this.orderEdited.sFirstName = this.orderEdited.sFirstName;
    //         this.orderEdited.sLastName = this.orderEdited.sLastName;
    //         this.orderEdited.bFirstName = this.orderEdited.bFirstName;
    //         this.orderEdited.bLastName = this.orderEdited.bLastName;

    //     }
    //     this.orderEdited.sPhone = lineitems.Phone;
    //     this.orderEdited.sEmail = lineitems.Email;
    //     this.orderEdited.sAddress1 = lineitems.ShippingStreet;
    //     this.orderEdited.sCity = lineitems.ShippingCity;
    //     this.orderEdited.sState = lineitems.ShippingState;
    //     this.orderEdited.sZip = lineitems.ShippingPostalCode;
    //     this.orderEdited.sCountry = lineitems.ShippingCountry;
    //     this.orderEdited.sCompany = lineitems.ShippingName;
    //     this.orderEdited.bAddress1 = lineitems.BillingStreet;
    //     this.orderEdited.bEmail = lineitems.Email;
    //     this.orderEdited.bPhone = lineitems.Phone;
    //     this.orderEdited.bCity = lineitems.BillingCity;
    //     this.orderEdited.bState = lineitems.BillingState;
    //     this.orderEdited.bZip = lineitems.BillingPostalCode;
    //     this.orderEdited.bCountry = lineitems.BillingCountry;
    //     this.orderEdited.bCompany = lineitems.BillingName;
    //     this.orderEdited.sIndustry = lineitems.Industry__c;
    //     this.orderEdited.paymentTerms = lineitems.Payment_Terms__c;
    //     this.orderEdited.wbQuoteURL = lineitems.WallBuilder_Plan_Link__c;
    //     this.orderEdited.invoiceTax = lineitems.Tax;
    //     this.orderEdited.invoiceShippingCost = lineitems.ShippingHandling;
    //     this.orderEdited.sMiscNotes = lineitems.Misc_Notes__c;
    //     this.orderEdited.sDeadLine = lineitems.Desired_Delivery_Date__c;
    //     this.orderEdited.invoiceTotal = lineitems.Subtotal;
    //     this.orderEdited.sDeliveryHours = lineitems.Delivery_Hours__c;
    //     if (lineitems.loading_dock__c === true) {
    //         this.orderEdited.sLoadingDock = 'yes';
    //     } else {
    //         this.orderEdited.sLoadingDock = this.orderEdited.sLoadingDock;
    //     }

    //     if (lineitems.inside_delivery_required__c === true) {
    //         this.orderEdited.sInsideDelivery = 'yes';
    //         this.orderEdited.sLoadingDock = 'no';
    //         this.orderEdited.sPalletJack = 'no';
    //     } else {
    //         this.orderEdited.sInsideDelivery = this.orderEdited.sInsideDelivery;
    //     }

    //     if (this.orderEdited.paymentTerms === 'Other') {
    //         alert('IF YOU ARE CHOOSING OTHER FOR PAYMENT TERMS BE SURE TO CONTACT OPERATIONS AND ACCOUNTING TO NOTIFY THEM OF THE PAYMENT TERMS YOU WISH TO APPLY TO THIS ORDER. MANUAL TRACKING AND FIRING OF INVOICES WILL BE REQUIRED.');
    //     }

    //     if (!lineitems) { console.log('Error'); return; }
    //     this.ordersService.tiePriceToClosedWonQuote(lineitems)
    //         .subscribe(
    //             InvoicedLineItems => {

    //                 console.log('Hit Wallbuilder Plans Options')

    //                 this.orderEdited.invoiceLineItems = [];
    //                 console.log(InvoicedLineItems);




    //                 for (const lineItem in InvoicedLineItems) {
    //                     if (InvoicedLineItems[lineItem]) {
    //                         console.log(InvoicedLineItems[lineItem])
    //                         // this.pushToInvoiceLineItems(InvoicedLineItems[lineItem]);
    //                     }
    //                 }
    //                 this.pushOrderNumberToSalesForceQuote(lineitems.Id);
    //                 this.updateTotalsClosedWonQuote();
    //                 this.hideAddSalesForceClosedWon();
    //             },
    //             error => this.errorMsg = 'There Was An Error Updating Your Order.'
    //         )







    // }

    populateContactWithAccountInformation(contact) {
        console.log('Hit Populate From Account')


        this.ordersService.getSalesforceAccount(contact.AccountId)
            .subscribe(
                Account => {

                    console.log('Hit Wallbuilder Plans Options')



                    this.orderEdited.sFirstName = contact.FirstName;
                    this.orderEdited.sLastName = contact.LastName;
                    this.orderEdited.sPhone = contact.Phone;
                    this.orderEdited.sEmail = contact.Email;
                    this.orderEdited.sAddress1 = contact.MailingStreet;
                    this.orderEdited.sCity = contact.MailingCity;
                    this.orderEdited.sState = contact.MailingState;
                    this.orderEdited.sZip = contact.MailingPostalCode;
                    this.orderEdited.sCountry = contact.MailingCountry;
                    this.orderEdited.bFirstName = contact.FirstName;
                    this.orderEdited.bLastName = contact.LastName;
                    this.orderEdited.bAddress1 = Account.BillingStreet;
                    this.orderEdited.bEmail = contact.Email;
                    this.orderEdited.bPhone = contact.Phone;
                    this.orderEdited.bCity = Account.BillingCity;
                    this.orderEdited.bState = Account.BillingState;
                    this.orderEdited.bZip = Account.BillingPostalCode;
                    this.orderEdited.bCountry = Account.BillingCountry;
                    // here should be able to fill shipping from contact and billing from Company!
                    // WallBuilderPlan = WallBuilderPlans;

                    // for(const lineItem in WallBuilderPlans){
                    //   console.log(lineItem.sku);
                    //   this.pushToProductionLineItems(lineItem);
                    // }
                    // console.log(Order);
                    // this.updateTotals();

                    this.hideAddSalesForceAccount();
                },
                error => this.errorMsg = 'There Was An Error Updating Your Order.'
            )







    }

    pushOrderNumberToSalesForceQuote(quoteId) {

        const packageJson = {
            quoteId: quoteId,
            orderNumber: this.orderEdited.orderNumber
        }
        this.ordersService.pushOrderNumberToSalesForceQuote(packageJson)
            .subscribe(
                data => {
                    console.log(data)
                },
                error => {
                    console.log(error)
                }
            )
    }

    pushToProductionLineItems(LineItem) {
        const tempLineItemTotal = LineItem.CustomerPrice * LineItem.quantity;
        const newTempLineItemTotal = this.round(tempLineItemTotal, 2);
        const WallBuilderPlanToAdd = {
            sku: LineItem.sku,
            name: LineItem.name,
            unitPrice: LineItem.CustomerPrice,
            discountPrice: LineItem.CustomerPrice,
            qty: LineItem.quantity,
            total: newTempLineItemTotal
        }

        const checkExistence = this.inArrayCheck(WallBuilderPlanToAdd);

        if (checkExistence === true) {
            this.addToSku(WallBuilderPlanToAdd)
        } else {
            this.orderEdited.lineItems.push(WallBuilderPlanToAdd);
        }
    }

    pushToDistributorLineItems(LineItem) {
        const tempLineItemTotal = LineItem.CustomerPrice * LineItem.quantity;
        const newTempLineItemTotal = this.round(tempLineItemTotal, 2);
        const WallBuilderPlanToAdd = {
            sku: LineItem.sku,
            name: LineItem.name,
            unitPrice: LineItem.CustomerPrice,
            discountPrice: LineItem.CustomerPrice,
            qty: LineItem.quantity,
            total: newTempLineItemTotal
        }

        const checkExistence = this.inArrayCheck(WallBuilderPlanToAdd);

        if (checkExistence === true) {
            this.addToSku(WallBuilderPlanToAdd)
        } else {
            this.orderEdited.lineItems.push(WallBuilderPlanToAdd);
        }
    }

    pushToDistributorLineItemsQuote(LineItem) {
        const tempLineItemTotal = LineItem.unitPrice * LineItem.quantity;
        const newTempLineItemTotal = this.round(tempLineItemTotal, 2);
        const WallBuilderPlanToAdd = {
            sku: LineItem.sfProductId,
            name: LineItem.name,
            unitPrice: LineItem.unitPrice,
            discountPrice: LineItem.unitPrice,
            qty: LineItem.quantity,
            total: newTempLineItemTotal
        }

        const checkExistence = this.inArrayCheck(WallBuilderPlanToAdd);

        if (checkExistence === true) {
            this.addToSku(WallBuilderPlanToAdd)
        } else {
            this.orderEdited.lineItems.push(WallBuilderPlanToAdd);
        }
    }


    // commented code to be deleted

    // pushToInvoiceLineItems(LineItem) {
    //     console.log(LineItem)
    //     const tempLineItemTotal = LineItem.ListPrice * LineItem.Quantity

    //     const newTempLineItemTotal = this.round(tempLineItemTotal, 2);
    //     const closedWonQuoteToAdd = {
    //         sku: LineItem.sku,
    //         name: LineItem.Name,
    //         unitPrice: LineItem.ListPrice,
    //         discountPrice: LineItem.UnitPrice,
    //         qty: LineItem.Quantity,
    //         total: newTempLineItemTotal,
    //         description: LineItem.Description
    //     }

    //     // this.orderEdited.invoiceLineItems.length = 0;
    //     // const checkExistence = this.inArrayCheckClosedWon(closedWonQuoteToAdd);

    //     // if (checkExistence === true) {
    //     //   this.addToSkuClosedWon(closedWonQuoteToAdd)
    //     // } else {
    //     // || closedWonQuoteToAdd.sku === 'Other6' || closedWonQuoteToAdd.sku === 'Other7' || closedWonQuoteToAdd.sku === 'Other8' || closedWonQuoteToAdd.sku === 'Other9'
    //     // if (closedWonQuoteToAdd.sku === 'Other6' || closedWonQuoteToAdd.sku === 'Other7' || closedWonQuoteToAdd.sku === 'Other8' || closedWonQuoteToAdd.sku === 'Other9') {
    //     //     closedWonQuoteToAdd.name === closedWonQuoteToAdd.description;
    //     // }

    //     if (closedWonQuoteToAdd.sku === '1000396A' || closedWonQuoteToAdd.sku === '1000392A' || closedWonQuoteToAdd.sku === '1000393A') {

    //         this.orderEdited.lineItems.push(closedWonQuoteToAdd);
    //     }
    //     console.log(closedWonQuoteToAdd);

    //     this.orderEdited.invoiceLineItems.push(closedWonQuoteToAdd);
    //     // }
    // }


    addInvoiceLineItemToProduction(LineItem) {
        console.log(LineItem);
        const tempLineItemTotal = LineItem.ListPrice * LineItem.Quantity

        const newTempLineItemTotal = this.round(tempLineItemTotal, 2);
        const closedWonQuoteToAdd = {
            sku: LineItem.sku,
            name: LineItem.name,
            unitPrice: LineItem.unitPrice,
            discountPrice: LineItem.discountPrice,
            qty: LineItem.qty,
            total: LineItem.total,
            description: LineItem.name
        }



        if (closedWonQuoteToAdd.sku === 'Other6' || closedWonQuoteToAdd.sku === 'Other7' || closedWonQuoteToAdd.sku === 'Other8' || closedWonQuoteToAdd.sku === 'Other9') {
            closedWonQuoteToAdd.name === closedWonQuoteToAdd.description;
        }
        for (let i in this.orderEdited.lineItems) {
            console.log(this.orderEdited.lineItems);
            if (this.orderEdited.lineItems[i].sku === closedWonQuoteToAdd.sku) {
                alert("You're adding a line item that already exists");
            }
        }

        console.log(closedWonQuoteToAdd);


        this.orderEdited.lineItems.push(closedWonQuoteToAdd);

    }

    // pushToInvoiceLineItems(InvoiceLineItem) {
    //   const tempLineItemTotal = InvoiceLineItem.CustomerPrice * InvoiceLineItem.quantity;
    //   const newTempLineItemTotal = this.round(tempLineItemTotal, 2);
    //   const WallBuilderPlanToAdd = {
    //     sku: InvoiceLineItem.sku,
    //     name: InvoiceLineItem.name,
    //     unitPrice: InvoiceLineItem.CustomerPrice,
    //     discountPrice: InvoiceLineItem.CustomerPrice,
    //     qty: InvoiceLineItem.quantity,
    //     total: newTempLineItemTotal
    //   }

    //   const checkExistence = this.inArrayCheck(WallBuilderPlanToAdd);

    //   if (checkExistence === true) {
    //     this.addToSku(WallBuilderPlanToAdd)
    //   } else {
    //     this.orderEdited.invoiceLineItems.push(WallBuilderPlanToAdd);
    //   }
    // }


    // commented out for deletion
    // inArrayCheckClosedWon(element: any): Boolean {
    //     const count = this.orderEdited.invoiceLineItems.length;


    //     console.log('Hit In Array Check');

    //     for (let i = 0; i < count; i++) {

    //         if (this.orderEdited.invoiceLineItems[i].sku === element.sku) {

    //             return true;
    //         }


    //     }
    //     return false;
    // }

    // addToSkuClosedWon(element) {
    //     const count = this.orderEdited.invoiceLineItems.length - 1;
    //     for (let i = 0; i < count; i++) {

    //         if (this.orderEdited.invoiceLineItems[i].sku === element.sku) {
    //             this.orderEdited.invoiceLineItems[i].qty = (this.orderEdited.invoiceLineItems[i].qty + element.qty)

    //         }

    //     }
    // }

    inArrayCheck(element: any): Boolean {
        const count = this.orderEdited.lineItems.length;

        console.log('logging goingGreen')
        console.log(this.goingGreen);

        console.log('Hit In Array Check');

        for (let i = 0; i < count; i++) {

            if (this.orderEdited.lineItems[i].sku === element.sku) {

                return true;
            }

        }
        return false;
    }

    addToSku(element) {
        const count = this.orderEdited.lineItems.length;
        for (let i = 0; i < count; i++) {

            if (this.orderEdited.lineItems[i].sku === element.sku) {
                this.orderEdited.lineItems[i].qty = (this.orderEdited.lineItems[i].qty + element.qty)

            }

        }
    }



    sendEditedOrder(orderEdited) {
        this.ordersService.displayOrders()
            .subscribe(
                data => {
                    const orderResponse = data;
                    for (const i in orderResponse) {
                        if (orderResponse[i]) {

                            for (const z in orderResponse[i].lineItems) {
                                if (orderResponse[i].lineItems[z]) {
                                    // console.log('Z Loop')
                                    // console.log(orderResponse[i].lineItems[z])
                                    this.orderEdited.lineItems.push(new LineItems(
                                        orderResponse[i].lineItems[z].bases, orderResponse[i].lineItems[z].skins, orderResponse[i].lineItems[z].lengths, orderResponse[i].lineItems[z].quantity, orderResponse[i].lineItems[z].total, orderResponse[i].lineItems[z].preFabType, orderResponse[i].lineItems[z].sku
                                    ))
                                }
                            }
                            
                            this.orderEdited.push(new Order(
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
                                orderResponse[0].paymentTerms,
                                orderResponse[i].cin7SalesOrderShipped,
                                orderResponse[i].qboInvoiceSent,
                                orderResponse[i].cin7SalesOrderShippedTimeStamp,
                                orderResponse[i].qboInvoiceSentTimeStamp,
                                orderResponse[i].salesEmail,
                                orderResponse[i].qboInvoicePaid,
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

                    };
                    console.log('this is order edited: ');
                    // this.orderEdited = {};
                    console.log('HEY HEY HEY')
                },
                error => alert(error),
                () => console.log('Displaying Order by ID')
            );
    }




    onSubmitUpdatedOrder(orderEdited) {
        // this.billingToShipping();
        // if ((Date.now() - this.lastUpdateTimeStamp > 60000) || !this.lastUpdateTimeStamp) {
        //   this.lastUpdateTimeStamp = Date.now()
        // console.log(Date.now())
        //   if (!orderEdited) { return; }
        //   this.ordersService.editOrder(orderEdited)
        //     .subscribe(
        //     Order => { this.data = 'Your Order has been Updated!' },
        //     error => this.errorMsg = 'There Was An Error Updating Your Order.'
        //     )
        // } else {
        //   console.log('No Need to Re Update DB')
        // }

    }

    onSubmitOrderForProductionCheck(orderEdited) {
        this.spinner = true;
        if (this.orderEdited.billingtoo = true) {
            this.orderEdited.bFirstName = this.orderEdited.sFirstName;
            this.orderEdited.bLastName = this.orderEdited.sLastName;
            this.orderEdited.bEmail = this.orderEdited.sEmail;
            this.orderEdited.bPhone = this.orderEdited.sPhone;
            this.orderEdited.bAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.bAddress2 = this.orderEdited.sAddress2;
            this.orderEdited.bCity = this.orderEdited.sCity;
            this.orderEdited.bState = this.orderEdited.sState;
            this.orderEdited.bZip = this.orderEdited.sZip;
            this.orderEdited.bCountry = this.orderEdited.sCountry;
            this.orderEdited.bCompany = this.orderEdited.sCompany;
        }

        this.orderEdited.operationsApproved = false;
        if (!orderEdited) { return; }

        function onlyKitCheck(arrayToBeChecked) {
            const count = arrayToBeChecked.length;
            for (let i = 0; i < count; i++) {
                if (arrayToBeChecked[i].sku !== '1000396A' && arrayToBeChecked[i].sku !== '1000397A' && arrayToBeChecked[i].sku !== '1000393A') {
                    return false;
                }
            }
            return true;
        }

        if (onlyKitCheck(orderEdited.lineItems) === true) {
            this.orderEdited.operationsApproved = true;
            this.ordersService.changeOrderToProcessing(orderEdited)
                .subscribe(
                    Order => { this.data = 'Your Order has been changed to Processing', this.router.navigate(['/orders']); this.spinner = false; },
                    error => this.errorMsg = 'There Was An Error Updating Your Order To Processing.'
                )
        } else {
            this.ordersService.submitOrderForProductionCheck(orderEdited)
                .subscribe(
                    Order => {
                        this.hideSuccessMsg()
                        this.spinner = false;
                    },
                    error => this.errorMsg = 'There Was An Error Updating Your Order.',
                    () => {
                        console.log('order updated');
                    }
                )

        }










    }

    onSubmitUpdatedOrderThroughClick(orderEdited) {
        this.spinner = true;
        this.lastUpdateTimeStamp = Date.now()
        if (this.orderEdited.billingtoo = true) {
            this.orderEdited.bFirstName = this.orderEdited.sFirstName;
            this.orderEdited.bLastName = this.orderEdited.sLastName;
            this.orderEdited.bEmail = this.orderEdited.sEmail;
            this.orderEdited.bPhone = this.orderEdited.sPhone;
            this.orderEdited.bAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.bAddress2 = this.orderEdited.sAddress2;
            this.orderEdited.bCity = this.orderEdited.sCity;
            this.orderEdited.bState = this.orderEdited.sState;
            this.orderEdited.bZip = this.orderEdited.sZip;
            this.orderEdited.bCountry = this.orderEdited.sCountry;
            this.orderEdited.bCompany = this.orderEdited.sCompany;
        }


        if (!orderEdited) { return; }
        this.ordersService.editOrder(orderEdited)
            .subscribe(
                Order => {
                    this.hideSuccessMsg()
                    this.spinner = false;
                },
                error => this.errorMsg = 'There Was An Error Updating Your Order.',
                () => {
                    console.log('order updated');
                }
            )



    }


    hideSuccessMsg() {
        this.flashMessage.show('Your Order Has Been Updated!', { classes: ['alert-success'], timeout: 3000 })
    }

    onSubmitOrderChangeToProcessing(orderEdited) {
        this.spinner = true;
        if (this.orderEdited.billingtoo = true) {
            this.orderEdited.bFirstName = this.orderEdited.sFirstName;
            this.orderEdited.bLastName = this.orderEdited.sLastName;
            this.orderEdited.bEmail = this.orderEdited.sEmail;
            this.orderEdited.bPhone = this.orderEdited.sPhone;
            this.orderEdited.bAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.bAddress2 = this.orderEdited.sAddress2;
            this.orderEdited.bCity = this.orderEdited.sCity;
            this.orderEdited.bState = this.orderEdited.sState;
            this.orderEdited.bZip = this.orderEdited.sZip;
            this.orderEdited.bCountry = this.orderEdited.sCountry;
            this.orderEdited.bCompany = this.orderEdited.sCompany;
        }

        
        this.orderEdited.operationsApproved = true;
        if (!orderEdited) { return; }
        this.ordersService.changeOrderToProcessing(orderEdited)
            .subscribe(
                Order => { this.data = 'Your Order has been changed to Processing', this.router.navigate(['/orders']); this.spinner = false; },
                error => this.errorMsg = 'There Was An Error Updating Your Order To Processing.'
            )
    }

    onSubmitOrderForProcessing(orderEdited) {
        this.spinner = true;
        console.log('hit submit order for processing')
        if (this.orderEdited.billingtoo = true) {
            this.orderEdited.bFirstName = this.orderEdited.sFirstName;
            this.orderEdited.bLastName = this.orderEdited.sLastName;
            this.orderEdited.bEmail = this.orderEdited.sEmail;
            this.orderEdited.bPhone = this.orderEdited.sPhone;
            this.orderEdited.bAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.bAddress2 = this.orderEdited.sAddress2;
            this.orderEdited.bCity = this.orderEdited.sCity;
            this.orderEdited.bState = this.orderEdited.sState;
            this.orderEdited.bZip = this.orderEdited.sZip;
            this.orderEdited.bCountry = this.orderEdited.sCountry;
            this.orderEdited.bCompany = this.orderEdited.sCompany;
        }

        
        this.orderEdited.operationsApproved = true;
        if (!orderEdited) { return; }
        this.ordersService.changeOrderToProcessing(orderEdited)
            .subscribe(
                Order => { this.data = 'Your Order has been changed to Processing', this.router.navigate(['/orders']); this.spinner = false; },
                error => this.errorMsg = 'There Was An Error Updating Your Order To Processing.'
            )
    }


    onSubmitOrderChangeToInvoicing(orderEdited) {
        this.spinner = true;
        if (this.orderEdited.billingtoo = true) {
            this.orderEdited.bFirstName = this.orderEdited.sFirstName;
            this.orderEdited.bLastName = this.orderEdited.sLastName;
            this.orderEdited.bEmail = this.orderEdited.sEmail;
            this.orderEdited.bPhone = this.orderEdited.sPhone;
            this.orderEdited.bAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.bAddress2 = this.orderEdited.sAddress2;
            this.orderEdited.bCity = this.orderEdited.sCity;
            this.orderEdited.bState = this.orderEdited.sState;
            this.orderEdited.bZip = this.orderEdited.sZip;
            this.orderEdited.bCountry = this.orderEdited.sCountry;
            this.orderEdited.bCompany = this.orderEdited.sCompany;
        }
        if (!orderEdited) { return; }
        console.log('onSubmitOrderChangeToInvoicing')
        this.ordersService.changeOrderToInvoicing(orderEdited)
            .subscribe(
                Order => { this.data = 'Your Order Is Now Invoiced', this.router.navigate(['/orders']); this.spinner = false; },
                error => this.errorMsg = 'There Was An Error Invoicing Your Order.'
            )
    }

    submitOrderForInvoicing(orderEdited) {
        this.spinner = true;
        if (this.orderEdited.billingtoo = true) {
            this.orderEdited.bFirstName = this.orderEdited.sFirstName;
            this.orderEdited.bLastName = this.orderEdited.sLastName;
            this.orderEdited.bEmail = this.orderEdited.sEmail;
            this.orderEdited.bPhone = this.orderEdited.sPhone;
            this.orderEdited.bAddress1 = this.orderEdited.sAddress1;
            this.orderEdited.bAddress2 = this.orderEdited.sAddress2;
            this.orderEdited.bCity = this.orderEdited.sCity;
            this.orderEdited.bState = this.orderEdited.sState;
            this.orderEdited.bZip = this.orderEdited.sZip;
            this.orderEdited.bCountry = this.orderEdited.sCountry;
            this.orderEdited.bCompany = this.orderEdited.sCompany;
        }
        if (!orderEdited) { return; }
        console.log('submitOrderForInvoicing')
        this.ordersService.submitOrderForInvoicing(orderEdited)
            .subscribe(
                Order => { this.data = 'Your Order Is Now Invoiced'; this.router.navigate(['/orders']); this.spinner = false; },
                error => this.errorMsg = 'There Was An Error Invoicing Your Order.'
            )


    }



    calculateTax(orderEdited) {
        this.hasTaxBeenCalculated = true;
        this.orderEdited.total = this.subtotal;
        if (!orderEdited) { return; }
        this.ordersService.calculateTax(orderEdited)
            .subscribe(
                Order => {
                    this.taxJarTax = Order.tax.amount_to_collect;
                    this.orderEdited.cart_tax = Order.tax.amount_to_collect;
                    this.orderEdited.tax = Order.tax.amount_to_collect;
                    this.updateTotals();
                },
                error => this.errorMsg = 'There Was An Error Updating Your Order.'
            )


    }

    calculateTaxForDistributors(orderEdited) {
        this.hasTaxBeenCalculated = true;
        this.orderEdited.invoiceTotal = this.invoiceSubtotal;
        if (!orderEdited) { return; }
        this.ordersService.calculateTaxForDistributors(orderEdited)
            .subscribe(
                Order => {
                    this.taxJarTax = Order.tax.amount_to_collect;
                    this.orderEdited.cart_tax = Order.tax.amount_to_collect;
                    this.orderEdited.invoiceTax = Order.tax.amount_to_collect;
                    this.updateTotalsClosedWonQuote();
                },
                error => this.errorMsg = 'There Was An Error Updating Your Order.'
            )


    }

    taxExempt(orderEdited) {
        this.hasTaxBeenCalculated = true;

        this.orderEdited.tax = 0;

        this.updateTotals();
    }

    taxExemptForDistributors(orderEdited) {
        this.hasTaxBeenCalculated = true;

        this.orderEdited.invoiceTax = 0;

        this.updateTotalsClosedWonQuote();
    }

    isUnitedStatesShipping() {
        console.log('hitting is united states shipping function');
        if (this.orderEdited.sCountry === 'US') {
            this.unitedstatesshipping = true;
            this.canadashipping = null;
        } else if (this.orderEdited.sCountry === 'Canada') {
            this.canadashipping = true;
            this.unitedstatesshipping = null;
        } else {
            this.unitedstatesshipping = false;
            this.canadashipping = false;
        }
        // this.unitedstates = true;
    }

    isUnitedStatesBilling() {
        if (this.orderEdited.bCountry === 'US') {
            this.unitedstatesbilling = true;
            this.canadabilling = null;
        } else if (this.orderEdited.bCountry === 'Canada') {
            this.canadabilling = true;
            this.unitedstatesbilling = null;
        } else {
            this.unitedstatesbilling = false;
            this.canadabilling = false;
        }
        // this.unitedstates = true;
    }



    showOrderConsole(): void {
        console.log(this.order);
    }

    goBack(): void {
        this.location.back();
    }


    updateTotals() {
        this.subtotal = 0;

        for (const i in this.orderEdited.lineItems) {
            if (this.orderEdited.lineItems[i]) {

                const calculatedTotal = this.orderEdited.lineItems[i].qty * this.orderEdited.lineItems[i].discountPrice;

                this.orderEdited.lineItems[i].total = this.round(calculatedTotal, 2);
                // const lineTotal = this.orderEdited.lineItems[i].qty * this.orderEdited.lineItems[i].discountPrice;
                const lineTotal = this.orderEdited.lineItems[i].total;
                this.subtotal = this.subtotal + this.round(lineTotal, 2);
                // this.orderEdited.subtotal = this.orderEdited.subtotal + this.orderEdited.lineItems[i].total;
            }
        }
        // const roundedSubTotal = this.round(this.subtotal, 2);
        this.subtotal = this.round(this.subtotal, 2);
        const parsedTax = parseFloat(this.orderEdited.tax);
        this.orderEdited.total = this.subtotal + parsedTax;
        const parsedTotalAndTax = parseFloat(this.orderEdited.total);
        const shippingTotal = parseFloat(this.orderEdited.shippingCost);
        this.orderEdited.finalTotal = this.round(parsedTotalAndTax, 2) + shippingTotal;

    }


    updateTotalsClosedWonQuote() {
        // console.log(this.passedWall)
        this.invoiceSubtotal = 0;

        for (const i in this.orderEdited.lineItems) {

            if (this.orderEdited.lineItems[i]) {

                const calculatedTotal = this.orderEdited.lineItems[i].qty * this.orderEdited.lineItems[i].discountPrice;

                this.orderEdited.lineItems[i].total = this.round(calculatedTotal, 2);
                // const lineTotal = this.orderEdited.lineItems[i].qty * this.orderEdited.lineItems[i].discountPrice;
                const lineTotal = parseFloat(this.orderEdited.lineItems[i].total);

                this.invoiceSubtotal = this.invoiceSubtotal + this.round(lineTotal, 2);
                // this.orderEdited.subtotal = this.orderEdited.subtotal + this.orderEdited.lineItems[i].total;
            }
        }
        // const roundedSubTotal = this.round(this.subtotal, 2);
        this.invoiceSubtotal = this.round(this.invoiceSubtotal, 2);
        // this.orderEdited.invoiceTax = 0;
        const parsedTax = parseFloat(this.orderEdited.invoiceTax);
        this.orderEdited.invoiceTotal = this.invoiceSubtotal + parsedTax;
        const parsedTotalAndTax = parseFloat(this.orderEdited.invoiceTotal);
        let shippingTotal: number;
        if (this.orderEdited.invoiceShippingCost) {
            shippingTotal = parseFloat(this.orderEdited.invoiceShippingCost);
        } else {
            shippingTotal = 0;
        }
        this.orderEdited.invoiceFinalTotal = this.round(parsedTotalAndTax, 2) + shippingTotal;

    }

    assignSalesPerson() {
        // for(const i in this.tempUser){
        //   console.log(this.tempUser[i].name)
        // }


        this.orderEdited.salesName = this.tempUser.name;
        this.orderEdited.salesEmail = this.tempUser.email;
    }

    contactShowMethod() {
        this.contactTriggeringEventEmitter.emit(true);
    }
    wallbuilderShowMethod() {
        this.wallbuilderTriggeringEventEmitter.emit(true);
    }
    wallbuilderShowMethodForDistributors() {
        this.wallbuilderTriggeringEventEmitterForDistributors.emit(true);
    }
    productShowMethod() {
        this.productTriggeringEventEmitter.emit(true);
    }
    closedwonShowMethod() {
        this.closedwonTriggeringEventEmitter.emit(true);
    }



    showAddProduct() {
        this.addProductFlag = true;
        this.addWallBuilderPlanFlag = false;
    }

    hideAddProduct() {
        this.addProductFlag = null;
        this.newLineItem.name = null;
    }

    showAddWallBuilderPlan() {
        this.addWallBuilderPlanFlag = true;
        this.addProductFlag = false;
    }

    hideAddWallBuilderPlan() {
        this.addWallBuilderPlanFlag = null;
        this.newLineItem.name = null;
    }

    showAddSalesForceAccount() {
        this.addSalesForceAccountFlag = true;
    }

    hideAddSalesForceAccount() {
        this.addSalesForceAccountFlag = null;
        this.newLineItem.name = null;
    }

    showAddSalesForceClosedWon() {
        this.addSalesForceClosedWonFlag = true;

    }

    hideAddSalesForceClosedWon() {
        this.addSalesForceClosedWonFlag = null;

    }

    showInvoicing() {
        this.invoicing = true;
    }

    hideInvoicing() {
        this.invoicing = false;
    }


}
