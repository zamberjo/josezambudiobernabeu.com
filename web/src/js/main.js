const $nameContainer = document.getElementById("nameContainer");
const $name = document.getElementById("name");
const $firstLastName = document.getElementById("firstLastName");
const $secondLastName = document.getElementById("secondLastName");
const $socialContainer = document.getElementById("socialContainer");
const $nameButton = document.getElementById("name-btn");
const $aliasButton = document.getElementById("alias-btn");

$nameContainer.addEventListener('click', (event) => {
    ga('send', 'event', 'social', 'click', 'linkedin', '0');
    window.open("https://www.linkedin.com/in/zamberjo");
});

$nameContainer.addEventListener('animationend', (event) => {
    switch(event.animationName) {
        case "nameContainerAppear":
            $name.classList.add('showName');
            $firstLastName.classList.add('showName');
            $secondLastName.classList.add('showName');
            break;
        case "nameAliasResetMove":
            $name.classList.remove('resetAlias');
            $name.classList.add('showName');
            break;
        case "firstLastNameAliasResetMove":
            $firstLastName.classList.remove('resetAlias');
            $firstLastName.classList.add('showName');
            break;
        case "secondLastNameAliasResetMove":
            $secondLastName.classList.remove('resetAlias');
            $secondLastName.classList.add('showName');
            break;
        default:
            break;
    }
});

$aliasButton.addEventListener('click', (event) => {
    $aliasButton.classList.add('active');
    $nameButton.classList.remove('active');

    $name.classList.remove('showName');
    $name.classList.add('showAlias');

    $firstLastName.classList.remove('showName');
    $firstLastName.classList.add('showAlias');

    $secondLastName.classList.remove('showName');
    $secondLastName.classList.add('showAlias');
});

$nameButton.addEventListener('click', (event) => {
    $nameButton.classList.add('active');
    $aliasButton.classList.remove('active');

    $name.classList.remove('showAlias');
    $name.classList.add('resetAlias');

    $firstLastName.classList.remove('showAlias');
    $firstLastName.classList.add('resetAlias');

    $secondLastName.classList.remove('showAlias');
    $secondLastName.classList.add('resetAlias');
});

