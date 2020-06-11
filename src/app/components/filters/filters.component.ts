import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Filter_Dates } from '../../model/data_batch';

declare let d3: any;

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  filter_dates:Filter_Dates={
    filter_st_dt:new Date(2017,0,1),
    filter_ed_dt:new Date()
  };

  @Output() new_dates: EventEmitter<Filter_Dates> = new EventEmitter()

  constructor() { 
    
  }
  
  ngOnInit() {
    this.new_dates.emit(this.filter_dates)
  }

  ngAfterContentInit() {
    
    }

    displaydates(e){
      this.new_dates.emit(this.filter_dates)
    }
}
