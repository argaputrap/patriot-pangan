import './map-details.scss';
import axios from 'axios';
import dt from 'datatables.net';
import { url } from '../../_services/url';
import * as $ from 'jquery';

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

function MapDetails() {
    this.isClicked = false;
    this.configLineChart;
}

MapDetails.prototype.getData = function() {
    
    const urlString = window.location.href;
    const urlParse = new URL(urlString);

    const level = urlParse.searchParams.get('value');
    const id = urlParse.searchParams.get('idprovince');
    const province = urlParse.searchParams.get('province');

    const self = this;

    const titleDOM = document.querySelector('.district-table__name');
    if (titleDOM) {
        titleDOM.textContent = province;
    }

    if (level && id) {
        const levels = ['Taraf 0', 'Taraf 1', 'Taraf 2', 'Taraf 3', 'Taraf 4', 'Taraf 5'];
        const levelArr = level.split('');

        const p = document.querySelector('.district-table__level');
        p.innerHTML = `Menampilkan data untuk: <b>${levels[levelArr[5]]}</b>`;
        fetchAPI();

        function fetchAPI() {
            // Date
            const date = new Date;
            const getYear = date.getFullYear();
            
            const urlAPI = url.get.map.detail.levelDistrict(getYear, levelArr[5], id);
            axios.get(urlAPI)
                .then(res => {
                    if (res.status === 200 && res.data.status) {
                        const data = res.data.data;
                        const regencyArr = [];

                        for (let regency in data) {
                            regencyArr.push(data[regency]);
                        }

                        const dataTable = $('#district-table__dt').DataTable({
                            columns: [
                                {title: 'ID'},
                                {title: 'Kecamatan'},
                                {title: 'Persentase'}
                            ],
                            columnDefs: [{
                                targets: 3,
                                data: null,
                                defaultContent:'<button class="btn-view btn btn-primary district-table__btn" type="button" data-toggle="modal" data-target="#detaiModal">Detail</button>'
                            }]
                        });

                        let percentage
                        regencyArr.forEach(data => {
                            for (let j in data.kecamatan) {
                    
                                if (data.kecamatan[j].jumlahpertanyaanyes === 0) {
                                    percentage = 0;
                                } else {
                                    percentage = data.kecamatan[j].jumlahpertanyaan / data.kecamatan[j].jumlahpertanyaanyes * 100
                                }

                                dataTable.row.add(
                                    [
                                        parseInt(j), 
                                        data.kecamatan[j].nama,
                                        percentage + ' %'
                                    ]
                                ).draw(false);   
                            }
                        });

                        
                        $('#district-table__dt tbody').on('click', 'button', function(){
                            const dataClicked = dataTable.row($(this).parents('tr')).data();
                            let regencyVal;
                            for (let regency in data) {
                                if (data[regency].kecamatan[dataClicked[0]]) {
                                    if (dataClicked[1] === data[regency].kecamatan[dataClicked[0]].nama) {                                    
                                        regencyVal = regency;
                                    }      
                                }
                                                         
                            }
                            self.createModal(dataClicked[0], dataClicked[1], regencyVal, province);
                        })

                    } else {
                        alert('Internal Server Error');
                    }
                }).catch(err => {
                    alert('Internal Server Error');
                    throw err;
                })
        }
    }
}

MapDetails.prototype.createModal = function(id, district, regency, province) {
    const districtTitle = document.querySelector('#district');
    const provinceTitle = document.querySelector('#province');
    const regencyTitle = document.querySelector('#regency');

    provinceTitle.textContent = `: ${province}`;
    districtTitle.textContent = `: ${district}`;
    regencyTitle.textContent = `: ${regency}`;

    // Date
    const date = new Date;
    const getYear = date.getFullYear();

    axios.get(url.get.map.detail.historyDistrict(getYear, id))
        .then(res => {
            if (res.status === 200) {
                const historyDistrict = res.data.data;
                let history = [];

                for (let month in historyDistrict) {
                    if (!historyDistrict[month]) {
                        historyDistrict[month] = 0;
                    }
                    history.push(parseInt(historyDistrict[month]));
                    if (!self.isClicked) {
                        createChart(history, self.isClicked);
                        self.isClicked = true;     
                    } else {
                        createChart(history, self.isClicked);
                    }
                   
                }
            } else {
                alert('Internal Server Error');
            }
        })
        .catch(err => {
            alert('Internal Server Error');
            throw err;
        })

    function createChart(data, isClicked) {
        const ctx = document.getElementById('modal__chart');
        let lineChart;
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
}

const mapDetails = new MapDetails();
mapDetails.getData();