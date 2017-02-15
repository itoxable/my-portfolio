/**
 * Created by ruic on 11/02/2017.
 */


import {Component} from '@angular/core';
import {DataRequestModel} from "../../models/data-request.model";
import {DataTableModel} from "../data-table/data-table.component";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {FirebaseListFactoryOpts, Query} from "angularfire2/interfaces";
import Reference = firebase.storage.Reference;

@Component({
    selector: 'mp-home',
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent{
    dataTable:DataTableModel;
    portfolioFirebaseListObservable:FirebaseListObservable<any>;
    storageRef:Reference;
    x:any = {};
    constructor(private angularFire:AngularFire) {
        //this.init();

       //this.storageRef = firebase.storage().ref("");

// this.angularFire.
//         let fire:firebase.storage()
        // // {
        //     "blpu_class": "C",
        //     "primary": "C",
        //     "description": "Commercial",
        //     "added_date": "23-JUN-10"
        // // },
        // blpu_class
        // primary
        // secondary
        // tertiary
        // description
        // added_date
        //
        // added_date
        // for(let i = 0; i < this.data.items.length; i++){
        //     this.x[this.data.items['blpu_class']] = {
        //         "blpu_class": "C",
        //         "primary": "C",
        //         "description": "Commercial",
        //     }
        // }

        let query: Query = {
            key: "ruiCunha",
            // orderByKey?: boolean | Observable<boolean>;
            // orderByPriority?: boolean | Observable<boolean>;
            // orderByChild?: string | Observable<string>;
            // orderByValue?: boolean | Observable<boolean>;
            // equalTo?: any | Observable<any>;
            // startAt?: any | Observable<any>;
            // endAt?: any | Observable<any>;
            // limitToFirst?: number | Observable<number>;
            // limitToLast?: number | Observable<number>;
        };
        let firebaseListFactoryOpts: FirebaseListFactoryOpts = {
            preserveSnapshot: true,
            query: query
        };

        this.portfolioFirebaseListObservable = this.angularFire.database.list('ruiCunha/portfolio', firebaseListFactoryOpts);
        this.angularFire.database.object('ruiCunha').subscribe(x => {
            console.log(x);
        });
       // this.portfolioFirebaseListObservable.
        // .subscribe(data => {
        //     console.log(data);
        // });
        // for (let i = 6; i < 30; i++) {
        //
        //     this.firebaseListObservable.push({
        //         "name": "image"+i,
        //         "url": "",
        //         "categories": [
        //             "City",
        //             "Portrait"
        //         ]
        //     })
        // }
    }


    init(){
        let data:Array<any> = [];

        for(let i = 1; i < 22 ; i++){
            data.push({
                url: '/images/'+i+'.JPG',
                name: 'something'+i
            })
        }
        console.log(data);
        this.dataTable = new DataTableModel({
            data: 'ruiCunha/portfolio',
            noDataMessageStyleClass: "error-message",
            firebaseListObservable: this.portfolioFirebaseListObservable,
            liveScroll: true,
            //isFirebase: true,
            columns:[
                {
                    field:'Filename',
                    displayName: 'Filename',
                    sortable: true,
                    sortField: 'filename'
                },
                {
                    field:'Status',
                    displayName: 'Status'
                }
            ],
            dataRequestModel:new DataRequestModel({
                pageSize: 6
            })
        })
    }

    data:any = {
        "items": [
            {
                "blpu_class": "C",
                "primary": "C",
                "description": "Commercial",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CA",
                "primary": "C",
                "secondary": "A",
                "description": "Agricultural",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CA01",
                "primary": "C",
                "secondary": "A",
                "tertiary": "01",
                "description": "Farms",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CA02",
                "primary": "C",
                "secondary": "A",
                "tertiary": "02",
                "description": "Fisheries",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CA03",
                "primary": "C",
                "secondary": "A",
                "tertiary": "03",
                "description": "Horticulture",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CA04",
                "primary": "C",
                "secondary": "A",
                "tertiary": "04",
                "description": "Slaughter houses / abattoirs",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CB",
                "primary": "C",
                "secondary": "B",
                "description": "Ancillary buildings",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CC",
                "primary": "C",
                "secondary": "C",
                "description": "Community Services",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC01",
                "primary": "C",
                "secondary": "0",
                "tertiary": "1",
                "description": "Fire, Police and Ambulance stations",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC02",
                "primary": "C",
                "secondary": "0",
                "tertiary": "2",
                "description": "Law courts",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC03",
                "primary": "C",
                "secondary": "0",
                "tertiary": "3",
                "description": "Prisons",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC04",
                "primary": "C",
                "secondary": "0",
                "tertiary": "4",
                "description": "Public and village halls",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC05",
                "primary": "C",
                "secondary": "0",
                "tertiary": "5",
                "description": "Public Conveniences",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC06",
                "primary": "C",
                "secondary": "0",
                "tertiary": "6",
                "description": "Cemeteries & Crematorium",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC07",
                "primary": "C",
                "secondary": "0",
                "tertiary": "7",
                "description": "Church halls",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CC08",
                "primary": "C",
                "secondary": "C",
                "tertiary": "08",
                "description": "Community service centres",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CC09",
                "primary": "C",
                "secondary": "C",
                "tertiary": "09",
                "description": "Household Waste Recycling Centre (HWRC)",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CC10",
                "primary": "C",
                "secondary": "C",
                "tertiary": "10",
                "description": "Recycling Sites",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CC11",
                "primary": "C",
                "secondary": "C",
                "tertiary": "11",
                "description": "CCTV",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CC12",
                "primary": "C",
                "secondary": "C",
                "tertiary": "12",
                "description": "Job centres",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CE",
                "primary": "C",
                "secondary": "E",
                "description": "Education",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CE01",
                "primary": "C",
                "secondary": "E",
                "tertiary": "01",
                "description": "Colleges",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CE02",
                "primary": "C",
                "secondary": "E",
                "tertiary": "02",
                "description": "Nursery/creche",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CE03",
                "primary": "C",
                "secondary": "E",
                "tertiary": "03",
                "description": "Primary, Junior, Infants or Middle School",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CE04",
                "primary": "C",
                "secondary": "E",
                "tertiary": "04",
                "description": "Secondary School",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CE05",
                "primary": "C",
                "secondary": "E",
                "tertiary": "05",
                "description": "Universities",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CE06",
                "primary": "C",
                "secondary": "E",
                "tertiary": "06",
                "description": "Special needs establishments",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CE07",
                "primary": "C",
                "secondary": "E",
                "tertiary": "07",
                "description": "Other educational establishments",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CH",
                "primary": "C",
                "secondary": "H",
                "description": "Hotels, Boarding and Guest Houses",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CH01",
                "primary": "C",
                "secondary": "H",
                "tertiary": "01",
                "description": "Guest House/B&B",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CH02",
                "primary": "C",
                "secondary": "H",
                "tertiary": "02",
                "description": "Holiday Let/Accommodation other than above",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CH03",
                "primary": "C",
                "secondary": "H",
                "tertiary": "03",
                "description": "Hotel",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CI",
                "primary": "C",
                "secondary": "I",
                "description": "Industrial",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CI01",
                "primary": "C",
                "secondary": "I",
                "tertiary": "01",
                "description": "Factories & Manufacturing",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CI02",
                "primary": "C",
                "secondary": "I",
                "tertiary": "02",
                "description": "Mineral workings & quarries/mines",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CI03",
                "primary": "C",
                "secondary": "I",
                "tertiary": "03",
                "description": "Workshops",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CI04",
                "primary": "C",
                "secondary": "I",
                "tertiary": "04",
                "description": "Warehouses",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CI05",
                "primary": "C",
                "secondary": "I",
                "tertiary": "05",
                "description": "Wholesale distribution",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CI06",
                "primary": "C",
                "secondary": "I",
                "tertiary": "06",
                "description": "Recycling Plant",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CI07",
                "primary": "C",
                "secondary": "I",
                "tertiary": "07",
                "description": "Incinerators and Waste Transfer Stations",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CI08",
                "primary": "C",
                "secondary": "I",
                "tertiary": "08",
                "description": "Maintenance depots",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CL",
                "primary": "C",
                "secondary": "L",
                "description": "Leisure",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL01",
                "primary": "C",
                "secondary": "L",
                "tertiary": "01",
                "description": "Amusements",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL02",
                "primary": "C",
                "secondary": "L",
                "tertiary": "02",
                "description": "Holiday/camp sites",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL03",
                "primary": "C",
                "secondary": "L",
                "tertiary": "03",
                "description": "Libraries",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL04",
                "primary": "C",
                "secondary": "L",
                "tertiary": "04",
                "description": "Museums",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL05",
                "primary": "C",
                "secondary": "L",
                "tertiary": "05",
                "description": "Nightclubs",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL06",
                "primary": "C",
                "secondary": "L",
                "tertiary": "06",
                "description": "Sporting activities e.g leisure centre, golf course",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL07",
                "primary": "C",
                "secondary": "L",
                "tertiary": "07",
                "description": "Theatres/arenas/stadium",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL08",
                "primary": "C",
                "secondary": "L",
                "tertiary": "08",
                "description": "Zoos and theme parks",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CL09",
                "primary": "C",
                "secondary": "L",
                "tertiary": "09",
                "description": "Beach huts (recreational, non residential use only)",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CL10",
                "primary": "C",
                "secondary": "L",
                "tertiary": "10",
                "description": "Licensed private members' clubs",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CL11",
                "primary": "C",
                "secondary": "L",
                "tertiary": "11",
                "description": "Arenas and stadia",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CM",
                "primary": "C",
                "secondary": "M",
                "description": "Medical",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CM01",
                "primary": "C",
                "secondary": "M",
                "tertiary": "01",
                "description": "Dentist",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CM02",
                "primary": "C",
                "secondary": "M",
                "tertiary": "02",
                "description": "GP surgeries and clinics",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CM03",
                "primary": "C",
                "secondary": "M",
                "tertiary": "03",
                "description": "Hospitals",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CM04",
                "primary": "C",
                "secondary": "M",
                "tertiary": "04",
                "description": "Medical laboratories",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CM05",
                "primary": "C",
                "secondary": "M",
                "tertiary": "05",
                "description": "Professional medical services",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CN",
                "primary": "C",
                "secondary": "N",
                "description": "Animal Centre",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CN01",
                "primary": "C",
                "secondary": "N",
                "tertiary": "01",
                "description": "Catteries",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CN02",
                "primary": "C",
                "secondary": "N",
                "tertiary": "02",
                "description": "Kennels",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CN03",
                "primary": "C",
                "secondary": "N",
                "tertiary": "03",
                "description": "Stables",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CN04",
                "primary": "C",
                "secondary": "N",
                "tertiary": "04",
                "description": "Vet",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CN05",
                "primary": "C",
                "secondary": "N",
                "tertiary": "05",
                "description": "Animal Sanctuary",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CO",
                "primary": "C",
                "secondary": "O",
                "description": "Offices",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CO01",
                "primary": "C",
                "secondary": "O",
                "tertiary": "01",
                "description": "Offices and work studios",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CO02",
                "primary": "C",
                "secondary": "O",
                "tertiary": "02",
                "description": "Broadcasting (TV, Radio)",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR",
                "primary": "C",
                "secondary": "R",
                "description": "Retail",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR01",
                "primary": "C",
                "secondary": "R",
                "tertiary": "01",
                "description": "Banks/financial services",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR02",
                "primary": "C",
                "secondary": "R",
                "tertiary": "02",
                "description": "Estate agents",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR03",
                "primary": "C",
                "secondary": "R",
                "tertiary": "03",
                "description": "Hairdressing/beauty salon",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR04",
                "primary": "C",
                "secondary": "R",
                "tertiary": "04",
                "description": "Markets (indoor & outdoor)",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR05",
                "primary": "C",
                "secondary": "R",
                "tertiary": "05",
                "description": "Petrol Filling stations",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR06",
                "primary": "C",
                "secondary": "R",
                "tertiary": "06",
                "description": "Public houses and bars",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR07",
                "primary": "C",
                "secondary": "R",
                "tertiary": "07",
                "description": "Restaurants and cafes",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR08",
                "primary": "C",
                "secondary": "R",
                "tertiary": "08",
                "description": "Shops",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR09",
                "primary": "C",
                "secondary": "R",
                "tertiary": "09",
                "description": "Betting offices",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CR10",
                "primary": "C",
                "secondary": "R",
                "tertiary": "10",
                "description": "Fast food outlets / takeaways (hot and cold)",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CR11",
                "primary": "C",
                "secondary": "R",
                "tertiary": "11",
                "description": "Automated Teller Machines (ATMs)",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CS",
                "primary": "C",
                "secondary": "S",
                "description": "Storage land",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CS01",
                "primary": "C",
                "secondary": "S",
                "tertiary": "01",
                "description": "General storage land",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CS02",
                "primary": "C",
                "secondary": "S",
                "tertiary": "02",
                "description": "Builders? yards",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CT",
                "primary": "C",
                "secondary": "T",
                "description": "Transport",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT01",
                "primary": "C",
                "secondary": "T",
                "tertiary": "01",
                "description": "Airports",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT02",
                "primary": "C",
                "secondary": "T",
                "tertiary": "02",
                "description": "Bus shelters",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT03",
                "primary": "C",
                "secondary": "T",
                "tertiary": "03",
                "description": "Car parks",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT04",
                "primary": "C",
                "secondary": "T",
                "tertiary": "04",
                "description": "Goods freight handling",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT05",
                "primary": "C",
                "secondary": "T",
                "tertiary": "05",
                "description": "Marinas, harbours and ports",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT06",
                "primary": "C",
                "secondary": "T",
                "tertiary": "06",
                "description": "Moorings",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT07",
                "primary": "C",
                "secondary": "T",
                "tertiary": "07",
                "description": "Railway assets",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT08",
                "primary": "C",
                "secondary": "T",
                "tertiary": "08",
                "description": "Stations and interchanges",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT09",
                "primary": "C",
                "secondary": "T",
                "tertiary": "09",
                "description": "Transport tracks and ways",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT10",
                "primary": "C",
                "secondary": "T",
                "tertiary": "10",
                "description": "Vehicle storage",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT11",
                "primary": "C",
                "secondary": "T",
                "tertiary": "11",
                "description": "Other waterway infrastructure not part of 05/06",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CT12",
                "primary": "C",
                "secondary": "T",
                "tertiary": "12",
                "description": "Overnight lorry park",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CT13",
                "primary": "C",
                "secondary": "T",
                "tertiary": "13",
                "description": "Harbours, ports, docks, slipways, landing stages and piers",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CU",
                "primary": "C",
                "secondary": "U",
                "description": "Utilities",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU01",
                "primary": "C",
                "secondary": "U",
                "tertiary": "01",
                "description": "Electricity sub-stations",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU02",
                "primary": "C",
                "secondary": "U",
                "tertiary": "02",
                "description": "Landfill",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU03",
                "primary": "C",
                "secondary": "U",
                "tertiary": "03",
                "description": "Power stations/energy production",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU04",
                "primary": "C",
                "secondary": "U",
                "tertiary": "04",
                "description": "Pumping Stations/Water Towers",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU05",
                "primary": "C",
                "secondary": "U",
                "tertiary": "05",
                "description": "Recycling sites",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU06",
                "primary": "C",
                "secondary": "U",
                "tertiary": "06",
                "description": "Telecommunications masts",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU07",
                "primary": "C",
                "secondary": "U",
                "tertiary": "07",
                "description": "Water/sewage treatment works",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CU08",
                "primary": "C",
                "secondary": "U",
                "tertiary": "08",
                "description": "Gas and Oil Storage and Distribution",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CU09",
                "primary": "C",
                "secondary": "U",
                "tertiary": "09",
                "description": "Other utility use",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CU10",
                "primary": "C",
                "secondary": "U",
                "tertiary": "10",
                "description": "Waste management",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CU11",
                "primary": "C",
                "secondary": "U",
                "tertiary": "11",
                "description": "Telephone boxes",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CU12",
                "primary": "C",
                "secondary": "U",
                "tertiary": "12",
                "description": "Dams",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX",
                "primary": "C",
                "secondary": "X",
                "description": "Emergency and Rescue Services",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX01",
                "primary": "C",
                "secondary": "X",
                "tertiary": "01",
                "description": "Police Station",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX02",
                "primary": "C",
                "secondary": "X",
                "tertiary": "02",
                "description": "Fire Station",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX03",
                "primary": "C",
                "secondary": "X",
                "tertiary": "03",
                "description": "Ambulance Station",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX04",
                "primary": "C",
                "secondary": "X",
                "tertiary": "04",
                "description": "Lifeboat Station",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX05",
                "primary": "C",
                "secondary": "X",
                "tertiary": "05",
                "description": "Coastguard Station",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX06",
                "primary": "C",
                "secondary": "X",
                "tertiary": "06",
                "description": "Mountain Rescue Station",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX07",
                "primary": "C",
                "secondary": "X",
                "tertiary": "07",
                "description": "Lighthouse",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CX08",
                "primary": "C",
                "secondary": "X",
                "tertiary": "08",
                "description": "Police Box / Police Kiosk",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "CZ",
                "primary": "C",
                "secondary": "Z",
                "description": "Information",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CZ01",
                "primary": "C",
                "secondary": "Z",
                "tertiary": "01",
                "description": "Advertising Hoardings",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CZ02",
                "primary": "C",
                "secondary": "Z",
                "tertiary": "02",
                "description": "Tourist Information",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "CZ03",
                "primary": "C",
                "secondary": "Z",
                "tertiary": "03",
                "description": "Traffic Information",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "L",
                "primary": "L",
                "description": "Land",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "L01",
                "primary": "L",
                "secondary": "0",
                "tertiary": "1",
                "description": "Vacant or derelict land",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LA",
                "primary": "L",
                "secondary": "A",
                "description": "Agricultural",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LA01",
                "primary": "L",
                "secondary": "A",
                "tertiary": "01",
                "description": "Grazing land",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LA02",
                "primary": "L",
                "secondary": "A",
                "tertiary": "02",
                "description": "Permanent crops or crop rotation",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LB",
                "primary": "L",
                "secondary": "B",
                "description": "Ancillary Buildings",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "LC",
                "primary": "L",
                "secondary": "C",
                "description": "Cemeteries",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LC01",
                "primary": "L",
                "secondary": "C",
                "tertiary": "01",
                "description": "Active and disused graveyards",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LD",
                "primary": "L",
                "secondary": "D",
                "description": "Development",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LD01",
                "primary": "L",
                "secondary": "D",
                "tertiary": "01",
                "description": "Development sites",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LF",
                "primary": "L",
                "secondary": "F",
                "description": "Forestry",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LF01",
                "primary": "L",
                "secondary": "F",
                "tertiary": "01",
                "description": "Orchards",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LF02",
                "primary": "L",
                "secondary": "F",
                "tertiary": "02",
                "description": "Forests (managed & unmanaged)",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LF03",
                "primary": "L",
                "secondary": "F",
                "tertiary": "03",
                "description": "Woodlands",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LL",
                "primary": "L",
                "secondary": "L",
                "description": "Allotments",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LM",
                "primary": "L",
                "secondary": "M",
                "description": "Amenity",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LM01",
                "primary": "L",
                "secondary": "M",
                "tertiary": "01",
                "description": "Roundabouts",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LM02",
                "primary": "L",
                "secondary": "M",
                "tertiary": "02",
                "description": "Verges",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LM03",
                "primary": "L",
                "secondary": "M",
                "tertiary": "03",
                "description": "Maintained amenity land",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "LM04",
                "primary": "L",
                "secondary": "M",
                "tertiary": "04",
                "description": "Maintained surfaced area",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "LO",
                "primary": "L",
                "secondary": "O",
                "description": "Open Space",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "LO01",
                "primary": "L",
                "secondary": "O",
                "tertiary": "01",
                "description": "Heaths and Moorland",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "LP",
                "primary": "L",
                "secondary": "P",
                "description": "Parks",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LP01",
                "primary": "L",
                "secondary": "P",
                "tertiary": "01",
                "description": "Public gardens",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LP02",
                "primary": "L",
                "secondary": "P",
                "tertiary": "02",
                "description": "Public open spaces, e.g. heaths and parks",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LP03",
                "primary": "L",
                "secondary": "P",
                "tertiary": "03",
                "description": "Public Playgrounds and recreation",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LP04",
                "primary": "L",
                "secondary": "P",
                "tertiary": "04",
                "description": "Private parks and gardens",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "LU",
                "primary": "L",
                "secondary": "U",
                "description": "Unused",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LU01",
                "primary": "L",
                "secondary": "U",
                "tertiary": "01",
                "description": "Vacant or derelict land",
                "added_date": "02-DEC-10"
            },
            {
                "blpu_class": "LW",
                "primary": "L",
                "secondary": "W",
                "description": "Water",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LW01",
                "primary": "L",
                "secondary": "W",
                "tertiary": "01",
                "description": "Lakes and reservoirs",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LW02",
                "primary": "L",
                "secondary": "W",
                "tertiary": "02",
                "description": "Ponds",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "LW03",
                "primary": "L",
                "secondary": "W",
                "tertiary": "03",
                "description": "Waterways (canals and rivers)",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "M",
                "primary": "M",
                "description": "Military",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "MA",
                "primary": "M",
                "secondary": "A",
                "description": "Army",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "MB",
                "primary": "M",
                "secondary": "B",
                "description": "Ancillary buildings",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "MF",
                "primary": "M",
                "secondary": "F",
                "description": "Air Force",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "MG",
                "primary": "M",
                "secondary": "G",
                "description": "Government",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "MN",
                "primary": "M",
                "secondary": "N",
                "description": "Navy",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "P",
                "primary": "P",
                "description": "Parent Shell",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "PP",
                "primary": "P",
                "secondary": "P",
                "description": "Property Shell Terrace, block",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "PS",
                "primary": "P",
                "secondary": "S",
                "description": "Street BLPU",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "R",
                "primary": "R",
                "description": "Residential",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RB",
                "primary": "R",
                "secondary": "B",
                "description": "Ancillary buildings",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RC",
                "primary": "R",
                "secondary": "C",
                "description": "Car park spaces",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RC01",
                "primary": "R",
                "secondary": "C",
                "tertiary": "01",
                "description": "Allocated parking",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RD",
                "primary": "R",
                "secondary": "D",
                "description": "Dwellings",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD01",
                "primary": "R",
                "secondary": "D",
                "tertiary": "01",
                "description": "Caravans",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD02",
                "primary": "R",
                "secondary": "D",
                "tertiary": "02",
                "description": "Detached House",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD03",
                "primary": "R",
                "secondary": "D",
                "tertiary": "03",
                "description": "Semi-detached House",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD04",
                "primary": "R",
                "secondary": "D",
                "tertiary": "04",
                "description": "Terraced House",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD05",
                "primary": "R",
                "secondary": "D",
                "tertiary": "05",
                "description": "Bungalow",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD06",
                "primary": "R",
                "secondary": "D",
                "tertiary": "06",
                "description": "Flat",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD07",
                "primary": "R",
                "secondary": "D",
                "tertiary": "07",
                "description": "House boats",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD08",
                "primary": "R",
                "secondary": "D",
                "tertiary": "08",
                "description": "Sheltered accommodation",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD09",
                "primary": "R",
                "secondary": "D",
                "tertiary": "09",
                "description": "HMO",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RD10",
                "primary": "R",
                "secondary": "D",
                "tertiary": "10",
                "description": "Privately owned holiday caravans and chalets",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RG",
                "primary": "R",
                "secondary": "G",
                "description": "Garages",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RG01",
                "primary": "R",
                "secondary": "G",
                "tertiary": "01",
                "description": "Allocated parking spaces",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RG02",
                "primary": "R",
                "secondary": "G",
                "tertiary": "02",
                "description": "Lock-up garages and garage courts",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RH",
                "primary": "R",
                "secondary": "H",
                "description": "House in Multiple Occupation",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RH01",
                "primary": "R",
                "secondary": "H",
                "tertiary": "01",
                "description": "HMO Parent",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RH02",
                "primary": "R",
                "secondary": "H",
                "tertiary": "02",
                "description": "HMO bedsits / Other Non Self Contained Accommodation",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RH03",
                "primary": "R",
                "secondary": "H",
                "tertiary": "03",
                "description": "HMO not further divided",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "RI",
                "primary": "R",
                "secondary": "I",
                "description": "Residential Institutions",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RI01",
                "primary": "R",
                "secondary": "I",
                "tertiary": "01",
                "description": "Care homes",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RI02",
                "primary": "R",
                "secondary": "I",
                "tertiary": "02",
                "description": "Communal residences",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "RI03",
                "primary": "R",
                "secondary": "I",
                "tertiary": "03",
                "description": "Residential education (e.g. halls of residence)",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "U",
                "primary": "U",
                "description": "Unclassified",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "UC",
                "primary": "U",
                "secondary": "C",
                "description": "Awaiting Classification",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "UP",
                "primary": "U",
                "secondary": "P",
                "description": "Pending Internal Investigation",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "X",
                "primary": "X",
                "description": "Mixed",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "Z",
                "primary": "Z",
                "description": "Features",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZA",
                "primary": "Z",
                "secondary": "A",
                "description": "Archaeological Dig Sites",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZM",
                "primary": "Z",
                "secondary": "M",
                "description": "Monuments",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZM01",
                "primary": "Z",
                "secondary": "M",
                "tertiary": "01",
                "description": "Obelisks/Milestones/standing stones",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZM02",
                "primary": "Z",
                "secondary": "M",
                "tertiary": "02",
                "description": "Memorials and market crosses",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZM03",
                "primary": "Z",
                "secondary": "M",
                "tertiary": "03",
                "description": "Statues",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZM04",
                "primary": "Z",
                "secondary": "M",
                "tertiary": "04",
                "description": "Castles and historic ruins",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZM05",
                "primary": "Z",
                "secondary": "M",
                "tertiary": "05",
                "description": "Other structure",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "ZS",
                "primary": "Z",
                "secondary": "S",
                "description": "Stately homes",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "ZU",
                "primary": "Z",
                "secondary": "U",
                "description": "Underground Features",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZU01",
                "primary": "Z",
                "secondary": "U",
                "tertiary": "01",
                "description": "Caves",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZU02",
                "primary": "Z",
                "secondary": "U",
                "tertiary": "02",
                "description": "Cellars",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZU03",
                "primary": "Z",
                "secondary": "U",
                "tertiary": "03",
                "description": "Disused mines",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZU04",
                "primary": "Z",
                "secondary": "U",
                "tertiary": "04",
                "description": "Potholes",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZU05",
                "primary": "Z",
                "secondary": "U",
                "tertiary": "05",
                "description": "Wells and springs",
                "added_date": "23-JUN-10"
            },
            {
                "blpu_class": "ZV",
                "primary": "Z",
                "secondary": "V",
                "description": "Other Underground Features",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "ZV01",
                "primary": "Z",
                "secondary": "V",
                "tertiary": "01",
                "description": "Cellars",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "ZV02",
                "primary": "Z",
                "secondary": "V",
                "tertiary": "02",
                "description": "Disused mines",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "ZV03",
                "primary": "Z",
                "secondary": "V",
                "tertiary": "03",
                "description": "Wells and springs",
                "added_date": "21-OCT-13"
            },
            {
                "blpu_class": "ZW",
                "primary": "Z",
                "secondary": "W",
                "description": "Places of Worship",
                "added_date": "23-JUN-10"
            }
        ]
    }
}
