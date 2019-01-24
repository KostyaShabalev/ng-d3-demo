import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class D3Service {

	constructor() { }

	public getPlot(historiesData: object) {

		// let keyOne = Object.keys(historiesData)[0];
		// let keyTwo = Object.keys(historiesData)[1];
		// let keyThree = Object.keys(historiesData)[2];

		// let coinOne:any = historiesData[keyOne];
		// let coinTwo:any = historiesData[keyTwo];
		// let coinThree:any = historiesData[keyThree];

		// let testData = d3.range(0, 9);
		// console.log(testData);

		let maxValues: object = this.getMaxValue(historiesData, 'price');
		let longestArray = Object.values(historiesData)[maxValues['longestArray']];

		// set graph dimensions
		let margin = { top: 20, right: 20, bottom: 70, left: 40 };
		let width = 800 - margin.left - margin.right;
		let height = 400 - margin.top - margin.bottom;

		// parse the time
		let parseDate = d3.timeFormat("%b %d, %Y");

		// set the ranges
		let x = d3.scaleTime().rangeRound([0, width]);
		let y = d3.scaleLinear().rangeRound([height, 0]);

		// define the line
		let line: any = d3.line()
			.x(function (d: any) { return x(d.timestamp) })
			.y(function (d: any) { return y(d.price) });

		// add graph
		let svg = d3.select('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', width + margin.top + margin.bottom);

			if (svg.select('g')) {
				svg.select('g').remove();
			}

		let g = svg.append('g')
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// this.setWidgetDimentions(widget);

		// scale tha range of the data
		x.domain(<any>d3.extent(longestArray, function (d: any) { return d.timestamp }));
		y.domain(<any>d3.extent([0, maxValues['maxPrice']]));

		// set the color scale
		let color = d3.scaleOrdinal(d3.schemeCategory10);

		let legendSpace = width / Object.keys(historiesData).length;

		Object.values(historiesData).forEach((d, num) => {

			g.append("path")
				// .datum(Object.keys(historiesData)[num])
				.attr("fill", "none")
				.style("stroke", () => d.color = color(Object.keys(historiesData)[num])) // to be changed !!!
				.attr("d", line(d));

			g.append("text")
				.attr("x", (legendSpace / 2) + num * legendSpace) // to be changed !!!
				.attr("y", height + (margin.bottom / 2) + 30)
				.attr("class", "legend")
				// .attr("transform", `translate(${-margin.right}, ${margin.top})`)
				// .style ("stroke", () => d.color = color(d[Object.keys(historiesData)[num]]))
				.style ("fill", () => d.color = color(Object.keys(historiesData)[num]))
				.text(Object.keys(historiesData)[num]);
		});

		// add translations
		



		// g.append("path")
		// 	.datum(coinTwo)
		// 	.attr("fill", "none")
		// 	.attr("stroke", "red")
		// 	.attr("d", line);

		// g.append("path")
		// 	.datum(coinThree)
		// 	.attr("fill", "none")
		// 	.attr("stroke", "green")
		// 	.attr("d", line);

		// add Y axis
		g.append("g")
			.attr("class", "axis")
			.call(d3.axisLeft(y));

		// add X axis
		g.append("g")
			.attr("class", "axis")
			.call(d3.axisBottom(x))
			.attr("transform", "translate(0," + height + ")")
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-65)");

	}

	setWidgetDimentions(widget: any): void {
		widget.attr('width', 400)
			.attr('height', 200)
	}

	getMaxValue(data: object, value: string): object {
		let maxValArray: Array<number> = [];
		let lengthArray: Array<number> = [];
		let count = 0;

		for (let key in data) {

			lengthArray.push(data[key].length);
			maxValArray[count] = d3.max(data[key], (d: any) => {

				return +d[value];
			});
			count++;
		}

		return {
			maxPrice: Math.max(...maxValArray),
			longestArray: lengthArray.indexOf(Math.max(...lengthArray))
		};
	}


}
