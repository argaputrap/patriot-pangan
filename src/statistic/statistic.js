import './statistic.scss';
import Chart from 'chart.js'
import axios from 'axios';
import { url } from '../_services/url';

window.onload = function() {
    const statistic = new Statistic();
    statistic.barChartHorizontal();
    statistic.pieChart();
    statistic.barChart();

    const ls = JSON.parse(localStorage.getItem('patriotpangan'));
    let token;
    if (ls) {
        token = ls.token;
    }

    const navSignIn = document.querySelector('.nav-item-signin');
    const navSignOut = document.querySelector('.nav-item-signout');
    const navAdmin = document.querySelector('.nav-item-admin');

    if (token) {
        navSignIn.style.display = 'none';
        navAdmin.style.display = 'block';
        navSignOut.style.display = 'block'
    } else {
        navAdmin.style.display = 'none';
        navSignOut.style.display = 'none';
    }
}

function Statistic() {}

Statistic.prototype.barChartHorizontal = function() {
    // Get current date
    const months = 
    ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    const date = new Date();
    const getMonth = date.getMonth();
    const getYear = date.getFullYear();

    // Fetch API
    const config = {
        headers:  {
            'Access-Control-Allow-Origin': '*',
        }
    };
    let totalDistricts;
    let level = [];
    const urlAPI = url.get.statistic.totalLevels(getMonth, getYear);
    axios.get(urlAPI, config)
        .then(res => {
            totalDistricts = res.data.data.jumlahKecamatan;
            for (let datum in res.data.data) {
                if (datum === 'jumlahKecamatan') {
                    continue;
                }
                level.push(res.data.data[datum].count);
            }
            createChart();
        })
        .catch(err => {
            throw err;
        })
    
    // Create chart
    function createChart() {
        const ctx = document.getElementById('bar-horizontal-chart__content');
        if (ctx) {
            ctx.height = 200;
            const barChartHorizontal = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: ['Taraf 0', 'Taraf 1', 'Taraf 2', 'Taraf 3', 'Taraf 4', 'Taraf 5'],
                    datasets: [{
                        label: `Jumlah Desa Berdasarkan Taraf per ${totalDistricts} Kecamatan`,
                        data: level,
                        backgroundColor: [
                            '#457f3a',
                            '#62b648',
                            '#d3ee52',
                            '#d5933a',
                            '#dc5a3f',
                            '#652420'
                        ],
                        barWidth: '20px'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    layout: {
                        padding: {
                            left: 24,
                            right: 24,
                            top: 24,
                            bottom: 24
                        }
                    }
                }
            });
        }    
    }
}

Statistic.prototype.pieChart = function() {
    // Get current date
    const date = new Date();
    const getMonth = date.getMonth()
    const getYear = date.getFullYear();

    // Fetch API
    const config = {
        headers:  {
            'Access-Control-Allow-Origin': '*',
        }
    };
    let totalDistricts;
    let level = [];
    const urlAPI = url.get.statistic.totalLevels(getMonth, getYear);
    axios.get(urlAPI, config)
        .then(res => {
            totalDistricts = res.data.data.jumlahKecamatan;
            for (let datum in res.data.data) {
                if (datum === 'jumlahKecamatan') {
                    continue;
                }
                level.push(res.data.data[datum].count);
            }
            createChart();
        })


    function createChart() {
        const ctx = document.getElementById('pie-chart__content')
        if (ctx) {
            ctx.height = 200;
            const pieChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['Taraf 0', 'Taraf 1', 'Taraf 2', 'Taraf 3', 'Taraf 4', 'Taraf 5'],
                    datasets: [{
                        label: `Jumlah Desa Berdasarkan Taraf per ${totalDistricts} desa`,
                        data: level,
                        backgroundColor: [
                            '#457f3a',
                            '#62b648',
                            '#d3ee52',
                            '#d5933a',
                            '#dc5a3f',
                            '#652420'
                        ],
                        barWidth: '20px'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    layout: {
                        padding: {
                            left: 24,
                            right: 24,
                            top: 24,
                            bottom: 24
                        }
                    }
                }
            });
        }
    }
}

Statistic.prototype.barChart = function() {
    // Get current date
    const date = new Date();
    const getYear = date.getFullYear();

    // Fetch API
    const config = {
        headers:  {
            'Access-Control-Allow-Origin': '*',
        }
    };
    const urlApi = url.get.statistic.totalQuestions(getYear);
    let questions;
    let level = []; 
    axios.get(urlApi, config)
        .then(res => {
            questions = res.data.data[0]
            for (let question in questions) {
                if (question === 'tahun') {
                    continue;
                }
                level.push(questions[question]);
            }
            createChart();
        })
    function createChart() {
        const ctx = document.getElementById('bar-chart__content');
        if (ctx) {
            ctx.height = 200;
            const barChart = new Chart(ctx, {
            
                type: 'bar',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'],
                    datasets: [{
                        label: 'Jumlah laporan',
                        data: level,
                        backgroundColor: [
                            '#652420',
                            '#DC5A3F',
                            '#DC5A3F',
                            '#D5933A',
                            '#D5933A',
                            '#E5933D',
                            '#EED74F',
                        ],
                        barWidth: '20px'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    layout: {
                        padding: {
                            left: 24,
                            right: 24,
                            top: 24,
                            bottom: 24
                        }
                    }
                }
            });
        }
    }    
}