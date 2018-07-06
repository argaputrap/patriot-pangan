require('./articles.scss');
import axios from 'axios';
import { url } from '../_services/url';

function Articles() {}

Articles.prototype.getData = function() {
    const urlString = window.location.href;
    const urlParse = new URL(urlString);

    const idArticle = urlParse.searchParams.get('id');

    const config = {
        headers: {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJpZCI6MiwiZW1haWwiOiJ0ZXNAZ21haWwuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkbFk5TVQ0U2Fwbm9nNHRCRmZma05FT0l3WjVKVGF4cDdkbFZQM1l0cUh2UGY3QWc2RmRtMGEiLCJuYW1hIjoidGVzIiwiY3JlYXRlZEF0IjoiMjAxOC0wNy0wMlQxMjoxNzowMy4wMDBaIiwidXBkYXRlZEF0IjoiMjAxOC0wNy0wMlQxMjoxNzowMy4wMDBaIn0sInJvbGUiOiJhZG1pbiIsImlhdCI6MTUzMDc4NTc2MiwiZXhwIjozMzA2Njc4NTc2Mn0.wRYPMQEGfSJQa2wrKXpASVr0kjbz4K7Bvp7FGxj0vPs'
        }
    }

    axios.get(url.get.articles.getArticle(idArticle), config)
        .then(res => {
            if (res.status === 200 && res.data.status) {
                console.log(res);
                const paragraph = document.querySelector('.article-main__paragraph');
                const titleHeader = document.querySelector('.article-header__title');
                const titleMain = document.querySelector('.article-main__title');
                const img = document.querySelector('.article-header__img');

                if (paragraph) {
                    paragraph.innerHTML = res.data.data.isi;
                    titleHeader.textContent = res.data.data.judul;
                    titleMain.textContent = res.data.data.judul;
                    img.src = `http://patriotpangan.com/nodejs/public/images/artikels/${res.data.data.pathfoto}`;
                }
               

            } else {
                alert('Internal Server Error');
            }
        })
        .catch(err => {
            alert('Internal Server Error');
            throw err;
        })
}

const article = new Articles();
article.getData();