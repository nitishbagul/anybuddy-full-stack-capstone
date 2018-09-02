//Step 1: Define functions, objects and variables

function displayError(message) {
    $("#messageBox span").html(message);
    $("#messageBox").fadeIn();
    $("#messageBox").fadeOut(4000);
};

//Execute Collpsible
function executeCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            $('.popup').hide();
            $('.all-forms-container').hide();
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

executeCollapsible();
//Step 2: Use functions, objects and variables(Triggers)

$(document).ready(function () {
    $("#messageBox").hide();
    $('main').hide();
    $('.log-in-container').hide();
    $('.register-container').hide();
    //$(handleMenuButtonClicks);
    $('.welcome-page').show();
});

//button triggers
$(document).on('click', '#logInButton', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.register-container').hide();
    $('.features-container').hide();
    $('.info-text').hide();
    $('.log-in-container').show();
    $('.welcome-page').show();
});

$(document).on('click', '.logout-button', function (event) {
    location.reload();
});


$(document).on('click', '.register-link', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.log-in-container').hide();
    $('.features-container').hide();
    $('.info-text').hide();
    $('.info-text').hide();
    $('.register-link').hide();
    $('.register-container').show();
    $('.welcome-page').show();
});

$(document).on('click', '.log-in-button', function (event) {
    event.preventDefault();

    //take the input from the user
    const username = $("#loginUserName").val();
    const password = $("#loginPassword").val();

    //validate the input
    if (username == "") {
        displayError('Please input user name');
    } else if (password == "") {
        displayError('Please input password');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const loginUserObject = {
            username: username,
            password: password
        };
        //console.log(loginUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/login',
                dataType: 'json',
                data: JSON.stringify(loginUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('main').hide();
                $('.my-events-page').hide();
                $('.menu-page').show();
                $('.username').text(result.username);
                $('#loggedInUserId').val(result._id);

            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
                displayError('Incorrect Username or Password');
            });
    };
});

$(document).on('click', '.register-button', function (event) {
    event.preventDefault();

    //take the input from the user
    const email = $("#registerEmail").val();
    const username = $("#registerUserName").val();
    const password = $("#registerPassword").val();

    //validate the input
    if (email == "") {
        displayError('Please add an email');
    } else if (username == "") {
        displayError('Please add a user name');
    } else if (password == "") {
        displayError('Please add a password');
    }
    //if the input is valid
    else {
        //create the payload object (what data we send to the api call)
        const newUserObject = {
            email: email,
            username: username,
            password: password
        };
        console.log(newUserObject);

        //make the api call using the payload above
        $.ajax({
                type: 'POST',
                url: '/users/create',
                dataType: 'json',
                data: JSON.stringify(newUserObject),
                contentType: 'application/json'
            })
            //if call is succefull
            .done(function (result) {
                console.log(result);
                $('main').hide();
                $('.my-events-page').hide();
                $('.menu-page').show();
                $('.username').text(result.username);
                $('#loggedInUserId').val(result._id);
            })
            //if the call is failing
            .fail(function (jqXHR, error, errorThrown) {
                console.log(jqXHR);
                console.log(error);
                console.log(errorThrown);
            });
    };

});

$(document).on('click', '.my-events-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.no-events-text').hide();
    $('.edit-event-container').hide();
    $('.delete-event-container').hide();
    $('.my-events-page').show();
    $('.menu-page').show();
});

$(document).on('click', '.nearby-events-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.my-events-page').hide();
    $('.nearby-events-page').show();
    $('.menu-page').show();
});
