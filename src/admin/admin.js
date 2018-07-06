import './admin.scss';
import * as $ from 'jquery';
import 'bootstrap';
import dt from 'datatables.net';
import 'froala-editor/js/froala_editor.min';
import 'froala-editor/css/froala_editor.min.css';
import axios from 'axios';

// import toastr
import * as Toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';

$(document).ready(function() {

    var BASE_URL = 'http://patriotpangan.com/nodejs/';
    var token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJwYXNzd29yZCI6IiQyYiQxMCRpM0p2YUc0U1UuOU9oZWZJcHNmenZlQ0V0cWNpeVhIcW55VE1xVUo3YXhjTDg0LkZmc1F0SyIsIm5hbWEiOiJHdW50dXIgUHV0cmEgUHJhdGFtYSIsImNyZWF0ZWRBdCI6IjIwMTgtMDctMDJUMDc6MzI6MDcuMDAwWiIsInVwZGF0ZWRBdCI6IjIwMTgtMDctMDJUMDc6MzI6MDcuMDAwWiJ9LCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MzA2ODczNzIsImV4cCI6MzMwNjY2ODczNzJ9.3XEPCJf0xHbwMK0R7Jho8nH4e2w64I4en74IjGjEAMY';
    
    //form tambah atribut
    var judulArtikel;
    var isiArtikel;
    var fotoArtikel;

    //form edit atribut
    var artikelIdEdit;
    var judulArtikelEdit;
    var isiArtikelEdit;
    var fotoArtikelEdit;

    var url = BASE_URL+'admin/addartikel';
    var loading = document.getElementById('loader');
    var Artikels;

    //on page init
    if(window.location.pathname =='/admin.html'){
        getAllArtikel();
    }
        
    // loader
    var loaderBtn = {
        show: ()=>{
            loading.setAttribute("style", "display:true");
        },
        hide: () =>{
            loading.setAttribute("style", "display:none");            
        }
    }
    // set loader default to hide
    loaderBtn.hide();

    // init datatable
    const table = $('#artikelTable').DataTable({
        columns: [
            {
                title: 'No'
            },
            {
                title: "Id Artikel"
            },{
                title: "Judul" 
            },{
                title: "Tanggal"
            },{
                title: "Aksi"
            }
        ],
        columnDefs: [
            {
                targets: 4,
                data: null,
                defaultContent:`
                    <button style="margin:5px; float:left; width:80px" class="btn btn-success editBtn" data-toggle="modal" data-target="#editModal">Edit</button>
                    <button style="margin:5px; float:left; width:80px" type="submit" class="btn btn-danger deleteBtn">Delete</button>
        
                `
            }
        ]
    });
    // call editor
    $('#editorTambah').froalaEditor()
    $('#editorEdit').froalaEditor();

// DOM TAMBAH    
    // on click submit tambah artikel
    document.querySelector('#submitTambah').addEventListener('click', ()=>{

        judulArtikel = document.getElementsByName('judulArtikel')[0].value;
        isiArtikel = $('#editorTambah').froalaEditor('html.get');
        fotoArtikel = document.getElementById('fotoArtikel').files;
        let claims = {
            judul: judulArtikel,
            isi: isiArtikel
        }        
        
        // req with XHR
        let isValid = validationForm(0);
        if(isValid){
            loaderBtn.show();
            submitTambah(url, fotoArtikel, claims);
        }
    })

// DOM EDIT
    // oon click submit edit artikel
    document.querySelector('#submitEdit').addEventListener('click', ()=>{
        judulArtikel = $('#formEdit').find('input[name="judulArtikel"]').val();
        isiArtikel = $('#editorEdit').froalaEditor('html.get');

        let claims = {
            judul: judulArtikel,
            isi: isiArtikel
        }
        let isValid = validationForm(1);
        
        // req api
        if(isValid){
            // patriotpangan.com/nodejs/admin/editartikel/idartikel
            let url = BASE_URL+'admin/editartikel/'+artikelIdEdit;
            submitEdit(url, claims);
        }
    })
    // on change file 
    document.querySelector('#fotoArtikelEdit').addEventListener('change', (e)=>{
        fotoArtikelEdit = false;
        let file = e.target.files;
        let url = BASE_URL+'admin/editphotoartikel/'+artikelIdEdit;
        uploadFile(url, file);
    })
    // edit btn || show up modal & set the value
    $('#artikelTable tbody').on( 'click', '.editBtn', function () {
        var data = table.row( $(this).parents('tr') ).data();
        let id = data[1];

        //find artikel from artikels
        let artikel = Artikels.find((artikel)=>{
            return artikel.id == id;
        })

        // set the form value
        $('#formEdit').find('input[name="judulArtikel"]').val(artikel.judul);
        $('#editorEdit').froalaEditor('html.set', artikel.isi);
        //set the form 
        judulArtikelEdit = $('#formEdit').find('input[name="judulArtikel"]').val();
        isiArtikelEdit = $('#editorEdit').froalaEditor('html.get');
        fotoArtikelEdit = artikel.pathfoto;
        artikelIdEdit = artikel.id;
    });
// DOM DELETE
    // delete btn || show up alert to get confirmation
    $('#artikelTable tbody').on( 'click', '.deleteBtn', function () {
        var data = table.row( $(this).parents('tr') ).data();
        let status = confirm('Apakah anda yakin ingin menghapus ini?');
        // if confim true
        if(status){
            let url = BASE_URL+'admin/deleteartikel'
            let claims = {
                id: data[1]
            }
            deleteArtikel(url, claims);
        }
    });

// Method
    /**
     * component function
     */
    function initTable(){
        let counter = 1; 
        let month = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
        table.clear();
        for(let data of Artikels){
            let id = data.id;
            let judul = data.judul;
            let date = new Date(data.tanggalpublish)
            let tanggal = date.getDate();
            let bulan = month[date.getMonth()];
            let tahun = date.getFullYear()
            let parsedDate = tanggal+' '+bulan+' '+tahun+' '+date.getHours()+' '+ date.getMinutes();

            // add data to row data tables
            table.row.add([
                counter,
                id,
                judul, 
                parsedDate,

            ]).draw().node();
            counter++
        } 

    }
    function validationForm (type){ // 0 = validation form tambah, 1= validaton form edit
        if(type == 0){
            if(isiArtikel && judulArtikel && fotoArtikel.length )
                return true
            else 
                return false
        }
        if(type == 1){
            if(isiArtikelEdit && judulArtikelEdit && fotoArtikelEdit )
                return true
            else 
                return false     
        }
    }
    function resetForm(idForm){ // idForm = id DOM form
        let form = document.getElementById(idForm);
        judulArtikel = '';
        isiArtikel = '';
        fotoArtikel = '';
        form.reset();
    }
    /** 
     * API
    */
    function submitTambah(url, files, claims){
        var formData = new FormData();
        // append file
        for(var i = 0; i < files.length; i++) {
            formData.append('foto' ,files[i],files[i].name);
        }
        // append others atribut to formdata
        formData.append("judul", claims.judul);
        formData.append("isi", claims.isi);

        let header = {
            'Content-Type': 'multipart/form-data',
            'token': token,
            'Access-Control-Allow-Origin': '*'            
        }          
        
        axios.post(url, formData, {headers: header} )
        .then(xhr =>{
            loaderBtn.hide();
            //hide modal
            $('#tambahModal').modal('hide');
            $(".modal-backdrop").remove();
            
            //reset the form
            resetForm('formTambah');
            //refresh data   
            getAllArtikel()         

            Toastr.success(xhr.data.message);            
        }).catch( err =>{
            alert('Terjadi kesalahan, menambah Artikel gagal');
        })

    }
    function uploadFile(url, files){
        var formData = new FormData();
        // append file
        for(var i = 0; i < files.length; i++) {
            formData.append('foto' ,files[i],files[i].name);
        }
        let header = {
            'Content-Type': 'multipart/form-data',
            'token': token,
            'Access-Control-Allow-Origin': '*'            
        }
        axios.post(url, formData, {headers: header} )
        .then(xhr =>{
            fotoArtikelEdit = true;
            Toastr.success('Berhasil memperbarui foto');           
        }).catch( err =>{
            fotoArtikelEdit =true;
            alert('Terjadi kesalahan, menambah Artikel gagal');
            throw err;
        })        

    }
    function submitEdit(url, claims){
        let header = {
            'token': token
        }
        axios.post(url, claims, {headers: header})
        .then(res=>{
            let data = res.data;
            if(data.status){
                //hide modal
                $('#editModal').modal('hide');
                $(".modal-backdrop").remove();
                
                //reset the form
                resetForm('formEdit');
                Toastr.success(data.message);
                
                //refresh data   
                getAllArtikel();
                // initTable();          
            }
            else{
                Toastr.success(data.message);
            }
        }, err =>{
            Toastr.success(data.message);
            throw err;
        })
    }
    function deleteArtikel(url, claims){
        console.log('artikel id delete ', claims.id)
        let header = {
            'token': token
        }
        axios.post(url, claims, {headers: header})
        .then(res=>{
            let data = res.data;
            if(data.status){
                Toastr.success(data.message);                
                //refresh data   
                getAllArtikel();      
            }
            else{
                Toastr.success(data.message);
            }
        }, err =>{
            Toastr.success(data.message);
        })        
    }
    function getAllArtikel(){
        let url = BASE_URL+'artikel/getartikel';
        let header = {
            'token': token
        }              
        axios.get(url, {headers: header} )
        .then(res =>{
            let data = res.data;
            if(data.status ){
                Artikels = data.data;
                initTable()
            }
            else {
                Toastr.error(data.message);
            }
        }, err =>{
            Toastr.error('request gagal');
            throw err;
        })
    }

});