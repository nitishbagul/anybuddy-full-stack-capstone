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
    $('main').hide();
    $('.my-events-page').hide();
    $('.menu-page').show();
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
