const $nameContainer = document.getElementById("nameContainer");
const $name = document.getElementById("name");
const $firstLastName = document.getElementById("firstLastName");
const $secondLastName = document.getElementById("secondLastName");
const $socialContainer = document.getElementById("socialContainer");

$nameContainer.addEventListener('click', (event) => {
    window.open("https://www.linkedin.com/in/zamberjo");
});

$nameContainer.addEventListener('animationend', (event) => {
    $name.classList.add('showName');
    $firstLastName.classList.add('showFirstLastName');
    $secondLastName.classList.add('showSecondLastName');
});

