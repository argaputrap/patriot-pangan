//import '@fontawesome/fontawesome-free/css/fontawesome.css'
// import 'font-awesome/css/font-awesome.css';
import 'bootstrap';
import './homepage.scss';
import 'goodshare.js';

import axios from 'axios';
import { url } from '../_services/url';
import { Auth } from '../_services/auth';


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
    navSignOut.style.display = 'block';

} else {
    navAdmin.style.display = 'none';
    navSignOut.style.display = 'none';
    // Get admin body
    const adminBody = document.querySelector('.body-admin');
    if (location.href === 'http://localhost:3000/admin.html') {
        location.href = 'http://localhost:3000';
    }
}


function Homepage() {
} // class Homepage {}

Homepage.prototype.getData = function() {
    const total = {}
    const urlAPI = url.get.homepage.summary();
    axios.get(urlAPI)
        .then(response => {
            total.artikel = response.data.data.totalartikel;
            total.kerawanan = response.data.data.totalkerawanan;
            total.patriot = response.data.data.totalpatriot;

            this.setData(total)
        })
        .catch(err => {
            alert('Internal Server Error');
            throw err;
        })
}

Homepage.prototype.setData = function(total) {
    if (total && window.location.href === 'http://localhost:3000/') {
        const desa = document.getElementById('desa');
        const kisah = document.getElementById('kisah');
        const patriot = document.getElementById('patriot');
    
        const desaTitle = document.createElement('h3')
        desaTitle.className = 'desa-total';
        const kisahTitle = document.createElement('h3')
        kisahTitle.className = 'desa-total';
        const patriotTitle = document.createElement('h3')
        patriotTitle.className = 'desa-total';

        // Insert tingkat kerawanan desa
        kisahTitle.appendChild(document.createTextNode(total.artikel));
        kisah.insertBefore(kisahTitle, kisah.firstChild);
    
        // Insert total desa/kecamatan
        desaTitle.appendChild(document.createTextNode(total.kerawanan))
        desa.insertBefore(desaTitle, desa.firstChild);
    
        // Insert total patriot
        patriotTitle.appendChild(document.createTextNode(total.patriot));
        patriot.insertBefore(patriotTitle, patriot.firstChild);
    }

}

Homepage.prototype.getArticle = function() {
    const urlAPI = url.get.homepage.articles();
    const config = {
        headers:  {
            'Access-Control-Allow-Origin': '*',
            'token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJpZCI6MiwiZW1haWwiOiJ0ZXNAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkbFk5TVQ0U2Fwbm9nNHRCRmZma05FT0l3WjVKVGF4cDdkbFZQM1l0cUh2UGY3QWc2RmRtMGEiLCJuYW1hIjoidGVzIiwiY3JlYXRlZEF0IjoiMjAxOC0wNy0wMlQxMjoxNzowMy4wMDBaIiwidXBkYXRlZEF0IjoiMjAxOC0wNy0wMlQxMjoxNzowMy4wMDBaIn0sInJvbGUiOiJhZG1pbiIsImlhdCI6MTUzMDU5NjQ3MywiZXhwIjozMzA2NjU5NjQ3M30.eQg-v4FSK70aLIHskEf0OdHyP2Bagf8M1gV6Zy901G0'
        }
    };
    axios(urlAPI, config)
        .then(res => {
            console.log(res);
            if (res.status === 200 && res.data.status) {
                const result = res.data.data;
                const story = document.querySelector('.fakta-pangan__story');
                const highlightBtn = document.querySelector('.kisah__highlight-btn');
                const idArticle = result[result.length - 1].id

                if (highlightBtn) {
                    highlightBtn.addEventListener('click', function() {
                        location.href = `http://localhost:3000/articles.html?id=${idArticle}`;
                    })
                }

 
                let card = '';
                let images = [];
                const limit = result.length - 4;
                if (result.length < 3) {
                    for (let i = 0; i < result.length; i++) {
                        card += 
                        `
                            <div class="col-md-4 col-sm-12 col-xs-12">
                                <div class="card card-story">
                                    <img class="card-img-top" src="http://patriotpangan.com/nodejs/public/images/artikels/${result[i].pathfoto}" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title">${result[i].judul}</h5>
                                        <p class="card-text">
                                           ${result[i].isi.split(' ').splice(0, 15).join(' ') + '...'}
                                        </p>
                                        <a href="/articles.html?id=${result[i].id}" class="card-link pull-right">
                                            READ MORE
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `
                        images.push(result[i].pathfoto);
                    }
                } else {
                    for (let i = result.length - 1; i > limit ; i -= 1) {
                        card += 
                        `
                            <div class="col-md-4 col-sm-12 col-xs-12">
                                <div class="card card-story">
                                    <img class="card-img-top" src="http://patriotpangan.com/nodejs/public/images/artikels/${result[i].pathfoto}" alt="Card image cap">
                                    <div class="card-body">
                                        <h5 class="card-title">${result[i].judul}</h5>
                                        <p class="card-text">
                                           ${result[i].isi.split(' ').splice(0, 15).join(' ') + '...'}
                                        </p>
                                        <a href="/articles.html?id=${result[i].id}" class="card-link pull-right">
                                            READ MORE
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `
                        images.push(result[i].pathfoto);
                    }
                }
              

                if (story) {
                    story.innerHTML = card;
                    this.getCarousel(images);
                }

            } else {
                // alert('Internal Server Error');
            }
        })
}

Homepage.prototype.getCarousel = function(images) {
    let firstSlide = document.querySelector('#firstSlide');
    let secondSlide = document.querySelector('#secondSlide');
    let thirdSlide = document.querySelector('#thirdSlide');


    firstSlide.src = `http://patriotpangan.com/nodejs/public/images/artikels/${images[2]}`;
    secondSlide.src = `http://patriotpangan.com/nodejs/public/images/artikels/${images[1]}`;
    thirdSlide.src = `http://patriotpangan.com/nodejs/public/images/artikels/${images[0]}`;
}

Homepage.prototype.signin = function() {
    const auth = new Auth;

    const btnAuth = document.querySelector('.form-auth__button');
    if (btnAuth) {
        btnAuth.addEventListener('click', auth.signIn);
    }
}

Homepage.prototype.signout = function() {
    const signoutBtn = document.querySelector('.nav-signout');
    signoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const auth = new Auth;
        auth.signOut();
        location.reload();
    })
}

const homepage = new Homepage();
homepage.getData();
homepage.getArticle();
homepage.signin();
homepage.signout();