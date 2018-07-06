import axios from 'axios';

const url = {
    get: {
        map: {
            totalLevelsById(month, year, id) {
                return axios.get(`http://patriotpangan.com/nodejs/summary/getjumlahtarafbyprovid/${month}/${year}/${id}`);
            },
            totalReportsById(year, id) {
                return axios.get(`http://patriotpangan.com/nodejs/summary/gettotalquestionpertahunbyprovid/${year}/${id}`);
            },
            history(year, id) {
                return axios.get(`http://patriotpangan.com/nodejs/summary/getmaxtarafhistorypertahun/${year}/${id}`)
            },
            createMap() {
                return `http://patriotpangan.com/nodejs/summary/getkerawananallprov`;
            },
            detail: {
                levelDistrict(year, kondisi, id) {
                    return `http://patriotpangan.com/nodejs/summary/getkecamatanbytarafandprovid/${year}/${kondisi}/${id}`;
                },
                historyDistrict(year, id) {
                    return `http://patriotpangan.com/nodejs/summary/gettarafhistorypertahunbykecid/${year}/${id}`;
                }
            }
        },
        statistic: {
            totalLevels(month, year) {
                return `http://patriotpangan.com/nodejs/summary/getjumlahtarafallprov/${month}/${year}`;
            },
            totalQuestions(year) {
                return `http://patriotpangan.com/nodejs/summary/gettotalquestionpertahun/${year}`
            }
        },
        homepage: {
            summary() {
                return `http://patriotpangan.com/nodejs/webapi/homepage`;
            },
            articles() {
                return `http://patriotpangan.com/nodejs/artikel/getartikel/`;
            }
        },
        articles: {
            getArticle(id) {
                return `http://patriotpangan.com/nodejs/artikel/getdetailartikel/${id}`
            }
        }
    },
    post: {}
}

export { url }