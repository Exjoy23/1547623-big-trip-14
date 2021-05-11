import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import SmartView from './smart-view.js';
import { formatDuration } from '../utils/point.js';
import { ChartSettings } from '../const.js';

const getUniqueTypes = (points) => {
  const types = points.map((item) => item.type);
  return [...new Set(types)];
};

const getDataPrice = (points, types) => {
  const data = Array(types.length).fill(null);
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
  const data = Array(types.length).fill(null);
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

const getChartSettings = (labels, data, text, formatter) => {
  return {
    plugins: [ChartDataLabels],
    type: ChartSettings.TYPE,
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ChartSettings.COLOR.WHITE,
          hoverBackgroundColor: ChartSettings.COLOR.WHITE,
          anchor: ChartSettings.ANCHOR.START,
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartSettings.DATA_FONT_SIZE,
          },
          color: ChartSettings.COLOR.BLACK,
          anchor: ChartSettings.ANCHOR.END,
          align: ChartSettings.ALIGN,
          formatter,
        },
      },
      title: {
        display: ChartSettings.FLAG.TRUE,
        text,
        fontColor: ChartSettings.COLOR.BLACK,
        fontSize: ChartSettings.TITLE_FONT_SIZE,
        position: ChartSettings.TITLE_POSITION,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: ChartSettings.COLOR.BLACK,
              padding: ChartSettings.TICKS_PADDING,
              fontSize: ChartSettings.TICKS_FONT_SIZE,
            },
            gridLines: {
              display: ChartSettings.FLAG.FALSE,
              drawBorder: ChartSettings.FLAG.FALSE,
            },
            barThickness: ChartSettings.BAR_THICKNESS,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: ChartSettings.FLAG.FALSE,
              beginAtZero: ChartSettings.FLAG.TRUE,
            },
            gridLines: {
              display: ChartSettings.FLAG.FALSE,
              drawBorder: ChartSettings.FLAG.FALSE,
            },
            minBarLength: ChartSettings.MIN_BAR_LENGTH,
          },
        ],
      },
      legend: {
        display: ChartSettings.FLAG.FALSE,
      },
      tooltips: {
        enabled: ChartSettings.FLAG.FALSE,
      },
    },
  };
};

const renderMoneyChart = (moneyCtx, statsData) => {
  const stats = statsData.sort((a, b) => b.price - a.price);
  const labels = stats.map((item) => item.type.toUpperCase());
  const data = stats.map((item) => item.price);

  return new Chart(
    moneyCtx,
    getChartSettings(labels, data, ChartSettings.TEXT.MONEY, (val) => `€ ${val}`)
  );
};

const renderTypeChart = (typeCtx, statsData) => {
  const stats = statsData.sort((a, b) => b.count - a.count);
  const labels = stats.map((item) => item.type.toUpperCase());
  const data = stats.map((item) => item.count);

  return new Chart(
    typeCtx,
    getChartSettings(labels, data, ChartSettings.TEXT.TYPE, (val) => `${val}x`)
  );
};

const renderTimeSpendChart = (timeCtx, statsData) => {
  const stats = statsData.sort((a, b) => b.duration - a.duration);
  const labels = stats.map((item) => item.type.toUpperCase());
  const data = stats.map((item) => item.duration);

  return new Chart(
    timeCtx,
    getChartSettings(labels, data, ChartSettings.TEXT.TIME_SPEND, (val) => formatDuration(val))
  );
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
    return createStatisticsTemplate();
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
