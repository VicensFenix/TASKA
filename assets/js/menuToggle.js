document.addEventListener('DOMContentLoaded',()=>{
    const n=document.getElementById('navbar'),t=document.getElementById('toggleBtn');
    function e(){n.classList.toggle('expanded')}
    t.addEventListener('click',e),
    window.addEventListener('resize',()=>{window.innerWidth>=768&&n.classList.remove('expanded')}),
    window.innerWidth<768&&n.classList.remove('expanded')
});