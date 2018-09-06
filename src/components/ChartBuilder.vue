<template>
    <div class="hello">

        <DataTable></DataTable>

        <hr>
        <hr>

        <select v-model="chartType">
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="line">Line</option>
        </select>

        <hr>

        <div class="chart-datasets">
            <div class="chart-dataset" v-for="dataset in datasets">
                <input type="text" v-model="dataset.title">

                <h3>Data</h3>
                <div class="chart-dataset-datum" v-for="(label, index) in labels" >
                    <input type="text" v-model="labels[index]"/>
                    <input type="text" v-model="dataset.data[index]"/>
                </div>
            </div>
        </div>

        <div class="chart-container">
            <canvas ref="chartCanvas" width="400" height="400"></canvas>
        </div>
    </div>
</template>

<script>
import Chart from 'chart.js';
import DataTable from './DataTable';

export default {
  name: 'ChartBuilder',
  props: {
    msg: String,
  },

  data() {
    return {
      chartType: 'bar',
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Black'],
      datasets: [
        {
          title: 'Number of Votes',
          data: [0, 4, 20, 24, 20, 4, 0],
        },
      ],
    };
  },

  methods: {
    transformDataset(dataset) {
      return {
        label: dataset.title,
        data: dataset.data,
      };
    },

    renderChart() {
      const ctx = this.$refs.chartCanvas;
      const chart = new Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.labels,
          datasets: this.datasets.map(dataset => this.transformDataset(dataset)),
        },
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              }],
          },
        },
      });
    },
  },

  mounted() {
    this.renderChart();

    [
      'datasets',
      'chartType',
      'labels',
    ].forEach(toWatch => this.$watch(toWatch, () => {
      this.renderChart();
    }, { deep: true }));
  },

  components: {
    DataTable,
  },
};
</script>

<style scoped lang="scss">
    .chart-container {
        width: 500px;
        height: 500px;
    }
</style>
