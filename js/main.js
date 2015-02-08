$(document).ready(function () {


      $('#login-button').on('click', function(e){
          e.preventDefault();
          checkLogin();

      })


    $('#register-button').on('click', function(e){
        e.preventDefault();
        window.location.href = 'register.html';
    })

    $('#confirm-register').on('click', function(e){
        e.preventDefault();
        $('#myModal').modal('show')
    })

    $('#ok-register').on('click', function(e){
        e.preventDefault();
        window.location.href = 'index.html';
    })


    loadCategories('GET','webservices/categories.json',"");





});


function checkLogin(){

    var loginData = {};
    loginData.username = $("#user-name").val();
    loginData.password = $("#password").val() ;

    $.ajax({
        type: "POST",
        url: "webservices/login.json",
        data: loginData,
        dataType: "json",
        success: function (response) {

            if(response.status.login == "success"){
                console.log("success");
                window.location.href = 'home.html';
            }

        },

        error: function (data) {


        }
    }).always(function () {



        });
}

function loadCategories(type,service,data){


    $.ajax({
        type: type,
        url: service,
        data: data,
        dataType: "json",
        success: function (response) {

            $.each(response.categories, function(index,category){
                renderCategory(category);
                console.log(category)
                console.log(category.name)
                console.log(category.image)
            })

        },

        error: function (data) {


        }
    }).always(function () {



        });

}


function renderCategory(category){

    $("#categories-container").append('<div class="row"><div class="col-lg-4"><img src="'+category.image+'" alt="'+category.name+'" class="img-thumbnail"></div><div class="col-lg-8"><div class="panel panel-default"><div class="panel-heading"><h3 class="panel-title">'+category.name+'</h3></div><div class="panel-body">'+category.description+'</div></div></div></div>');
    $("#menu-left").append('<li class="list-group-item item-container">'+ category.name+'</li>');
}