// import 'bootstrap/dist/css/bootstrap.min.css'
import './map.scss';
import Chart from 'chart.js'
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Router } from '../_services/router';
import { url } from '../_services/url';
import axios from 'axios';

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


class Map {
    constructor() {
        this.isClicked = false;
        this.configBarChartHorizontal;
        this.configPieChart;
        this.configBarChart;
        this.configLineChart;
    }
}

Map.prototype.createMap = function() {
    const width = 960,
    height = 400;
    const projection = d3.geo.mercator()
        .scale(1150)
        .translate([-1900, 150]);

    const path = d3.geo.path()
        .projection(projection);

    const svg = d3.select('.map__container').append('svg')
        .attr('width', width)
        .attr('height', height);

    const tooltip = d3.select('.map__container').append('div')   
        .attr('class', 'map__tooltip')               
        .style('opacity', 0);
    
    const div = document.createElement('div');
    div.className = 'map-detail';
    const self = this;
    d3.json("/src/id2.json", function(error, id) {
        if (!error) {
            axios.get(url.get.map.createMap())
            .then(res => {
                const provArr = res.data.data;
                const provinceArr = id.objects.regency.geometries
                provArr.forEach(prov => {
                    for (let i = 0; i < provinceArr.length - 1; i++) {
                        if ( provinceArr[i].properties.CC_1 == 94) {
                            provinceArr[i].properties.CC_1 = '92';
                        }
                        if (prov.id == provinceArr[i].properties.CC_1) {
                            provinceArr[i].properties.CONDITION = prov.kondisi
                        }
                    }
                });

                svg.append('g')
                    .selectAll('path')
                    .data(topojson.feature(id, id.objects.regency).features)
                    .enter().append('path')
                    .attr('d', path)
                    .attr('class', function(d) {
                        switch(d.properties.CONDITION) {
                            case 0:
                                return 'kondisi-0';
                                break;
                            case 1:
                                return 'kondisi-1';
                                break;
                            case 2:
                                return 'kondisi-2';
                                break;
                            case 3:
                                return 'kondisi-3';
                                break;
                            case 4:
                                return 'kondisi-4';
                                break;
                            case 5:
                                return 'kondisi-5';
                                break;
                        }
                    })
                .on('mouseover', function(d) {
                    d3.select(this).transition().duration(300).style('opacity', 1);
                    tooltip.transition()
                        .text('Nama: ' + d.properties.NAME_1 + '\n' + 'Kondisi: ' + d.properties.CONDITION)
                        .duration(300)
                        .style('opacity', 1)
                        .style('left', (d3.event.pageX - 50) + 'px')
                        .style('top', (d3.event.pageY - 300) + 'px');
                })
                .on('click', function(d) {
                    const property = d.properties;
                    const province = property.NAME_1;
                    const idProvince = property.CC_1;

                    // Get date
                    const date = new Date();
                    const getMonth = date.getMonth();
                    const getYear = date.getFullYear();
                    // Parse API
                    axios.all(
                        [
                            url.get.map.totalLevelsById(getMonth, getYear, idProvince), 
                            url.get.map.totalReportsById(getYear, idProvince),
                            url.get.map.history(getYear, idProvince)
                        ]
                    )
                        .then(axios.spread((resLevels, resReports, resHistory) => {  
                            if (resLevels.status === 200) {
                                const levelDistrict = resLevels.data.data;
                                const reportDistrict = resReports.data.data[0];
                                const historyDistrict = resHistory.data.data;

                                let level = [];
                                let report = [];
                                let history = [];

                                let totalLevel;

                                for (let catergory in levelDistrict) {
                                    if (catergory === 'jumlahKecamatan') {
                                        totalLevel = levelDistrict[catergory];
                                        continue;
                                    }
                                    level.push(levelDistrict[catergory].count);
                                }
                                for (let question in reportDistrict) {
                                    if (question === 'rgn_district' || question === 'tahun') {
                                        continue;
                                    }
                                    report.push(parseInt(reportDistrict[question]));
                                }
                                for (let month in historyDistrict) {
                                    if (!historyDistrict[month]) {
                                        historyDistrict[month] = 0;
                                    }
                                    history.push(parseInt(historyDistrict[month]));
                                }
                                let h2;               
                                if (!self.isClicked) {
                                    // Create title element
                                    h2 = document.createElement('h2');
                                    h2.classList.add('indonesia-map-detail__title');
                                    // h2.appendChild(document.createTextNode(province));
                                    h2.textContent = province;
                                    self.totalDistrictLevels(level, idProvince, province, self.isClicked);
                                    self.percentageDistrictLevels(level, totalLevel, self.isClicked);
                                    self.totalReports(report, self.isClicked);
                                    self.history(history, self.isClicked)
                                    self.isClicked = true;
                                } else {
                                    h2 = document.querySelector('h2');
                                    h2.textContent = province;
                                    self.totalDistrictLevels(level, idProvince, province, self.isClicked);
                                    self.percentageDistrictLevels(level, totalLevel, self.isClicked);
                                    self.totalReports(report, self.isClicked);
                                    self.history(history, self.isClicked)
                                }
                        
                                const mapDetails = document.querySelector('.indonesia-map-detail');
                                mapDetails.insertBefore(h2, mapDetails.firstChild); 
                                
                                mapDetails.style.display = 'block';
                                
                            } else {
                                alert('Internal Server Error');
                            }
                            
                        }))
                        .catch(err => {
                            throw err;
                        })
                });

            svg.append("path")
                .datum(topojson.mesh(id, id.objects.regency, function(a, b) { return a !== b; }))
                .attr("class", "boundary")
                .attr("d", path);
                
            })
            .catch(err => {
                throw err;
            })
            
        } else {
            const div = document.createElement('div');
            div.classList.add('alert alert-danger text-center');
            div.appendChild(document.createTextNode('Error: ', error));

            const map = document.querySelector('.map');
            map.insertBefore(div, map.firstChild)
            d3.select(self.frameElement).style("height", height + "px");
            throw error;
        }
    });
}

Map.prototype.totalDistrictLevels = function(data, id, province,isClicked) {
    let barChartHorizontal;
    function createChart() {
        const ctx = document.getElementById('total-district-levels__chart');
        if (ctx && !isClicked) {
            ctx.height = 200;
            self.configBarChartHorizontal = {
                type: 'horizontalBar',
                data: {
                    labels: ['Taraf 0', 'Taraf 1', 'Taraf 2', 'Taraf 3', 'Taraf 4', 'Taraf 5'],
                    datasets: [{
                        label: `Jumlah Kecamatan Berdasarkan Taraf`,
                        data,
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
                    },
                    onClick: function(event, array) {
                        const label = array[0]._model.label;
                        const labelArray = label.split('').filter(label => {
                            if (label !== ' ') {
                                return label;
                            }
                        });
                        const labelFixed = labelArray.join('').toLowerCase();
                        Router.navigate(`/map-details.html?value=${labelFixed}&idprovince=${id}&province=${province}`)
                        // const url = new URL('http://localhost:3000/map-details.html?value=' + labelFixed + '&idprovince=' + id + '&province= ' + province);
                        // url.href
                    }
                }
            }
            barChartHorizontal = new Chart(ctx, self.configBarChartHorizontal);
        } else {
            self.configBarChartHorizontal.data.datasets[0].data = data;
            barChartHorizontal = new Chart(ctx, self.configBarChartHorizontal);
        }
       
    }
    createChart();
}

Map.prototype.percentageDistrictLevels = function(data, total, isClicked) {
    let pieChart;
    function createChart() {
        const ctx = document.getElementById('percentage-district-levels__chart');
        if (ctx && !isClicked) {
            ctx.height = 200;
            self.configPieChart = {
                type: 'pie',
                data: {
                    labels: ['Taraf 0', 'Taraf 1', 'Taraf 2', 'Taraf 3', 'Taraf 4', 'Taraf 5'],
                    datasets: [{
                        label: `Jumlah Desa Berdasarkan Taraf per desa`,
                        data,
                        backgroundColor: [
                            '#457f3a',
                            '#62b648',
                            '#d3ee52',
                            '#d5933a',
                            '#dc5a3f',
                            '#652420',
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
            }
            pieChart = new Chart(ctx, self.configPieChart);
        } else {
            self.configPieChart.data.datasets[0].data = data;
            pieChart = new Chart(ctx, self.configPieChart);
        }
    }

    createChart();
}

Map.prototype.totalReports = function(data, isClicked) {
    let barChart;
    function createChart() {
        const ctx = document.getElementById('total-reports__chart');
        if (ctx && !isClicked) {
            ctx.height = 200;
            self.configBarChart = {            
                type: 'bar',
                data: {
                    labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7'],
                    datasets: [{
                        label: 'Jumlah laporan',
                        data,
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
            }
            barChart = new Chart(ctx, self.configBarChart);
        } else {
            self.configBarChart.data.datasets[0].data = data;
            barChart = new Chart(ctx, self.configBarChart);
        }
    }

    createChart();
}

Map.prototype.history = function(data, isClicked) {
    function createChart() {
        const ctx = document.getElementById('history__chart');
        let lineChart
        if (ctx && !isClicked) {
            ctx.height = 200;
            self.configLineChart =  {
                type: 'line',
                data: {
                    labels: 
                        ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'November', 'Desember'],
                    datasets: [{
                        label: 'Taraf',
                        data,
                        fill: false,
                        backgroundColor: ['#000'],
                        barWidth: '20px'
                    }]
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Taraf',
                                    fontSize: 16
                                }
                            }
                        ],
                        xAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Bulan',
                                    fontSize: 16
                                }
                            }
                        ]
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
            }
            lineChart = new Chart(ctx, self.configLineChart);
        } else {
            self.configLineChart.data.datasets[0].data = data;
            lineChart = new Chart(ctx, self.configLineChart);
        }
    }
    
    createChart();
}

const map = new Map();
map.createMap();