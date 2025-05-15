function initSummary() {
   summaryWelcome();
   initTask();
}

const time = new Date();


function summaryWelcome() {
   contentRef = document.getElementById("content");

   t = time.getHours();

   switch (t){
    case (t < 12):
        greetingTime = "Good morning";
        break;
    case (t < 18):
        greetingTime  = "Good afternoon";
        break;
    case (t < 24):
        greetingTime = "Good evening";
   }

    greeting.innerHTML = greetingTime   /*  + user */ ;
}

function initTask() {
    document.getElementById("menuTemplate").innerHTML = menu();
}