import { Component, OnInit,EventEmitter,Output, ViewEncapsulation } from '@angular/core';
import { Data_Batch, Filter_Dates } from '../../model/data_batch';
import {DataService} from '../../services/data.service';
import { Observable } from 'rxjs';


declare let d3: any;

@Component({
  encapsulation:ViewEncapsulation.None,
  selector: 'app-preprocess',
  templateUrl: './preprocess.component.html',
  styleUrls: ['./preprocess.component.css']
})
export class PreprocessComponent implements OnInit {
data_batch: Data_Batch[];
promise_st;
filtered_data;
transformed_data;
  
constructor(private dataService: DataService) { }

ngOnInit() {
    this.promise_st=this.dataService.agetdata()
  }

ngAfterContentInit() {
    // this.pie_chart_maker()
    // this.grouped_chart_maker()
    // this.line_chart_maker()
  }

filter_data(filter_dates: Filter_Dates){
    this.filtered_data=this.promise_st.then(function(datat_v1){
      var fil_data_array=[];
      datat_v1.forEach(function(d){
          var st_dt=new Date(d['Start date'])
          var ed_dt=new Date(d['End Date'])  
          if (st_dt>=filter_dates.filter_st_dt && ed_dt<=filter_dates.filter_ed_dt) {
            fil_data_array.push(d)
          }
      }
      )
      return fil_data_array
  }
  )
  this.data_transformer()
  console.log(this.transformed_data)
  document.querySelector("#piechart").innerHTML=''
  document.querySelector("#linechart").innerHTML=''
  document.querySelector("#groupedbarchart").innerHTML=''
  this.pie_chart_maker()
  this.grouped_chart_maker()
  this.line_chart_maker()
  }

 data_transformer(){
  this.transformed_data=this.filtered_data.then(function(datat_v1){
  var ets=0,ats=0,ecb=0,acb=0,ead=0,aad=0,eap=0,aap=0,ecr=0,acr=0,erp=0,arp=0,eip=0,aip=0;
  var speed_ts=[],speed_cb=[],speed_ad=[],speed_ap=[],speed_cr=[],speed_rp=[],speed_ip=[];

    datat_v1.forEach(function(d){
            var batch_id=d['batch']
            d.records.forEach(function(rec){
                if(rec.Process=='Template screen'){
                  ets=ets+rec['Estimated time']
                  ats=ats+rec['Actual time taken']
                  speed_ts.push({"batch_id": batch_id,"speed": rec['Station_speed']})
                }
                else if(rec.Process=='Create batch'){
                  ecb=ecb+rec['Estimated time']
                  acb=acb+rec['Actual time taken']
                  speed_cb.push({"batch_id": batch_id,"speed": rec['Station_speed']})
                }
                else if(rec.Process=='Alternate drug'){
                  ead=ead+rec['Estimated time']
                  aad=aad+rec['Actual time taken']
                  speed_ad.push({"batch_id": batch_id,"speed": rec['Station_speed']})
                }
                else if(rec.Process=='Adv Pre-process'){
                  eap=eap+rec['Estimated time']
                  aap=aap+rec['Actual time taken']
                  speed_ap.push({"batch_id": batch_id,"speed": rec['Station_speed']})
                }
                else if(rec.Process=='Cannister recomm'){
                  ecr=ecr+rec['Estimated time']
                  acr=acr+rec['Actual time taken']
                  speed_cr.push({"batch_id": batch_id,"speed": rec['Station_speed']})
                }
                else if(rec.Process=='Replenish'){
                  erp=erp+rec['Estimated time']
                  arp=arp+rec['Actual time taken']
                  speed_rp.push({"batch_id": batch_id,"speed": rec['Station_speed']})
                }
                else if(rec.Process=='Import packs'){
                  eip=eip+rec['Estimated time']
                  aip=aip+rec['Actual time taken']
                  speed_ip.push({"batch_id": batch_id,"speed": rec['Station_speed']})
                }
            })
  
        }
    )
var data_v1a=[{"type": "Template screen","number": ats},
         {"type": "Create batch","number": acb},
         {"type": "Alternate drug","number": aad},
         {"type": "Adv Pre-process","number": aap},
         {"type": "Cannister recomm","number": acr},
         {"type": "Replenish","number": arp},
         {"type": "Import packs","number": aip}]
var data_v1b=[{"Process": "Template screen", "Estimated time": ets,"Actual time taken": ats},
         {"Process": "Create batch","Estimated time": ecb,"Actual time taken": acb},
         {"Process": "Alternate drug","Estimated time": ead,"Actual time taken": aad},
         {"Process": "Adv Pre-process","Estimated time": eap,"Actual time taken": aap},
         {"Process": "Cannister recomm","Estimated time": ecr,"Actual time taken": acr},
         {"Process": "Replenish","Estimated time": erp,"Actual time taken": arp},  
         {"Process": "Import packs","Estimated time": eip,"Actual time taken": aip}]
var data_v1c=[{"process_type": "Template screen","records": speed_ts},
         {"process_type": "Create batch","records": speed_cb},
         {"process_type": "Alternate drug","records": speed_ad},
         {"process_type": "Adv Pre-process","records": speed_ap},
         {"process_type": "Cannister recomm","records": speed_cr},
         {"process_type": "Replenish","records": speed_rp},
         {"process_type": "Import packs","records": speed_ip}] 

var data_v1=[data_v1a,data_v1b,data_v1c]
return data_v1
}
)
}
  pie_chart_maker(){
    var width = 640,height = 250;
          var spacing  = 60;
          var radius = Math.min(width, height) / 2 - spacing*.5; //make spacing smaller if text can be wrapped  to make a longer line
      
          var svg_pie = d3.select("#piechart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "rgb(230,230,230)")
            // .append("g")
            .attr("transform", "translate(0,0)"); //to move svg wholetogether with figure
      
            var width = 650 - 2*spacing; //to move figure inside svg //also alter the size towards the left
          var height = 250 - .2*spacing;
      
          // var data_v3= d3.json("https://gist.githubusercontent.com/Vvgupta/020e708b412563a30285c4d36a1cbe93/raw/233cd7f08c6206e548d980954bdb668c2b10dc5b/view-2_donut.json")
      
      var data_v3=this.transformed_data.then(function(d){
        console.log(d[0])
        return d[0]
      })

      data_v3.then(function(data_pie){
          data_pie.forEach(function(d){
        
          d.number = +d.number;
              });
      
          var data = d3.pie().sort(null).value(function(d) {
            return d.number;  //d.number return the number value from data array, sort is for order
          })(data_pie);
      
      //generate segments in the circle with the help of arc generator
          var segments = d3.arc()
            .innerRadius(width/25)
            .outerRadius(width/6);
      
      // Another arc that won't be drawn. Just for labels positioning
          var outerArc = d3.arc()
            .innerRadius(radius * 1)
            .outerRadius(radius * 1);
      // console.log(width/6); //console.log(radius);
          var colors = d3.scaleOrdinal(["#FFE26D", "#063851", "#ff0000", "#24e185", "#8a03e4", "#7451ec", "#a66563"]); //d3.schemeCategory10
      
          var sections = svg_pie.append("g")
          .attr("transform", "translate("+ (width/1.8) + "," + (width/4) + ")") //moving figure inside svg
          //.attr("id", "circleBasicTooltip")
            .selectAll("path")
            .data(data);
      
      
          sections.enter()
            .append("path")
            .attr("d", segments)
            .attr("fill", function(d,i) {return colors(i);})
            .on("mouseover", function(d){
                var total= d3.sum(data.map(function(d){return d.data.number;}))
                var percent = Math.round(10000*d.data.number/total)/100;
                var position = d3.mouse(d3.select("#piechart").node());
                // var x=[20,200];
                d3.select("#piechart").append("div").classed("tooltip1",true)
                .style("left",position[0]+"px")
                .style("top", position[1]+"px")
                .html(d.data.type + " <br/> " + percent + "%");
                })
      
              .on("mouseout", function(){
                d3.select(".tooltip1").remove();
              });
      
      //static tooltip code//
      //adding the polylines between chart and labels//
      sections.enter()
            .append("polyline")
            .attr("stroke", function(d,i) {return colors(i);}) //or just give it any color, & it will start from centroid of pie. segments.
            .style("fill", "none")
            .attr("stroke-width", 1.5)
            .attr('points', function(d) {
              var posA = segments.centroid(d) // line insertion in the slice
              var posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
              var posC = outerArc.centroid(d); // Label position = almost the same as posB
              var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
              posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
              return [posA, posB, posC]
            })
      
      
      //adding the labels at the centroid//
      sections.enter()
            .append("text")
            .html(function(d){ 
              var total= d3.sum(data.map(function(d){return d.data.number;}))
              var percent = Math.round(10000*d.data.number/total)/100;
              return (d.data.type + " " + percent + "%")})
            .attr("transform", function(d) { 
                    var pos = outerArc.centroid(d);
                    var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                    pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                    return 'translate(' + pos + ')';
                    })
                    .style('text-anchor', function(d) {
                        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
                        return (midangle < Math.PI ? 'start' : 'end')
                    })
      
      //adding heading
            svg_pie.append("text")
            .attr("x", (width/ 2)+30)             
            .attr("y", (spacing/2)-10)
            .attr("text-anchor", "middle")
            //.attr("font", "sans-serif")  
            .style("font-size", "16px") 
            .style("font-weight","bold")
            .text("Distribution of time across processes");
      
          });
        }

grouped_chart_maker(){
  
          var width = 660,
              height = 250;
          var margin1 = { top: 40, right: 40, bottom: 40, left: 40 };
      
          var svg_grouped = d3.select("#groupedbarchart").append("svg")
                      .attr("width", width).attr("height", height)
                      .style("background", "rgb(230,230,230)")
                      // .append("g")
                      .attr("transform", "translate(0,0)");
      
      
      
          // Define margins, dimensions of g
          var width = 630 - margin1.left - margin1.right;
          var height = 250 - margin1.top - margin1.bottom;
      // let times
          // Load the data and draw a chart
          // var data_v4=d3.json('https://gist.githubusercontent.com/Vvgupta/020e708b412563a30285c4d36a1cbe93/raw/4f3e0148ae630c67a5ac652e07301ea56f38289d/view-2_grouped.json')
          
          var data_v4=this.transformed_data.then(function(d){
            return d[1]
            })

            data_v4.then(function (data) {
           
            var processNames = data.map(function(d) { return d.Process; }); //for domain of axis x0
            var timeTypes = d3.keys(data[0]).filter(function(aFunction){return aFunction !== "Process";}); //for domain of axis x1 //keys
            data.forEach(function(d) {d.times = timeTypes.map(function(name) { 
                                                        return {name: name, 
                                                                value: +d[name]}; }); }); //d.value is same as d['value']. But not same as d[value]. Here value is a variable. So if value = 'x' Then d[value] means d.x
        
      
      
      //TO GET ALL NUMBERS IN THE DIFFERENT ARRAYS
      // var et = d3.keys(data[0]).filter(function(aFunction){return aFunction == "Estimated time";}); 
      // var att = d3.keys(data[0]).filter(function(aFunction){return aFunction == "Actual time taken";}); 
      // console.log(et);
      
      // var et =  data.map(function(d) { return d['Estimated time']; }); //https://stackoverflow.com/questions/14960850/d3-js-selecting-key-with-a-space-in-the-name
      // console.log(et);                         
      // var att =  data.map(function(d) { return d['Actual time taken']; });
      // console.log(att);  
      
      // var differences_arr = [];
      // for(let i = 0; i < et.length; i++) {
      //   differences_arr.push(et[i] - att[i]); //https://stackoverflow.com/questions/36161457/how-to-subtract-elements-of-two-arrays-and-store-the-result-as-positive-array-in
      // }
      // console.log(differences_arr);
      
      
      var extra_time_taken_dataset = data.map(function(d,i) {
                          if (d['Estimated time'] < d['Actual time taken'])
                                    return {
                                      // index: i + 1,
                                      'Process': d['Process'],
                                      'Estimated time': d['Estimated time'],
                                      'Actual time taken': d['Actual time taken'],
                                      difference: (d['Actual time taken']-d['Estimated time'] ),
                                    }
                                    else return{
                                      'Process': d['Process'],
                                      'Estimated time': d['Estimated time'],
                                      'Actual time taken': d['Actual time taken'],
                                    };
                                    });
                                    console.log(data);
                                    console.log(extra_time_taken_dataset);
      
      var difference_word = d3.keys(extra_time_taken_dataset[0]).filter(function(aFunction){return aFunction == "difference";}); 
      // console.log(difference_word)
      extra_time_taken_dataset.forEach(function(d) {d['Extra Time Taken'] = difference_word.map(function(name, larger) { 
                                                                            return {name: name, 
                                                                              larger: Math.max(d['Estimated time'],d['Actual time taken']),
                                                                              value: +d[name]}; }); })
      
      
      var time_saved_dataset = data.map(function(d,i) {
                          if (d['Estimated time'] > d['Actual time taken'])
      
                                    return {
      
                                      // index: i + 1,
                                      'Process': d['Process'],
                                      'Estimated time': d['Estimated time'],
                                      'Actual time taken': d['Actual time taken'],
                                      difference: (d['Estimated time'] - d['Actual time taken']),
                                    }
                                    else return{
                                      'Process': d['Process'],
                                      'Estimated time': d['Estimated time'],
                                      'Actual time taken': d['Actual time taken'],
                                    };
                                    });
                                    console.log(time_saved_dataset);
      
      time_saved_dataset.forEach(function(d) {d['Time Saved'] = difference_word.map(function(name) { 
                                                                            return {name: name, 
                                                                              larger: Math.max(d['Estimated time'],d['Actual time taken']),
                                                                              value: +d[name]}; }); })
      
      
      var chart1 = d3.select('#groupedbarchart').select('svg').append('g')
                          .attr("width", width).attr("height", height)
                          .attr('transform', 'translate(' + margin1.left + ',' + (margin1.top/3) + ')');
      
            // var tooltip = d3.select('#linechart').append('div').attr("id", "tooltip2")
            // var tooltipLine = chart.append('line');
      
            // var sArray = d.map(item => item.'Estimated time')
      
            // Define the scales and tell D3 how to draw the line
            var x0 = d3.scaleBand().domain(processNames).rangeRound([0, width]).paddingInner([0.3]);  //
            var x1 = d3.scaleBand().domain(timeTypes).rangeRound([0, x0.bandwidth()]);  //
            var x2 = d3.scaleBand().domain(difference_word).rangeRound([x0.bandwidth()/4, x0.bandwidth()]);         //for stacked part extra time #red
            var x3 = d3.scaleBand().domain(difference_word).rangeRound([x0.bandwidth()/2, x0.bandwidth()]);         //for stacked part saved time #green
            var y_scale_max_val=d3.max(data, function(d) {
              return d3.max(d.times, function(d) { 
                                  return d.value })
            })
            var y = d3.scaleLinear().domain([0, 
              Math.ceil(y_scale_max_val*1.2)]).range([height,0]);
            // var y = d3.scaleLinear().domain([0, 12]).range([0,height]);
            var color = d3.scaleOrdinal().range(["#FFE26D", "#063851"]);
            var color_extra = d3.scaleOrdinal().range(["#FF0000"]);
            var color_saved = d3.scaleOrdinal().range(["#00ff00"]);
      
      
      
            // Add the axes and a title
            var xAxis = d3.axisBottom(x0);
            var yAxis = d3.axisLeft(y);
            chart1.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis.tickSize(0)).select(".domain").remove();
                  chart1.selectAll("text")  
                  .style("text-anchor", "start")
                  .attr("dx", ".3em")
                  .attr("dy", "0.5em")
                  .style("color", "black")
                  .attr("transform", "rotate(20)")
            // .selectAll('.domain, .tick line').remove(); //not working
            chart1.append('g').call(yAxis);
      
      
      //main bars
       var bars = chart1.selectAll()
                .data(data).enter().append('g')
                .attr("width", width).attr("height", height)
                .attr('transform', function(d) { return "translate(" + x0(d.Process) + ",0)"; });
      
      bars.selectAll()
            .data(function(d) {
              console.log(d.times);
              return d.times; })    
            .enter().append('rect')
            .attr("x", function(d) { return x1(d.name); })
            .attr("width", x1.bandwidth())
            .attr("fill", function(d) { return color(d.name); })
            .attr("y", function(d) { return y(d.value); })
            .attr('height', function( d ) { return height - y(d.value); });
            
       bars.selectAll().data(function(d) {return d.times;})
             .enter().append("text")
                  .text(function(d){return d.value;})
                  // .style('stroke',"black")   //if else has to be applied
                  .style("stroke",function(d){
                    if(d.name == "Estimated time"){ return "red"} 
                    else { return "white"}
                  ;})
                  .style("font-size", "9px")
                  .attr("text-anchor", "middle")
                  .attr("x", function(d) { return x1(d.name)+15; })
                  .attr("y", function(d){return  y(d.value)+12;});
      
      //stacked bars //extra //red
      var extra_time_taken_bars = chart1.selectAll()
                .data(extra_time_taken_dataset).enter().append('g')
                .attr("width", width).attr("height", height)
                .attr('transform', function(d) { return "translate(" + x0(d.Process) + ",0)"; });
      
       extra_time_taken_bars.selectAll()
            .data(function(d) {return d['Extra Time Taken']; })    
            .enter().append('rect')
            .attr("x", function(d) { return x2(d.name); })
            .attr("width", x2.bandwidth()/3)
            .attr("fill", function(d) { return color_extra(d.name); })
            .attr("y", function(d) { return y(d.larger); })  
            .attr('height', function( d ) { return height - y(d.value); })
      
        extra_time_taken_bars.selectAll().data(function(d) {return d['Extra Time Taken'];})
             .enter().append("text")
                  .text(function(d){
                    if (d.value){ return d.value}
                    else {}
                  })
                  .style('stroke', 'black')
                  .style("font-size", "9px")
                  .attr("text-anchor", "middle")
                  .attr("x", function(d) { return x2(d.name)+8; })
                  .attr("y", function(d){return  y(d.larger)-5;});
      //stacked bars //saved //green
      var time_saved_bars = chart1.selectAll()
                .data(time_saved_dataset).enter().append('g')
                .attr("width", width).attr("height", height)
                .attr('transform', function(d) { return "translate(" + x0(d.Process) + ",0)"; });
      
      
      time_saved_bars.selectAll()
            .data(function(d) {return d['Time Saved']; })    
            .enter().append('rect')
            .attr("x", function(d) { return x3(d.name); }) 
            .attr("width", x3.bandwidth()/2)
            .attr("fill", function(d) { return color_saved(d.name); })
            .attr("y", function(d) { return y(d.larger); })  
            .attr('height', function( d ) { return height - y(d.value); })
      
       time_saved_bars.selectAll().data(function(d) {return d['Time Saved'];})
             .enter().append("text")
                  .text(function(d){
                    if (d.value){ return d.value}
                    else {}
                  })
                  .style('stroke', 'black')
                  .style("font-size", "9px")
                  .attr("text-anchor", "middle")
                  .attr("x", function(d) { return x3(d.name)+5; })
                  .attr("y", function(d){return  y(d.larger)-5;});
      
      //LEGENDS
      var legends_main = chart1.selectAll()
                .data(timeTypes.slice())
                .enter().append('g')
                .attr("width", width).attr("height", height)
                .attr('transform', function(d,i) { return "translate(" +  i * 125 + ",20)"; });
      
      legends_main.append("rect")
            .attr("x", width/30) 
            .attr("y", height*1.1)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", color);
      
      legends_main.append("text")
            .attr("x", width/30+10)
            .attr("y", height*1.1)
            .attr("dy", ".7em")
            .style("font-size", "12px") 
            // .style("text-anchor", "start")
            .text(function(d) { return d; });
      
      
      var timeTypes_extra = d3.keys(extra_time_taken_dataset[0]).filter(function(aFunction){return aFunction == "Extra Time Taken";});
      var legend_extra_time_taken = chart1.selectAll()
                .data(timeTypes_extra)
                .enter().append('g')
                .attr("width", width).attr("height", height)
                .attr('transform',  "translate(0,20)" )
      
      legend_extra_time_taken.append("rect")
            .attr("x", width/2+20) 
            .attr("y", height*1.1)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", color_extra);
      
      legend_extra_time_taken.append("text")
            .attr("x", width/2+30) //
            .attr("y", height*1.1)
            .attr("dy", ".7em")
            .style("font-size", "12px")
            .text(function(d) { return d; });
      
      
      var timeTypes_saved = d3.keys(time_saved_dataset[0]).filter(function(aFunction){return aFunction == "Time Saved";});
      var legend_time_saved = chart1.selectAll()
                .data(timeTypes_saved)
                .enter().append('g')
                .attr("width", width).attr("height", height)
                .attr('transform',  "translate(0,20)" )
      
      legend_time_saved.append("rect")
            .attr("x", 3*width/4+20) 
            .attr("y", height*1.1)
            .attr("width", 8)
            .attr("height", 8)
            .attr("fill", color_saved);
      
      legend_time_saved.append("text")
            .attr("x", 3*width/4+30) //
            .attr("y", height*1.1)
            .attr("dy", ".7em")
            .style("font-size", "12px")
            .text(function(d) { return d; });
      
      //adding heading
      svg_grouped.append("text")
            .attr("x", (width/ 2)+60)             
            .attr("y", (margin1.top/2))
            .attr("text-anchor", "middle")
            //.attr("font", "sans-serif")  
            .style("font-size", "15px") 
            .style("font-weight","bold")
            .text("Comparison of Estimated time vs Actual time taken across processes(in minutes)");
      
      
          })
        }

line_chart_maker(){
          var width=640; 
          var height=240;
          var margin2 = {top: 40, right: 40, bottom: 40, left: 40};
          
          var svg_line = d3.select("#linechart").append("svg")
                                  .attr("width", width).attr("height", height)
                                  .style("background", "rgb(230,230,230)")
                                  // .append("g")
                                  .attr("transform", "translate(" + margin2.left/2 + "," + margin2.top*0.1 + ")");  
          
          
          
          // Define margins, dimensions of g
          var width = 630 - margin2.left - margin2.right;
          var height = 260 - margin2.top - margin2.bottom;
          
          // Load the data and draw a chart
          var processes, tipBox;
          // d3.json('https://gist.githubusercontent.com/Vvgupta/020e708b412563a30285c4d36a1cbe93/raw/f90c12bac8b8b10cffba21584f6240dd8ac86858/view-2_7lines.json')
          
          var data_v5=this.transformed_data.then(function(d){
            return d[2]
            })

          data_v5.then( function(d) {
            processes = d;
            var processNames = d.map(function(d) { return d.process_type; }); //for domain of axis x0
          const chart2 = d3.select("#linechart").select('svg').append('g')
          .attr("width", width).attr("height", height)
            .attr('transform', 'translate(' + margin2.left + ',' + margin2.top + ')');
          
          
          var sArray = d.map(item => item.records.map(element => element.speed)) //s stands for speed here, so sArray for all the speed values
          var arr_ydomain = []
          sArray.forEach(function (item, index) {
            arr_ydomain = arr_ydomain.concat(item)
          })
          
          var records_arr = d.map(item => item.records);
          
          var colors = d3.scaleOrdinal(["#FFE26D", "#063851", "#ff0000", "#24e185", "#8a03e4", "#7451ec", "#a66563"]);
          var tooltip = d3.select('#linechart').append('div').attr("id","tooltip3")
          var tooltipLine = chart2.append('line');
          
          // Define the scales and tell D3 how to draw the line
          var x = d3.scalePoint().domain(d.map(item => item.records.map(element => element.batch_id))[0]).range([0, width-2*margin2.right]).padding([0.5]);  //
          var y = d3.scaleLinear().domain([0,(d3.max(arr_ydomain)+20)]).range([height, 0]);
          var line = d3.line().x(d => x(d.batch_id)).y(d => y(d.speed));
            
          // Add the axes and a title
          var xAxis = d3.axisBottom(x);
          var yAxis = d3.axisLeft(y);
          chart2.append('g').call(yAxis); 
          chart2.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
          
          
          //lines
            chart2.selectAll()
              .data(processes).enter()
              .append('path')
              .attr('fill', 'none')
              .attr('stroke', function(d,i) {return colors(i);})
              .attr('stroke-width', 2)
              .datum(d => d.records)
              .attr('d', line);
            
              //for the labels at the end of lines
            // chart2.selectAll()
            //   .data(processes).enter()
            //   .append('text')
            //   .html(d => d.process_type)
            //   .attr('fill', function(d,i) {return colors(i);})
            //   .attr('alignment-baseline', 'middle')
            //   .attr('x', width-3*margin2.right)
            //   .attr('dx', '.5em')
            //   .attr('y', d => y(d.records[records_arr[0].length-1].speed));
          
            tipBox = chart2.append('rect')
              .attr('width', width)
              .attr('height', height)
              .attr('opacity', 0)
              .on('mousemove', drawTooltip)
              .on('mouseout', removeTooltip);
          
            //for dots on lines
            var ts_circles = chart2.selectAll("dot")
            .data(records_arr[0]).enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('fill', '#FFE26D')
            .attr("cx", function(d) { return x(d.batch_id)})
            .attr("cy", function(d) { return y(d.speed)})     
            .attr("r", 4);
          
            var cb_circles = chart2.selectAll("dot")
            .data(records_arr[1]).enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('fill', '#063851')
            .attr("cx", function(d) { return x(d.batch_id)})
            .attr("cy", function(d) { return y(d.speed)})     
            .attr("r", 4);
          
            var ad_circles = chart2.selectAll("dot")
            .data(records_arr[2]).enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('fill', '#ff0000')
            .attr("cx", function(d) { return x(d.batch_id)})
            .attr("cy", function(d) { return y(d.speed)})     
            .attr("r", 4);
          
            var app_circles = chart2.selectAll("dot")
            .data(records_arr[3]).enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('fill', '#24e185')
            .attr("cx", function(d) { return x(d.batch_id)})
            .attr("cy", function(d) { return y(d.speed)})     
            .attr("r", 4);
          
            var cr_circles = chart2.selectAll("dot")
            .data(records_arr[4]).enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('fill', '#8a03e4')
            .attr("cx", function(d) { return x(d.batch_id)})
            .attr("cy", function(d) { return y(d.speed)})     
            .attr("r", 4);
          
            var r_circles = chart2.selectAll("dot")
            .data(records_arr[5]).enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('fill', '#7451ec')
            .attr("cx", function(d) { return x(d.batch_id)})
            .attr("cy", function(d) { return y(d.speed)})     
            .attr("r", 4);
          
            var ip_circles = chart2.selectAll("dot")
            .data(records_arr[6]).enter()
            .append('circle')
            .attr('class', 'circle')
            .attr('fill', '#a66563')
            .attr("cx", function(d) { return x(d.batch_id)})
            .attr("cy", function(d) { return y(d.speed)})     
            .attr("r", 4);
          
          //LEGENDS
          // console.log(processNames)
          var legends_line_chart = chart2.selectAll()
                    .data(processNames.slice())
                    .enter().append('g')
                    .attr("width", width).attr("height", height)
                    .attr('transform', function(d,i) { return "translate(20," +  i * 15 + ")"; });
          
           legends_line_chart.append("rect")
                .attr("x", (3*width/4)+40) 
                .attr("y", height*0.1)
                .attr("width", 8)
                .attr("height", 8)
                .attr("fill", colors);
          
          legends_line_chart.append("text")
                .attr("x", (3*width/4)+50)
                .attr("y", height*0.1)
                .attr("dy", ".7em")
                .style("font-size", "12px") 
                // .style("text-anchor", "start")
                .text(function(d) { return d; });
          
          function removeTooltip() {
            if (tooltip) tooltip.style('display', 'none');
            if (tooltipLine) tooltipLine.attr('stroke', 'none');
          }
          
          function drawTooltip() {
              
            
                  var xPos = d3.mouse(this)[0];  //https://stackoverflow.com/questions/40573630/how-can-i-implement-an-invert-function-for-a-point-scale
                  var domain = x.domain(); 
                  var range = x.range();
                  var rangePoints = d3.range(range[0], range[1], x.step())
                  var yPos = domain[d3.bisect(rangePoints, xPos)-1];
                  var batch_id = yPos;
              
            tooltipLine.attr('stroke', 'black')
              .attr('x1', x(batch_id))
              .attr('x2', x(batch_id))
              .attr('y1', 0)
              .attr('y2', height);
          
            var pos_line=d3.mouse(d3.select("#linechart").node());
            tooltip.html(batch_id)
              .style('display', 'block')
              .style('left', (pos_line[0] +20) + "px")
              // .style('top', (pos_line[1] - 20) + "px")   //to make tipbox movable along y axis
              .style('top',(margin2.top+0)+"px") //added *0* to move it's position along y axis
              .selectAll()
              .data(processes).enter()
              .append('div')
              .style('color', function(d,i) {return colors(i);})
              .html(d => d.process_type + ': ' + d.records.find(h => h.batch_id == batch_id).speed)
          }
          
          
          
          //adding heading
          svg_line.append("text")
                .attr("x", (width/2)+30)             
                .attr("y", margin2.top/2)
                .attr("text-anchor", "middle")
                .style("font-size", "16px") 
                .style("font-weight","bold")
                .text("Speed of stations");
              });
              }

}
