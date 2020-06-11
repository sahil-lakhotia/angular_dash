import { Component, OnInit,EventEmitter,Output, ViewEncapsulation } from '@angular/core';
import { Data_Batch, Filter_Dates } from '../../model/data_batch';
import {DataService} from '../../services/data.service';
import { Observable } from 'rxjs';


declare let d3: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-executive-summary',
  templateUrl: './executive-summary.component.html',
  styleUrls: ['./executive-summary.component.css']
})
export class ExecutiveSummaryComponent implements OnInit {
  data_batch: Data_Batch[];
  promise_st;
  filtered_data;
  
  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.promise_st=this.dataService.agetdata()
  }

  ngAfterContentInit() {
    // this.populate_overall_stat()
    // this.pie_chart_maker()
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
  document.querySelector("#piechart").innerHTML=''
  document.querySelector("#linechart").innerHTML=''
  document.querySelector("#overall_numbers > div").innerHTML=''
  this.populate_overall_stat()
  this.pie_chart_maker()
  this.line_chart_maker()
  }

  populate_overall_stat (){
    var mydata=[2,1444,50,66]  
    d3.selectAll("#overall_numbers > div").data(mydata)
      .text(function(d,i){
        return d;})
    }

  pie_chart_maker(){
    // var data_v1=d3.json("https://gist.githubusercontent.com/Vvgupta/e3f80bd308929c59376906968bec9545/raw/7bfc3237a8c941a3d2ca82d1678862c7a38dcbae/view-1+2_primary.json")
    // console.log("piecharmaker started")
    var data_v1=this.filtered_data;
    var width = 590,height = 377;
    var spacing  = 60;
    var margin = {top: 40, right: 40, bottom: 40, left: 40};
    var radius = Math.min(width, height) / 2 - spacing*1.5; //make spacing smaller if text can be wrapped to make a longer line
    
    var svg_pie = d3.select("#piechart")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("background", "rgb(230,230,230)");
    
    // data_v2=d3.json("https://gist.githubusercontent.com/Vvgupta/e3f80bd308929c59376906968bec9545/raw/7bac084ce64ac49918ca424744a515223a347343/view-1_pie.json")
    
    var data_v2=data_v1.then(function(datat_v1){
          var ppt=0;
          var pit=0;
          datat_v1.forEach(function(d){    
                ppt=ppt+d['Pre Processing Time']
                pit=pit+d['Post Init Time']
          }
          )
      var data_v0=[{"type": "Pre Processing Time","number": ppt},{"type": "Post Init Time","number": pit}]
      return data_v0     
      }
      )
    
    data_v2.then(function(data_pie){
        var width = 590 - margin.left - margin.right;
        var height = 377 - margin.top - margin.bottom;
        data_pie.forEach(function(d){
                  d.number = +d.number;
                  });
    
        var data = d3.pie().sort(null).value(function(d) {
          return d.number;  //d.number return the number value from data array, sort is for order
        })(data_pie);
    
    //generate segments in the circle with the help of arc generator
        var segments = d3.arc()
                         .innerRadius(0)
                         .outerRadius(width/6);
    
    // Another arc that won't be drawn. Just for labels positioning
        var outerArc = d3.arc()
          .innerRadius(radius * 1)
          .outerRadius(radius * 1);
        var colors = d3.scaleOrdinal(["#FFE26D", "#063851"]);
    
    
        
        var sections = svg_pie.append("g")
        .attr("transform", "translate("+ (width/1.9) + "," + (height/1.5) + ")")
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
              // console.log(position)
              d3.select("#piechart").append("div").classed("tooltip1",true)
              .style("left",position[0]+"px")
              .style("top", position[1]+"px")
              .html(d.data.type + " <br/> " + percent + "%");
              })
    
            .on("mouseout", function(){
              d3.select(".tooltip1").remove();
            });
    
    //static tooltip//
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
          .text(function(d){ 
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
          .attr("y", (spacing/2))
          .attr("text-anchor", "middle")
          .style("font-size", "16px") 
          .style("font-weight","bold")
          .text("Distribution of time consumed across processes");
    
        })
    
    };



    line_chart_maker(){

      // var  data_v1=d3.json("https://gist.githubusercontent.com/Vvgupta/e3f80bd308929c59376906968bec9545/raw/7bfc3237a8c941a3d2ca82d1678862c7a38dcbae/view-1+2_primary.json")  
      var data_v1=this.filtered_data;
      var width=590; 
      var height=377;
      var margin = {top: 40, right: 40, bottom: 40, left: 40};
      
      var svg_line = d3.select("#linechart").append("svg")
                              .attr("width", width).attr("height", height)
                              .style("background", "rgb(230,230,230)")
                              .append("g")
                              .attr("transform", "translate(" + margin.left/2 + "," + margin.top/2 + ")");  
      
      
      // Load the data and draw a chart
      var processes, tipBox;
      // data_v3=d3.json('https://gist.githubusercontent.com/Vvgupta/e3f80bd308929c59376906968bec9545/raw/449116707108450624f35b88b84c9bf5c2c05e46/view-1_3lines.json')
      
      var data_v3=data_v1.then(function(datat_v2){
            // Define margins, dimensions of g
            
            var data_v0=[
                        {"process_type": "Pre Processing Speed","records": []},
                        {"process_type": "Post Init Speed","records": []},
                        {"process_type": "Overall Speed","records": []}
                        ]
            datat_v2.forEach(function(d){
                var pre_obj={"batch_id":d.batch,"speed":d['Pre Processing Speed']}
                var post_obj={"batch_id":d.batch,"speed":d['Post Init Speed']}
                var overall_obj={"batch_id":d.batch,"speed":d['Overall Speed']}
                data_v0[0].records.push(pre_obj)
                data_v0[1].records.push(post_obj)
                data_v0[2].records.push(overall_obj)
                
            }
            )
          return data_v0
        }
        )
      
      data_v3.then(function(d) {
        var spacing  = 60;
        var width = 590 - margin.left - margin.right;
        var height = 377 - margin.top - margin.bottom;
        processes = d
        
      
      const chart = d3.select("#linechart").select('svg').append('g')
                      .attr("width", width).attr("height", height)
                      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
      
      var sArray = d.map(item => item.records.map(element => element.speed)) //s stands for speed here, so sArray for all the speed values
      var arr_ydomain = []
      sArray.forEach(function (item, index) {
        arr_ydomain = arr_ydomain.concat(item)
      })
      
      var records_arr = d.map(item => item.records);
      
      var colors = d3.scaleOrdinal(["#FFE26D", "#063851", "#ff0000"]);
      var tooltip = d3.select('#linechart').append('div').attr("id","tooltip2")
      var tooltipLine = chart.append('line');
      
      // Define the scales and tell D3 how to draw the line
      var x = d3.scalePoint().domain(d.map(item => item.records.map(element => element.batch_id))[0]).range([0, width-2*margin.right]).padding([0.5]);  //
      var y = d3.scaleLinear().domain([0,(d3.max(arr_ydomain)+20)]).range([height, 0]);
      var line = d3.line().x(d => x(d.batch_id)).y(d => y(d.speed));
        
      // Add the axes and a title
      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y);
      chart.append('g').call(yAxis); 
      chart.append('g').attr('transform', 'translate(0,' + height + ')').call(xAxis);
      
      
      //lines
        chart.selectAll()
          .data(processes).enter()
          .append('path')
          .attr('fill', 'none')
          .attr('stroke', function(d,i) {return colors(i);})
          .attr('stroke-width', 2)
          .datum(d => d.records)
          .attr('d', line);
        
      
      
        // for the labels at the end of lines
        chart.selectAll()
          .data(processes).enter()
          .append('text')
          .html(d => d.process_type)
          .attr('fill', function(d,i) {return colors(i);})
          .attr('alignment-baseline', 'middle')
          .attr('x', width-3*margin.right)
          .attr('dx', '.5em')
          .attr('y', d => y(d.records[d.records.length-1].speed));
      
        tipBox = chart.append('rect')
          .attr('width', width)
          .attr('height', height)
          .attr('opacity', 0)
          .on('mousemove', drawTooltip)
          .on('mouseout', removeTooltip);
      
        //for dots on lines
        var pps_circles = chart.selectAll("dot")
        .data(records_arr[0]).enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('fill', '#FFE26D')
        .attr("cx", function(d) { return x(d.batch_id)})
        .attr("cy", function(d) { return y(d.speed)})     
        .attr("r", 4);
      
        var pis_circles = chart.selectAll("dot")
        .data(records_arr[1]).enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('fill', '#063851')
        .attr("cx", function(d) { return x(d.batch_id)})
        .attr("cy", function(d) { return y(d.speed)})     
        .attr("r", 4);
      
        var oas_circles = chart.selectAll("dot")
        .data(records_arr[2]).enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('fill', '#ff0000')
        .attr("cx", function(d) { return x(d.batch_id)})
        .attr("cy", function(d) { return y(d.speed)})     
        .attr("r", 4);
      
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
          .style('top',(margin.top)+"px")
          .selectAll()
          .data(processes).enter()
          .append('div')
          .style('color', function(d,i) {return colors(i);})
          .html(d => d.process_type + ': ' + d.records.find(h => h.batch_id == batch_id).speed)
      }
      
      //adding heading
            d3.select("#linechart").select("svg").append("text")
            .attr("x", (width/2)+30)             
            .attr("y", spacing/2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px") 
            .style("font-weight","bold")
            .text("Distribution of time consumed across processes")
      })
      };

    
}
