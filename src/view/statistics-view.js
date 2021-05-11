import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view.js';
import { formatDuration } from '../utils/point.js';

const getUniqueTypes = (points) => {
  const types = points.map((item) => item.type);
  return [...new Set(types)];
};

const getDataPrice = (points, types) => {
  const data = Array(types.length).fill(0);
  types.forEach((type, index) => {
    points
      .filter((point) => point.type === type)
      .forEach((item) => {
        data[index] += item.basePrice;
      });
  });

  return data;
};

const getDataCount = (points, types) => {
  const data = Array(types.length).fill(0);
  types.forEach((type, index) => {
    data[index] = points.filter((point) => point.type === type).length;
  });

  return data;
};

const getDurationType = (points, type) => {
  const allPointsTypes = points.filter((point) => point.type === type);
  const duration = allPointsTypes.reduce((totalDuration, point) => {
    return totalDuration + dayjs(point.dateTo).diff(dayjs(point.dateFrom), 'm');
  }, 0);
  return duration;
};

const renderMoneyChart = (moneyCtx, statsData) => {
  const stats = statsData.sort((a, b) => b.price - a.price);
  const labels = stats.map((item) => item.type.toUpperCase());
  const data = stats.map((item) => item.price);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, statsData) => {
  const stats = statsData.sort((a, b) => b.count - a.count);
  const labels = stats.map((item) => item.type.toUpperCase());
  const data = stats.map((item) => item.count);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeCtx, statsData) => {
  const stats = statsData.sort((a, b) => b.duration - a.duration);
  const labels = stats.map((item) => item.type.toUpperCase());
  const data = stats.map((item) => item.duration);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: '#ffffff',
          hoverBackgroundColor: '#ffffff',
          anchor: 'start',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => formatDuration(val),
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#000000',
              padding: 5,
              fontSize: 13,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 44,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            minBarLength: 50,
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => {
  return `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class StatisticsView extends SmartView {
  constructor(points) {
    super();

    this._points = points;
    this._statistics = {};

    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatisticsTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeCtx = this.getElement().querySelector('.statistics__chart--time');

    const uniqueTypes = getUniqueTypes(this._points);

    const price = getDataPrice(this._points, uniqueTypes);
    const count = getDataCount(this._points, uniqueTypes);
    const duration = uniqueTypes.map((item) => getDurationType(this._points, item));

    const stats = uniqueTypes.map((item, index) => ({ type: item, price: price[index], count: count[index], duration: duration[index] }));

    renderMoneyChart(moneyCtx, stats);
    renderTypeChart(typeCtx, stats);
    renderTimeSpendChart(timeCtx, stats);
  }
}
