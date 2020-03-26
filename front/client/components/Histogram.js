import React, { Component } from 'react';
import Colors from '../Colors';
import { color } from 'd3';
var d3 = require("d3");
    
class Bar extends React.Component {

    constructor(props) {
        super(props)
    }
    
    render() {
        let style = {
        fill: "steelblue"
        }
    
        return(
        <g>
            <rect className="bar" style={style} x={this.props.x} y={this.props.y + 5} width={this.props.width} height={this.props.height} />
        </g>
        )
    }
    
}
      
class YAxis extends React.Component {

constructor(props) {
    super(props)
}

    render() {
        let style = {
            stroke: "black",
            strokeWidth: "1px"
        }
        
        let textStyle = {
            fontSize: 25,
            fill: "black",
            textAnchor: "end",
            color: Colors.OceanBlue
        }
        
        //D3 mathy bits
        let ticks = d3.range(0, this.props.end, (this.props.end / this.props.labels.length))
        let percentage = d3.format(".2f")
        
        let lines = []
        ticks.forEach((tick, index) => {
            lines.push(<line style={style} y1={tick} x1={this.props.y} y2={tick} x2={this.props.y - 4} key={index} />)
        })
        
        let columnLabels = []
        ticks.forEach((tick, index) => {
            columnLabels.push(<text style={ textStyle } y={tick + 2} x={this.props.y - 20} fontFamily="Verdana" key={index} >{percentage(this.props.labels[index])}</text>)
        })
        
        return(
            <g>
                <g className="y_labels" transform={`translate(${-5},${17})`}>
                <line x1={this.props.y} y1={this.props.start} y2={this.props.end} x2={this.props.y} style={ style } />
                </g>
                <g className="y_labels" transform={`translate(${-5},${51})`}>
                    { columnLabels }
                    { lines }
                </g>
            </g>
        )
    }

}

class XAxis extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        let style = {
            stroke: "black",
            strokeWidth: "1px"
        }
            
        let step = (this.props.start + this.props.end / this.props.labels.length)
        
        //D3 mathy bits   
        let ticks = d3.range(this.props.start, this.props.end, step)
        
        let lines = []
        ticks.forEach((tick, index) => {
            lines.push(<line style={style} x1={tick + 10 } y1={this.props.x} x2={tick + 10} y2={this.props.x + 4} key={index}  />)
        })
        
        let columnLabels = []
        ticks.forEach((tick, index) => {
            columnLabels.push(<text style={{fill: "black"}} x={tick + 5} y={this.props.x + 35} fontFamily="Verdana" fontSize={25} key={index}>{this.props.labels[index]}  </text>)
        })
            

        return(
        <g>
            <line x1={this.props.start} y1={this.props.x } x2={this.props.end} y2={this.props.x} style={ style } />
            { columnLabels }
            { lines }
        </g>
        )
    }
}

class Histogram extends Component {

    render() {
        let data = this.props.data

        let margin = { top: 20, right: 20, bottom: 30, left: 45 },
        width = this.props.width - margin.left - margin.right,
        height = this.props.height - margin.top - margin.bottom;

        let labels = data.map((d) => d.label)


        //D3 mathy bits    
        let ticks = d3.range(0, width, (width / data.length))
        let x = d3.scaleOrdinal()
        .domain(labels)
        .range(ticks)
        let y = d3.scaleLinear()
        .domain([0, d3.max(data, (d) => d.probability)])
        .range([height, 0])

        let bars = []
        let bottom = 450
        
        data.forEach((datum, index) => {
            bars.push(<Bar key={index} x={x(datum.label)} y={bottom - 6 - (height - y(datum.probability))} width={this.props.barWidth} height={height - y(datum.probability)} />)
        })

        return (
        <svg width={this.props.width} height={this.props.height} style={{ overflow: 'visible', marginBottom: 30 }}>
            <YAxis y={40} labels={y.ticks().reverse()} start={15} end={height} />
            
            <g className="chart" transform={`translate(${margin.left},${margin.top})`}>
                { bars }
                <XAxis x={ bottom } labels={labels} start={0} end={width} style={{ marginTop: 20 }} />
            </g>
        </svg>
        );
    }
}

export default Histogram;
