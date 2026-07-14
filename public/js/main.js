const btn = document.querySelector(".showForm");
const form = document.querySelector(".addForm");

if(btn && form){
    btn.addEventListener("click",()=>{
      form.classList.toggle("hidden");
      btn.classList.toggle("hidden");
    });
}

const pbtn = document.querySelector(".pbtn");
const pform = document.querySelector(".addpform");

if(pbtn && pform){
    pbtn.addEventListener("click",()=>{
       pform.classList.toggle("hidden");
       pbtn.classList.toggle("hidden");
    });
}

const ubtn = document.querySelectorAll(".updatebtn");
const upform = document.querySelectorAll(".updateform");

if(ubtn && upform){
    ubtn.forEach((btn, index) => {
       btn.addEventListener("click", () => {
          upform[index].classList.toggle("hidden");
          btn.classList.toggle("hidden");
       });
    });
}

const openmenu = document.querySelector(".menu");
const closemenu = document.querySelector(".close-menu");
const menubar = document.querySelector(".menubar");

if(openmenu && closemenu && menubar){
    openmenu.addEventListener("click",()=>{
        menubar.classList.toggle("hidden");
        openmenu.classList.toggle("hidden");
    });

    closemenu.addEventListener("click",()=>{
        menubar.classList.toggle("hidden");
        openmenu.classList.toggle("hidden");
    })
}

