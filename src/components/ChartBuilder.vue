<template>
    <div class="hello">

        <data-table v-model="chartData"></data-table>
        <hr>

        <hr>

        <select v-model="chartType">
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="line">Line</option>
        </select>

        <hr>

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
                chart: null,
                labelsRowIndex: 0,
                datasetNameColumnIndex: 0,
                chartData: [
                    [
                        null,
                        'Red',
                        'Blue',
                        'Green',
                        'Orange',
                    ],
                    [
                        'Dataset Name',
                        '10',
                        '4',
                        '56',
                        '21',
                    ],
                ],

                chartType: 'bar',
            };
        },

        computed: {
            labels() {
                return this.chartData[this.labelsRowIndex].filter(label => {
                    return label;
                });
            },

            datasets() {
                return this.chartData.slice(this.labelsRowIndex + 1).map(dataset => {
                    return {
                        label: dataset[this.datasetNameColumnIndex],
                        data: dataset.slice(this.datasetNameColumnIndex + 1),
                    };
                });
            },
        },

        methods: {
            renderChart() {
                if(this.chart) {
                    this.chart.destroy();
                }

                const ctx = this.$refs.chartCanvas;
                this.chart = new Chart(ctx, {
                    type: this.chartType,
                    data: {
                        labels: this.labels,
                        datasets: this.datasets,
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
                'chartData',
                'chartType',
                'labels',
            ].forEach(toWatch => this.$watch(toWatch, () => {
                this.renderChart();
            }, {deep: true}));
        },

        components: {
            'data-table': DataTable,
        },
    };
</script>

<style scoped lang="scss">
    .chart-container {
        width: 500px;
        height: 500px;
    }
</style>
