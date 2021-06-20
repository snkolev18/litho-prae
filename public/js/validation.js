function validateFirstName(id) {
    let nameValue = document.getElementById(id).value;

    let message = document.getElementById('messageFirstName');

    if (nameValue === '') {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
    }
}

function validateLastName(id) {
    let nameValue = document.getElementById(id).value;

    let message = document.getElementById('messageLastName');

    if (nameValue === '') {
        message.style.display = 'block';
    } else {
        message.style.display = 'none';
    }
}

function validateEmail(id) {
    let emailValue = document.getElementById(id).value;

    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (emailValue.length > 0) {
        document.getElementById('messageEmail').style.display = 'none';
    } else {
        document.getElementById('messageEmail').style.display = 'block';
    }

    if (!regex.test(emailValue) && emailValue.length > 1) {
        document.getElementById('messageValidateRegexEmail').style.display = 'block';
    } else {
        document.getElementById('messageValidateRegexEmail').style.display = 'none';
    }
}

function validatePassword(id) {
    let passwordValue = document.getElementById(id).value;

    if (passwordValue.length < 6 && passwordValue.length > 0) {
        document.getElementById('messagePasswordMin').style.display = 'block';
        document.getElementById('messagePassword').style.display = 'none';
    } else if (passwordValue.length >= 6 && passwordValue.length > 0) {
        document.getElementById('messagePassword').style.display = 'none';
        document.getElementById('messagePasswordMin').style.display = 'none';
    } else {
        document.getElementById('messagePassword').style.display = 'block';
        document.getElementById('messagePasswordMin').style.display = 'none';
    }
}

function validatePasswordConfirmation(id) {
    let passwordConfirmValue = document.getElementById(id).value;

    if (passwordConfirmValue.length < 6 && passwordConfirmValue.length > 0) {
        document.getElementById('messagePasswordConfirmation').style.display = 'none';
    } else if (passwordConfirmValue.length >= 6 && passwordConfirmValue.length > 0) {
        document.getElementById('messagePasswordConfirmation').style.display = 'none';
    } else {
        document.getElementById('messagePasswordConfirmation').style.display = 'block';
    }
}

function passwordConfirmation() {
    let passwordValue = document.getElementById('password').value;
    let passwordConfirmationValue = document.getElementById('passwordConfirmation').value;
    if (passwordValue !== '' && passwordValue !== passwordConfirmationValue) {
        document.getElementById('messagePasswordNotConfirmed').style.display = 'block';
    } else {
        document.getElementById('messagePasswordNotConfirmed').style.display = 'none';
    }
}

function onKeyUp(id) {
    switch (id) {
        case 'fname':
            validateFirstName(id);
            break;
        case 'lname':
            validateLastName(id);
            break;
        case 'email':
            validateEmail(id)
            break;

        case 'password':
            validatePassword(id);
            break;

        case 'passwordConfirmation':
            validatePasswordConfirmation(id);
            passwordConfirmation();
            break;

        default:
            return null;
    }
}

function onFocusOut(id) {
    switch (id) {
        case 'fname':
            validateFirstName(id);
            break;
        case 'lname':
            validateLastName(id);
            break;
        case 'email':
            validateEmail(id);
            break;

        case 'password':
            validatePassword(id);
            break;

        case 'passwordConfirmation':
            validatePasswordConfirmation(id);
            break;

        default:
            return null;
    }
}