function init() {
    const timeout = setTimeout(closeLoader, 2500);
}


function closeLoader() {
    document.getElementById('animation').classList.add('d_none')
}