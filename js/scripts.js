const theme = document.getElementById("theme");
const body = document.querySelector("body");
const addWorkBtn = document.getElementById("add-work-btn");
const addWorkInput = document.getElementById("add-work-input");
const worksList = document.getElementById("works-list");
const allBtn = document.getElementById("all");
const activeBtn = document.getElementById("acvite");
const completedBtn = document.getElementById("completed");
const deleteCompletedBtn = document.getElementById("delete-completeds");


// Drag and drop works
worksList.addEventListener("dragover", function(e){
    if(e.target.classList.contains("card") && 
    !e.target.classList.contains("dragging")){
        var currentCard = document.querySelector(".dragging");
        var cards = [...document.querySelectorAll(".card")];        
        var currentPos = cards.indexOf(currentCard);
        var newPos = cards.indexOf(e.target);        
        if(currentPos > newPos){
            worksList.insertBefore(currentCard, e.target);
        }else{
            worksList.insertBefore(currentCard, e.target.nextSiblim);
        }

        var currentWorks = JSON.parse(localStorage.getItem("works"));        
        var removed = currentWorks.splice(currentPos, 1);
        currentWorks.splice(newPos, 0, removed[0]);
        console.log(currentWorks);
        
        localStorage.setItem("works", JSON.stringify(currentWorks));
    }
});

function addWork(work) {
  if (localStorage.getItem("works")) {
    var work = {
      id: 0,
      name: work,
      end: false,
    };
    exists_works = JSON.parse(localStorage.getItem("works"));
    var bigId = exists_works[0].id
    exists_works.forEach((work)=>{
        if(work.id > bigId){
            bigId = work.id
        }
    });
    work.id = bigId+1;
    exists_works.push(work);

    localStorage.setItem("works", JSON.stringify(exists_works));
  } else {
    var work = {
      id: 1,
      name: work,
      end: false,
    };
    localStorage.setItem("works", JSON.stringify([work]));
  }
  updateCount();

  return work;
}

function showWork(work) {
  let elements = `
    <li class="card border-bottom" draggable="true">
        <div class="row align-items-center px-3">
        <div class="col-md-1 col-1">
            <input type="checkbox" class="form-check-input check" data-work-id="${
              work.id
            }" ${work.end ? "checked" : ""}>
        </div>
        <div class="col-md-9 col-8 pt-3">
            <p class="work">${work.name}</p>
        </div>
        <div class="col-md-2 col-1">
            <i class="fa fa-close work-delete-icon" data-work-id="${
              work.id
            }"></i>
        </div>
        </div>
    </li>
    `;
  worksList.innerHTML += elements;
  
    // add dragging event
    document.querySelectorAll(".card").forEach((card)=>{    
        card.addEventListener("dragstart", ()=>{
            card.classList.add("dragging");
        });

        card.addEventListener("dragend", ()=>{
            card.classList.remove("dragging");
        });
    });
}

function allWorks() {
  worksList.innerHTML = "";
  works = JSON.parse(localStorage.getItem("works"));
  if(works){
    works.forEach((work) => {
        showWork(work);
    });
  }
  
}
function activeWorks() {
  worksList.innerHTML = "";
  works = JSON.parse(localStorage.getItem("works"));
  works.forEach((work) => {
    if (!work.end) {
      showWork(work);
    }
  });
}
function completedWorks() {
  worksList.innerHTML = "";
  works = JSON.parse(localStorage.getItem("works"));
  works.forEach((work) => {
    if (work.end) {
      showWork(work);
    }
  });
}

function updateCount() {
  let count = 0;
  works = JSON.parse(localStorage.getItem("works"));
  if(works){
    works.forEach((work) => {
        if (!work.end) {
          count++;
        }
      });
  }

  document.getElementById("active-count").innerHTML = count;
}

(function () {
  allWorks();
  updateCount();
})();

const checkboxes = document.querySelectorAll(".check");

function changeStatus(id) {
  id = Number(id);
  console.log(id);

  works = JSON.parse(localStorage.getItem("works"));
  work = works.find((item) => item.id === id);
  console.log(work);

  work.end = !work.end;
  localStorage.setItem("works", JSON.stringify(works));
  updateCount();
}

function deleteWork(id) {
  id = Number(id);
  console.log(id);

  works = JSON.parse(localStorage.getItem("works"));
  works = works.filter((item) => item.id !== id);

  localStorage.setItem("works", JSON.stringify(works));
  if (works.length == 0) {
    localStorage.removeItem("works");
  }
  updateCount();
}

// Change Theme
theme.addEventListener("click", function () {
    theme.classList.toggle("fa-sun-o");
    theme.classList.toggle("fa-moon-o");
    body.classList.toggle("light");
  });


// Change Work Status
worksList.addEventListener("click", function (event) {
  if (event.target.classList.contains("check")) {
    console.log("clicked!");
    changeStatus(event.target.getAttribute("data-work-id"));
    allWorks();
  }
});

// Delete work
worksList.addEventListener("click", function (event) {
  if (event.target.classList.contains("work-delete-icon")) {
    deleteWork(event.target.getAttribute("data-work-id"));
    allWorks();
  }
});

// Add Work
addWorkBtn.addEventListener("click", function () {
    var work = addWorkInput.value;
    addWorkInput.value = "";
    if (work) {
      let seted_work = addWork(work);
      showWork(seted_work);
    } else {
      alert("وظیفه را وارد کنید!");
    }
  });

// Show All Works
allBtn.addEventListener("click", function (e) {
  allWorks();
  activeBtn.classList.remove("text-primary");
  completedBtn.classList.remove("text-primary");
  allBtn.classList.add("text-primary");
});

// Show Active Works
activeBtn.addEventListener("click", function () {
  activeWorks();
  activeBtn.classList.add("text-primary");
  completedBtn.classList.remove("text-primary");
  allBtn.classList.remove("text-primary");
});

// Show Completed Works
completedBtn.addEventListener("click", function () {
  completedWorks();
  activeBtn.classList.remove("text-primary");
  completedBtn.classList.add("text-primary");
  allBtn.classList.remove("text-primary");
});

// Delete All Completed Works
deleteCompletedBtn.addEventListener("click", function () {
  var works = JSON.parse(localStorage.getItem("works"));
  works = works.filter((item) => item.end !== true);
  localStorage.setItem("works", JSON.stringify(works));
  if (works.length == 0) {
    localStorage.removeItem("works");
  }
  allWorks();
});
