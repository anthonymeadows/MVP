$(document).ready(function() {
    if (window.location.href.indexOf("content.html") > -1) {
        mustLogin();
        destroyPage();
        buildPage();
    }
});
////////////////////////////////////////////////////////////////////
///////////////////////// Global Variables ///////////////////////// 
////////////////////////////////////////////////////////////////////

let currentUser = localStorage.getItem('username');
let selectedDeck;

//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////  Authentication / Login Functions  /////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function isValidUser() {
    const username = localStorage.getItem('username');
    const isValid = !!username;
    return isValid;
}

function mustLogin() {
    if(!isValidUser()) {
        navigateToLogin()
    }
}

function validateLogin(e) {
    e.preventDefault();

    let username = $('#username').val();
    let password = $('#password').val();

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    getValidate();
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

    createAjax();
}

function navigateToLogin() {
    localStorage.clear();
    window.location.href = "login.html";
}

function navigateToCreate() {
    localStorage.clear();
    window.location.href = "create.html";
}

////////////////////////////////////////////////////////////////////
///////////////////////// DOM MANIPULATION /////////////////////////
//////////////////////////////////////////////////////////////////// 

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
    createFlashcard();
    listOfIndexCards();

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
        destroyPage($(scrollableContainer))
        buildPage();
    });



    $('body').append(cardContainer, backBtn, moon, deckListContainer);
    $('#cardContainer').append(deckName);
    moon.append(moonImg);



    handleDeckInput();
    createDeckList();
}

function createFlashcard() {
    let container = $('<div>', {
        id: 'flashcard-container',
        text: 'Add a card to the selected deck!'
    }).css({
        'position': 'absolute',
        'height': '300px',
        'width': '400px',
        'bottom': '10px',
        'right': '10px',
        'text-align': 'center',
        'padding': '20px'
    });

    let flashcardDiv = $('<div>').addClass('flashcard-div');

    //Question textarea
    let questionLabel = $('<label>').text("Question:");
    flashcardDiv.append(questionLabel);

    let questionTextarea = $('<textarea>').attr('rows', '4').attr('cols', '50').attr('id', 'question');
    flashcardDiv.append(questionTextarea);

    //Answer textarea
    let answerLabel = $('<label>').text("Answer:");
    flashcardDiv.append(answerLabel);

    let answerTextarea = $('<textarea>').attr('rows', '4').attr('cols', '50').attr('id', 'answer');
    flashcardDiv.append(answerTextarea);

    //Submission button
    let showAnswerButton = $('<button>').text('Add index card to deck').on('click', handleSubmit).css('margin-top', '10px');
    flashcardDiv.append(showAnswerButton);

    //Append
    container.append(flashcardDiv);

    $('body').append(container);
};

// Takes selected deck (string), makes an API call updates the DOM
function listOfIndexCards(selectedDeck) {

    // Create a div element for the scrollable container
    var scrollableContainer = $("<div>").attr('id', 'scrollableContainer').css({
        width: "30%",
        height: "700px",
        position: "absolute",
        top: "60%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        overflowY: "auto",
        border: "1px solid #ccc",
        padding: "10px"
    });

    // Add content to the scrollable container
    for (let i = 1; i <= 20; i++) {
        let question = $("<p>").text("Question: " + i);
        let answer = $("<p>").text("Answer: " + i);
        let line = $("<p>").css ({width: '100%', border:'1px solid white'})
        scrollableContainer.append(question, answer, line);
    }

    // Append the scrollable container to the body
    $("body").append(scrollableContainer);
}

function handleSubmit() {
    // Get the entered data from the textareas
    let question = $('#question').val();
    let answer = $('#answer').val();

    // Display an alert with the entered data
    alert('Question: ' + question + '\nAnswer: ' + answer + `\nhandleSubmit()`);
}

//////////////////////////////////////////////////////////////////////// 
///////////////////////// Server Communication /////////////////////////
////////////////////////////////////////////////////////////////////////

function handleDeckInput() {
    let deckNameInput = $('#deckName');

    deckNameInput.attr('placeholder', 'Enter a new deck name...');

    //handle enter keypress
    deckNameInput.keypress( (e) => {
        let key = e.which

        if (key === 13) {
            let deckName = deckNameInput.val();

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

function createAjax () {
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
                });

                // Create li element
                let li = $('<li>').text(response.decks[i].deckname).css({
                    'list-style': 'none',
                    'cursor': 'pointer'
                });

                li.on('click', (e) => {
                    selectedDeck = response.decks[i].deckname;
                    
                    let selectedDeckElement = $('#selectedDeck');
                    
                    if (selectedDeckElement.length > 0) {
                        // Element exists
                        selectedDeckElement.text(`Selected Deck: ${selectedDeck}`);
                    } else {
                        // Element doesn't exist
                        selectedDeckElement = $('<div>').attr('id', 'selectedDeck').text(`Selected Deck: ${selectedDeck}`);
                        $('body').append(selectedDeckElement);
                    }
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
                // Append
                container.append(li, deleteImage);

                // Append
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

function getValidate() {
    let username = $('#username').val();
    let password = $('#password').val();

    $.get('/validateLogin', { username: username, password: password })
        .done((response) => {
            if (response.success) {
                localStorage.clear();
                alert('Login successful!\nUsername: ' + username);
                localStorage.setItem('username', username);
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


//Coalesce key word for put / patch