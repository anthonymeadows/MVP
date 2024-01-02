$(document).ready(function() {
    if (window.location.href.indexOf("content.html") > -1) {
        mustLogin()
        destroyPage();
        buildPage();
    }
});

function mustLogin() {
    if(!isValidUser()) {
        navigateToLogin()
    }
}

let currentUser = localStorage.getItem('username');

function validateLogin(e) {
    e.preventDefault();

    let username = $('#username').val();
    let password = $('#password').val();

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    $.get('/validateLogin', { username: username, password: password })
        .done((response) => {
            if (response.success) {
                localStorage.clear();
                alert('Login successful!\nUsername: ' + username);
                localStorage.setItem(`username`, username);
                window.location.href = "content.html";
            } else {
                alert('Login failed. Please enter valid credentials.');
                localStorage.clear();
            }
        })
        .fail(() => {
            alert('Error occurred while processing login.');
        });
}

function isValidUser() {
    const username = localStorage.getItem('username');
    const isValid = !!username;
    return isValid;
}

function createUser(e) {
    e.preventDefault();
    localStorage.clear();

    const email = $('#email').val();
    const username = $('#username').val();
    const password = $('#password').val();
    const password2 = $('#password2').val();

    if (!username || !password || !email || !password2) {
        alert('All fields must be filled out');
        return;
    }

    if (password !== password2) {
        alert('Passwords do not match');
        return;
    }

    const userData = {
        email: email,
        username: username,
        password: password
    };
    $.ajax({
        url: '/create',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function(response) {
            console.log('Server response:', response);
            alert('User created successfully, please wait to be redirected');
            navigateToLogin();
        },
        error: function(error) {
            console.error('Error from post:', error);
            alert('Error creating user. Please try again.');
        }
    });
}

function navigateToLogin() {
    localStorage.clear();
    window.location.href = "login.html";
}

function navigateToCreate() {
    localStorage.clear();
    window.location.href = "create.html";
}

function buildPage() {
    mustLogin();
    let currentUserContainer = $('<div>').attr('id', 'currentUserContainer');
    let currentUserElement = $('<div>').attr('id', 'currentUser');
    let underline = $('<div>').attr('id', 'underline');

    currentUserContainer.append(currentUserElement, underline);

    let landingPage = $('<div>').addClass('landingPage');

    let earth = $('<div>').attr('id', 'earth');
    let earthImg = $('<img>').attr('src', '/images/earth_tran_bg.png');
    earth.append(earthImg);

    let rocket = $('<div>').attr('id', 'rocket');
    let rocketImg = $('<img>').attr('src', '/images/rocket_ship_TB.png').on('click', handleRocketClick);
    rocket.append(rocketImg);

    let rocketBox = $('<div>').addClass('rocket-box').on('click', handleRocketClick);
    let rocketBoxText = $('<p>').text('Explore other decks');
    rocketBox.append(rocketBoxText);

    let satellite = $('<div>').attr('id', 'satellite').on('click', handleSatelliteClick);
    let satelliteImg = $('<img>').attr('src', '/images/satellite.png');
    satellite.append(satelliteImg);

    let satelliteBox = $('<div>').addClass('satellite-box').on('click', handleSatelliteClick);
    let satelliteBoxText = $('<p>').text('View my decks');
    satelliteBox.append(satelliteBoxText);

    let satelliteline = $('<div>').attr('id', 'satelliteline');

    let satelliteline2 = $('<div>').attr('id', 'satelliteline2');

    let moon = $('<div>').attr('id', 'moon').on('click', handleMoonClick);
    let moonImg = $('<img>').attr('src', '/images/moon.png');
    let plus = $('<div>').attr('id', 'plus').append($('<img>').attr('src', '/images/plus.png'));
    moon.append(moonImg, plus);

    let moonBox = $('<div>').addClass('moon-box').on('click', handleMoonClick);
    let moonBoxText = $('<p>').text('Create a new deck');
    moonBox.append(moonBoxText);

    landingPage.append(earth, rocket, rocketBox, satellite, satelliteBox, satelliteline, satelliteline2, moon, moonBox);

    $('body').append(currentUserContainer, landingPage);

    if (currentUser) {
        $("#currentUser").text(`Hello, ${currentUser}`);
    }
}

function destroyPage(element) {
    if (element) {
        $(element).remove();
    } else {
        $('#currentUserContainer, .landingPage').remove();
    }
}

function handleRocketClick() {
    destroyPage();
}

function handleSatelliteClick() {
    destroyPage();
}

function handleMoonClick() {
    destroyPage();
    mustLogin();

    let moon = $('#moonpagemoon');
    moon = $('<div>').attr('id', 'moonpagemoon').on('click', handleMoonClick);
    let moonImg = $('<img>').attr('src', '/images/moon.png');

    let cardContainer = $('<div>').attr('id', 'cardContainer');
    let deckName = $('<input>').attr('id','deckName').attr('type', 'text');

    let backBtn = $('<button>', {
        id: 'backBtn',
        text: 'Back to homepage'
    }).css({
        'position': 'absolute',
        'top':'20px',
        'right':'20px'
    })

    let deckListContainer = $('<div>', {
        id: 'deckListContainer',
        text: 'Your Deck List'
    }).css({
        'text-align':'center',
        'height': '750px',
        'width': '400px',
        'position':'absolute',
        'top':'150px',
        'left':'100px',
        'font-size':'1.2em',
        'color': '#B6EADA'
    });

    backBtn.on('click', function() {
        destroyPage(cardContainer);
        destroyPage(backBtn)
        destroyPage(moon)
        destroyPage(deckListContainer);
        buildPage();
    });



    $('body').append(cardContainer, backBtn, moon, deckListContainer);
    $('#cardContainer').append(deckName);
    moon.append(moonImg);



    handleDeckInput();
    createDeckList();
}

function createDeckList() {
    $.ajax({
        url: '/userDeckList',
        type: 'GET',
        contentType: 'application/json',
        data: { username: currentUser },
        success: function (response) {
            let warnUser = false;
            for (let i = 0; i < response.decks.length; i++) {
                // Create a container div
                let container = $('<div>').addClass('liContainer').css({
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'space-between',
                    'padding': '10px',
                });

                // Create li element
                let li = $('<li>').text(response.decks[i].deckname).css({
                    'list-style': 'none',
                    'cursor': 'pointer'
                });

                li.on('click', function() {
                    alert('You clicked on: ' + response.decks[i].deckname);
                });


                // Create delete image element
                let deleteImage = $('<img>').attr('src', 'images/ex.jpg').addClass('delete-icon').css({
                    'width': '16px',
                    'height': '16px',
                    'cursor': 'pointer',
                    'padding': '10px',
                });

                deleteImage.on('click', (e) => {
                    let parentElement = $(e.target).parent();
                    if (warnUser) {
                        //delete database table if user has been warned
                        removeFromDB(parentElement)
                    } else {
                        //warn user
                        alert('This action cannot be undone, you have been warned.')
                        warnUser = true
                    }
                })
                // Append li and deleteImage to the container
                container.append(li, deleteImage);

                // Append the container to the deckListContainer
                $('#deckListContainer').append(container);
            }
        },
        error: function (error) {
            console.error('Error from post:', error);
            alert('Error gathering deck list. Please try again.');
        }
    });
}


function removeFromDB(parentElement) {
    let deckName = parentElement.text();
    console.log('Deleting deck:', deckName);

    $.ajax({
        url: '/deleteDeck',
        type: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ deckName: deckName, username: currentUser }),
        success: function(response) {
            console.log('Server response:', response);

             // Check if the deletion was successful
             if (response.success) {
                 console.log('Deck deleted successfully');
                 // Remove the parent element if the deletion is successful
                 parentElement.remove();
             } else {
                 console.error('Failed to delete deck:', response.error);
                 alert('Error in success');
             }
        },
        error: function(error) {
            console.error('Error from delete:', error);
            alert('Error deleting deck. Please try again.');
        }
    });
}


function handleDeckInput() {
    let deckNameInput = $('#deckName');

    deckNameInput.attr('placeholder', 'Enter a new deck name...');

    //handle enter keypress
    deckNameInput.keypress( (e) => {
        let key = e.which

        if (key === 13) {
            let deckName = deckNameInput.val();

            // let postRequestData = deckName + currentUser
            $.ajax({
                url: '/postdeck',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({deckName: deckName, currentUser: currentUser }),
                success: function(response) {
                    console.log('Server response:', response);

                    //Check if the deck was created successfully
                    if (response.success) {
                        alert('Deck has been created successfully')
                    } else {
                        //Deck already exists for current user
                        console.error('This deck name already exists in users library')
                        alert('This deck name already exists in your library!')
                    }
                },
                error: function(error) {
                    console.error('Error from post:', error);
                    alert('Nope.');
                }
            });

            //Remove and refresh user deck list 
            let deckList = $('.liContainer')
            let deleteImgs = $('.delete-icon')
            destroyPage(deckList)
            destroyPage(deleteImgs)
            createDeckList()
        }
    })
}