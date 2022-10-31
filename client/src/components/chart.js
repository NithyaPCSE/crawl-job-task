import { useEffect } from 'react';
import { Chart } from '@antv/g2';

function JobChart(props){
    useEffect(() => {
        document.getElementById('c1').innerHTML='';
        const data = props.data;
        const colorSet = {
            in_progress: '#0d6efd',
            completed: '#198754',
            failed: '#dc3545',
            enqueued: '#ffc107',
        };
        const chart = new Chart({
            container: 'c1',
            width: 600,
            height: 300,
        });
        chart.data(data);
        chart.interval().position('status*count') .color('value', (v) => colorSet[v]);
        chart.render();
    },[props]); 
    return (
        <div id="c1"></div>
    )
}

export default JobChart;