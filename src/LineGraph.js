import React, {useState,useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};


const buildChartData = (data, caseType) =>{
  let charData = [];
  let lastDataPoint;

  for(let date in data.cases) {
    if (lastDataPoint){
    let newDataPoint = {
      x : date,
      y : data[caseType][date] - lastDataPoint,
    };
    charData.push(newDataPoint);
    }
    lastDataPoint = data[caseType][date];
  }
  return charData;
  };

function LineGraph({caseType, ...props}) {
    const [data,setData] = useState({});

    useEffect(() =>{
       const fetchData = async () => {
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((response) => { 
          return response.json();
        })
        .then(data => {
         console.log(data);
         let charData = buildChartData(data, caseType);
         setData(charData);
        });
      };

      fetchData();
    }, [caseType]);
    
  return (
    <div className={props.className}>
     {data?.length > 0 && (
        <Line
            data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        ></Line>
     )}
    </div>
  );
}

export default LineGraph