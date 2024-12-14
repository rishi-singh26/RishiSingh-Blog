document.getElementById('fontPreload').addEventListener('load', function () {
    this.rel = 'stylesheet';
    document.body.classList.add('fontLoaded');
});
