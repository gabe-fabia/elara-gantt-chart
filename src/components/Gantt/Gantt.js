import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './Gantt.css';

export default class Gantt extends Component {

    constructor(props) {
        super(props);
        this.initZoom(); 
    }

    // instance of gantt.dataProcessor
    dataProcessor = null;

    initZoom() {
        gantt.ext.zoom.init({
            levels: [
                {
                 name: 'Hours',
                 scale_height: 60,
                 min_column_width: 30,
                 scales: [
                    { unit: 'day', step: 1, format: '%d %M' },
                    { unit: 'hour', step: 1, format: '%H' }
                 ]
                },
                {
                    name: 'Days',
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                       { unit: 'week', step: 1, format: 'Week #%W' },
                       { unit: 'day', step: 1, format: '%d %M' }
                    ]
                },
                {
                    name: 'Months',
                    scale_height: 60,
                    min_column_width: 70,
                    scales: [
                       { unit: 'month', step: 1, format: '%F' },
                       { unit: 'week', step: 1, format: '#%W' }
                    ]
                }
            ]
        })
    }

    setZoom(value){
        gantt.ext.zoom.setLevel(value);
    }

    initGanttDataProcessor() {
        /**
         * type: "task"|"link"
         * action: "create" | "update" | "delete"
         * item: data object
         */
        const onDataUpdated = this.props.onDataUpdated;
        this.dataProcessor = gantt.createDataProcessor((type, action, item, id) => {
            return new Promise((resolve, reject) => {
                if (onDataUpdated) {
                    onDataUpdated(type, action, item, id);
                }

                // if onDataUpdated changes returns a permanent id of the created item, 
                //  you can return it from here so dhtmlxGantt could apply it
                //  resolve({id: databaseId});
                return resolve();
            });
        });
    }

    componentWillUnmount() {
        if (this.dataProcessor) {
            this.dataProcessor.destructor();
            this.dataProcessor = null;
        }
    }

    shouldComponentUpdate(nextProps) {
        return this.props.zoom !== nextProps.zoom;
    }

    componentDidUpdate() {
        gantt.render();
    }

    componentDidMount() {

        const { tasks } = this.props;
        gantt.init(this.ganttContainer);
        this.initGanttDataProcessor();
        gantt.parse(tasks);
    }

    render() {
        const { zoom } = this.props;
        this.setZoom(zoom);
        return (
            <div
                ref={ (input) => { this.ganttContainer = input } }
                style={ { width: '100%', height: '100vh' } }
            ></div>
        );
    }
}