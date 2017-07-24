import React, { PropTypes } from 'react';
import { values, pickBy, has, omit, map, startCase, pick } from '../../utils/lodash';
import moment from 'moment';
import { HorizontalBar } from 'react-chartjs-2';

function compare(a, b) {
  if (a.ytd_2017 > b.ytd_2017)
    return -1;
  if (a.ytd_2017 < b.ytd_2017)
    return 1;
  return 0;
}

function buildTitle(params) {
  let units = "";
  if (params.flow_type === "QTY")
    units = "Thousands of Metric Tons";
  else if (params.flow_type === "VALUE")
    units = "Thousands of U.S. Dollars";

  const chartTitle = params.reporter_countries + ' Exports for Top 5 Partner Countries of ' + params.product_groups + ' in ' + units;
  return chartTitle;
}

const ProductGroupBarGraph = ({ data, params }) => {
  const chartTitle = buildTitle(params);

  data = data.filter(function(entry) {
    return (entry.partner_country !== "World" && entry.partner_country !== "Other Countries");
  });

  const data_entries = data.sort(compare).slice(0, 5);

  const labels = map(data_entries, (entry) => {
    return entry.partner_country;
  })

  const datasets = [
      {
        label: 'YTD 2016',
        fill: false,
        backgroundColor:  'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: map(data_entries, (entry) => { return entry.ytd_2016/1000; }),
      },
      {
        label: 'YTD 2017',
        fill: false,
        backgroundColor:  'rgba(0,99,132,0.2)',
        borderColor: 'rgba(0,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(0,99,132,0.4)',
        hoverBorderColor: 'rgba(0,99,132,1)',
        data: map(data_entries, (entry) => { return entry.ytd_2017/1000; }),
      },
    ];

  const chartData = {
    labels: labels,
    datasets: datasets
  };
  
  const chartOptions = {
        title: {
            display: true,
            text: chartTitle
        },
        legend: {
            display: true
        },
        scales: { 
          xAxes: [{
              ticks: {
                    maxTicksLimit: 15,
                    userCallback: function(value, index, values) {
                      value = value.toString();
                      value = value.split(/(?=(?:...)*$)/);
                      value = value.join(',');
                      return value;
                    }
                  }
            }]
        },
        maintainAspectRatio: false
    }


  return  (
    <div className="bar_graph">
      <HorizontalBar data={chartData} options={chartOptions} />
    </div>
  );
}

export default ProductGroupBarGraph;