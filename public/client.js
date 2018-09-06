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
            $('.event-joining p').show();
            $('.event-joining .join-event-button').show();
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


//Use Autocomplete to fill address

var placeSearch, autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {!HTMLInputElement} */
        (document.getElementsByClassName('autocomplete')[0]), {
            types: ['geocode']
        });

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = autocomplete.getPlace();

    for (var component in componentForm) {
        console.log(document.getElementsByClassName(component));
        // console.log(document.getElementsByClassName(component)[0]);
        document.getElementsByClassName(component).value = '';
        document.getElementsByClassName(component).disabled = false;
    }

    // Get each component of the address from the place details
    // and fill the corresponding field on the form.
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementsByClassName(addressType)[0].value = val;
        }
        document.getElementById('eventStreetAddress').value =
            place.address_components[0]['long_name'] + ' ' +
            place.address_components[1]['long_name'];
    }
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
        });
    }
}


function getLatLong(address) {
    return new Promise((resolve) => {
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: address,
                    key: 'AIzaSyDY5Mo1gHwOkP3SgAVQwrlCOP_lVVvtJDg'
                }
            })
            .then(function (response) {
                console.log(response);
                console.log(response.data.results[0].geometry.location.lat);
                let latLong = [response.data.results[0].geometry.location.lat, response.data.results[0].geometry.location.lng];
                resolve(latLong);

            })
            .catch(function (error) {
                console.log(error);
                resolve();
            });
    })

}

function getUserLatLong() {
    let userLat, userLng;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    function showPosition(position) {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        showEventsNearUser(userLat, userLng);
    }
}

function showEventsNearUser(userLat, userLng) {
    console.log(userLat, userLng);
    //make the api call to get all events based on GPS
    $.ajax({
            type: 'GET',
            url: '/events/get/' + userLat + '/' + userLng,
            dataType: 'json',
            contentType: 'application/json'
        })
        //if call is succefull
        .done(function (result) {
            console.log(result);
            if (result.events.length === 0) {
                displayError("No places found, please refine the search.")
            } else {
                let buildTheHtmlOutput = "";

                $.each(result.events, function (resultKey, resultValue) {
                    buildTheHtmlOutput += `<li data-eventid=${resultValue._id}>`;
                    buildTheHtmlOutput += `<div class="event-content collapsible">
<h3 class="event-header">${resultValue.eventTitle}</h3>
<h4 class="event-date">${resultValue.eventDate.slice(0,10)}, ${resultValue.eventTime}</h4>
<h5 class="event-address">${resultValue.eventStreetAddress}, ${resultValue.eventCity}</h5>
</div>`;
                    buildTheHtmlOutput += `<div class="event-joining collapse-content">
<p>Partners Required: <span class="required-partners">${resultValue.partnersRequired}</span></p>
<button class="join-event-button">Join Event</button>
<div class="request-join-details">
<form class="request-join-form" data-eventid=${resultValue._id}>
<fieldset name="contact-info" class="contact-info">

<label for="contactName">Name</label>
<input role="textbox" type="text" name="contactName" class="partnerName" required>

<label for="contactEmail">Email</label>
<input role="textbox" placeholder="foo@bar.com" type="email" name="contactemail" class="partnerEmail" required>

<label for="contactNumber">Phone</label>
<input role="textbox" type="tel" name="contactnumber" class="partnerPhone" required>

<button role="button" type="submit" class="request-joining-button">Join</button>

</fieldset>

</form>
</div>
</div>`;
                    buildTheHtmlOutput += `</li>`;
                    //console.log(buildTheHtmlOutput);

                    //use the HTML output to show it in all items table
                    $(`.nearby-events-page .events-list`).html(buildTheHtmlOutput);
                    executeCollapsible();
                    $('.menu-page').show();
                    $('.username').text(result.username);
                    $('#loggedInUserId').val(result._id);
                })

            }

        })
        //if the call is failing
        .fail(function (jqXHR, error, errorThrown) {
            console.log(jqXHR);
            console.log(error);
            console.log(errorThrown);
        });
}

//Step 2: Use functions, objects and variables(Triggers)

$(document).ready(function () {
    executeCollapsible();
    //    useAutoComplete();    $("#messageBox").hide();
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


$(document).on('click', '.my-events-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.no-events-text').hide();
    $('.edit-event-container').hide();
    $('.delete-event-container').hide();
    $('.my-events-list-container').show();
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

$(document).on('click', '.event-content', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.my-events-page').hide();
    $('.request-join-form').hide();
    $('.nearby-events-page').show();
    $('.menu-page').show();
});

$(document).on('click', '.join-event-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.my-events-page').hide();
    $('.event-joining p').hide();
    $('.event-joining .join-event-button').hide();
    $('.request-join-form').show();
    $('.nearby-events-page').show();
    $('.menu-page').show();
});

$(document).on('click', '.new-event-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.my-events-list-container').hide();
    $('.create-event-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();

});

$(document).on('click', '.edit-event-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.delete-event-container').hide();
    $('.edit-event-container').show();
    $('.my-events-list-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();

});

$(document).on('click', '.delete-event-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.edit-event-container').hide();
    $('.delete-event-container').show();
    $('.my-events-list-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();

});

$(document).on('click', '.delete-event-container .delete-event-button', function (event) {
    event.preventDefault();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.edit-event-container').hide();
    $('.delete-event-container').hide();
    $('.my-events-list-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();

});

//Form Triggers

$('.login-form').submit(function (event) {
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
                getUserLatLong();

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

$('.register-form').submit(function (event) {
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

$('.request-join-form').submit(function (event) {
    event.preventDefault();
    $('main').hide();
    $('.my-events-page').hide();
    $('.event-joining').hide();
    $('.nearby-events-page').show();
    $('.menu-page').show();
});

//$('.create-event-form').submit(function (event) {
//    event.preventDefault();
//    $('main').hide();
//    $('.nearby-events-page').hide();
//    $('.create-event-form').hide();
//    $('.my-events-list-container').show();
//    $('.my-events-page').show();
//    $('.menu-page').show();
//});

$('.create-event-form').submit(function (event) {
    event.preventDefault();
    //take the input from the user
    const ownerId = $('#loggedInUserId').val();
    const ownerName = $("#contactName").val();
    const ownerEmail = $("#contactEmail").val();
    const ownerPhone = $("#contactNumber").val();
    const eventTitle = $("#eventTitle").val();
    const eventDate = $("#eventDate").val();
    const eventTime = $("#eventTime").val();
    const eventStreetAddress = $("#eventStreetAddress").val();
    const eventCity = $("#eventCity").val();
    const eventState = $("#eventState").val();
    const eventZipcode = $("#eventZipCode").val();
    const eventCountry = $("#eventCountry").val();
    const partnersRequired = $("#requiredPartners").val();
    const creationDate = new Date();

    //validate the input
    if (eventTitle == "") {
        displayError('Please add event title');
    }
    //    else if (areaName == "Select.." || areaName == undefined || areaName == "") {
    //        displayError('Please add an Area');
    //    } else if (placeName == "Select.." || placeName == undefined || placeName == "") {
    //        displayError('Please add a Place');
    //    } else if (categoryName == "Select.." || categoryName == undefined || categoryName == "") {
    //        displayError('Please add a Category');
    //    }
    //if the input is valid
    else {
        let lat, lng;
        let adddressString = `${eventStreetAddress} ${eventCity} ${eventState}`;
        getLatLong(adddressString).then((result) => {
            console.log(result);
            lat = result[0];
            lng = result[1];

            //create the payload object (what data we send to the api call)
            const newEventObject = {
                ownerId: ownerId,
                ownerName: ownerName,
                ownerEmail: ownerEmail,
                ownerPhone: ownerPhone,
                eventTitle: eventTitle,
                eventDate: eventDate,
                eventTime: eventTime,
                eventStreetAddress: eventStreetAddress,
                eventCity: eventCity,
                eventState: eventState,
                eventZipcode: eventZipcode,
                eventCountry: eventCountry,
                lat: lat,
                lng: lng,
                partnersRequired: partnersRequired
            };
            //console.log(newItemObject);

            //make the api call using the payload above
            $.ajax({
                    type: 'POST',
                    url: '/events/create',
                    dataType: 'json',
                    data: JSON.stringify(newEventObject),
                    contentType: 'application/json'
                })
                //if call is succefull
                .done(function (result) {
                    console.log(result);
                    $("#eventTitle").val("");
                    $("#eventDate").val("");
                    $("#eventTime").val("");
                    $("#eventStreetAddress").val("");
                    $("#eventCity").val("");
                    $("#eventState").val("");
                    $("#eventZipCode").val("");
                    $("#eventCountry").val("");
                    $("#contactName").val("");
                    $("#contactEmail").val("");
                    $("#contactNumber").val("");
                    $("#requiredPartners").val("");
                    $('.create-event-container').hide();
                    $('.my-events-list-container').show();
                    displayError("Event created succesfully");
                })
                //if the call is failing
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        });
    };

});

$('.edit-event-form').submit(function (event) {
    event.preventDefault();
    $('main').hide();
    $('.nearby-events-page').hide();
    $('.create-event-container').hide();
    $('.edit-event-container').hide();
    $('.delete-event-container').hide();
    $('.my-events-list-container').show();
    $('.my-events-page').show();
    $('.menu-page').show();
});
