'use strict';

let people = new Array();
let ideaList = new Array();
let giftListPerson; //this is to deterine who we are looking at when under the gifts page
let currentPerson;
//localStorage.removeItem("giftr-jaff0021");

document.addEventListener('deviceready', onDeviceReady);


window.addEventListener('push', function (ev){
   
    let contentDiv = ev.currentTarget.document.querySelector(".content")
    let id = contentDiv.id;
    switch (id) {
        case "index": 
            let saveButton = document.getElementById("savebtn");
            saveButton.addEventListener("click", savePerson);
            console.log("Testing switch statement");
            let cancelButton = document.getElementById("cancelbtn");
            cancelButton.addEventListener("click", cancelModal);
            displayPeopleList();
            break;
        case "gifts":  
            let saveGiftBdutton = document.getElementById("saveGiftButton");
            saveGiftButton.addEventListener("click", saveGift);
            let cancelGiftButton = document.getElementById("cancelGiftButton");
            cancelGiftButton.addEventListener("click", cancelGiftModal);
            determinePerson();
            break;
        default:
            displayPeopleList();
    }
    
});



function onDeviceReady(){
    console.log("Ready");
    let saveButton = document.getElementById("savebtn");
    saveButton.addEventListener("click", savePerson);
    let cancelButton = document.getElementById("cancelbtn");
    cancelButton.addEventListener("click", cancelModal);
    displayPeopleList();   
}

function savePerson(){
    //if the modal closing stops working add ev to savePerson funtion and uncomment the prevent default
//    ev.preventDefault();
    
   console.log("testing save person function");
    
    let nameToBeSaved = document.getElementById("nameField").value;
    let dateToBeSaved = document.getElementById("dateField").value;
    console.log(nameToBeSaved);
    console.log(dateToBeSaved);
    
    if(currentPerson == 0){
        
        let timeStamp = new Date().getTime() / 1000;
    
        let person = {id: timeStamp,
                     name:nameToBeSaved,
                     dob:dateToBeSaved,
                     ideas:new Array()
                     };
        //console.log(person);

        people.push(person);
    } else {
        let length = people.length;
        for(let i = 0; i < length; i++){
            if(people[i].id == currentPerson){
                people[i].dob = dateToBeSaved;
                people[i].name = nameToBeSaved;
                break;
            }
        }
    }
    
    currentPerson = 0;
    console.log("The people array:");
    console.log(people);
    //saves the list of people to local storage
    saveToLocalStorage();
    
    document.getElementById("nameField").value = "";
    document.getElementById("dateField").value = "";
    //launch custom event to exit modal window
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xButton");
    console.dir(a);
    console.dir(endEvent);
    a.dispatchEvent(endEvent);
    //display te list of people on the main screen
    displayPeopleList();
    
}

function displayPeopleList(){
    getFromLocalStorage();
    
    console.log("testing display people funtion at top");
    let list = document.getElementById("contact-list");
    list.innerHTML = "";
    
    function compare(a, b) {
        if (a.dob.substring(5) < b.dob.substring(5)) return -1;
        if (a.dob.substring(5) > b.dob.substring(5)) return 1;
        return 0;
    }
    people.sort(compare);
    
    let length = people.length;
    
    for(let i = 0; i < length; i++){
        //create the items needed for the name to appear
        let li = document.createElement("li");
        li.className = "table-view-cell";
        //this sets up the unique attribute
        li.setAttribute("dataId", people[i].id);
        let spanName = document.createElement("span");
        spanName.className = "name";
        let aName = document.createElement("a");
        aName.textContent = people[i].name;
        aName.href = "#personModal"
        //the next two lines add unique attribute for name and date of birth 
        aName.setAttribute("data-name", people[i].name);
        aName.setAttribute("data-dob", people[i].dob);
        
        //create elemnet for the date of birth
        let spanDob = document.createElement("span");
        spanDob.className = "dob";
        spanDob.textContent = moment(people[i].dob).format("MMMM DD");
        
        let aDob = document.createElement("a");
        aDob.className = "navigate-right pull-right";
        aDob.href = "gifts.html"
        
        //attach the list items to the main list
        spanName.appendChild(aName);
        aDob.appendChild(spanDob);
        li.appendChild(spanName);
        li.appendChild(aDob);
        list.appendChild(li);
        
        aName.addEventListener("touchstart",editButton);
        aDob.addEventListener("touchstart", pageSwitch);
    }
    
}

function saveToLocalStorage(){
    localStorage.setItem("giftr-jaff0021", JSON.stringify(people));
}

function getFromLocalStorage(){
    if(!localStorage.getItem("giftr-jaff0021")){
        console.log("No data found");
    }
    else{
        people = JSON.parse(localStorage.getItem("giftr-jaff0021"));
        console.log("This is the data retrived from local storage");
        console.log(people);
    }
}

function cancelModal(){
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xButton");
    a.dispatchEvent(endEvent);
}

function editButton(ev){
    console.log("Edit button");
    console.dir(ev);
    console.log(ev.target.dataset.name);
    currentPerson = ev.target.parentElement.parentElement.attributes.dataId.nodeValue;
    console.log(currentPerson);
    document.getElementById("nameField").value = ev.target.dataset.name;
    document.getElementById("dateField").value = ev.target.dataset.dob;
}

function pageSwitch(ev){
    console.log("testing page switch");
    console.dir(ev);
    console.log("output of giftperson");
    giftListPerson = ev.target.parentElement.attributes.dataId.nodeValue;
    console.log(giftListPerson);
}

function determinePerson(){
    
    let length = people.length;
    
    for(let i = 0; i < length; i++){
        if(giftListPerson == people[i].id){
            console.log(i);
            ideaList = people[i].ideas;
            console.log("testing idea list in determine person");
            console.log(ideaList);
            document.getElementById("addName").textContent ="Gifts For " + people[i].name;
            document.getElementById("giftTitle").textContent = people[i].name;
            break;
        }
    }
    displayGiftList();
}

function saveGift(){
    
    console.log("testing save gift function");
    
    let giftToBeSaved = document.getElementById("giftField").value;
    let storeToBeSaved = document.getElementById("storeField").value;
    let urlToBeSaved = document.getElementById("urlField").value;
    let costToBeSaved = document.getElementById("costField").value;
    console.log(giftToBeSaved);
    console.log(storeToBeSaved);
    console.log(urlToBeSaved);
    console.log(costToBeSaved);
    
    let timeStamp = new Date().getTime() / 1000;
    
    let giftIdea = {idea:giftToBeSaved,
                at:storeToBeSaved,
                url:urlToBeSaved,
                cost:costToBeSaved,
                id:timeStamp
               };
    
    console.log(giftIdea);
    
    ideaList.push(giftIdea);
    console.log("This is the idea list");
    console.log(ideaList);
    
    //saves ideas to the people array 
    saveToContact();
    
    document.getElementById("giftField").value = "";
    document.getElementById("storeField").value = "";
    document.getElementById("urlField").value = "";
    document.getElementById("costField").value = "";
    
    //launch custom event to exit modal window
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xGiftButton");
    a.dispatchEvent(endEvent);
    
    //display te list of people on the main screen
    displayGiftList();
}

function displayGiftList(){
    
    let giftList = document.getElementById("gift-list");
    giftList.innerHTML = "";
    console.log(giftList);
    let length = ideaList.length;
    
    for(let i = 0; i < length; i++){
        let liGift = document.createElement("li");
        liGift.className = "table-view-cell media";
        liGift.setAttribute("dataId", ideaList[i].id);
        let spanDelete = document.createElement("span");
        spanDelete.className = "pull-right icon icon-trash midline";
        let divIdeaDisplay = document.createElement("div");
        divIdeaDisplay.textContent = ideaList[i].idea;
        divIdeaDisplay.className = "media-body";
        
        spanDelete.addEventListener("touchstart", deleteIdea);
        
        if(ideaList[i].at != ""){
            let pStore = document.createElement("p");
            pStore.textContent = ideaList[i].at;
            divIdeaDisplay.appendChild(pStore);
        }
        
        if(ideaList[i].url != ""){
            let pUrl = document.createElement("p");
            let aUrl = document.createElement("a");
            aUrl.textContent = ideaList[i].url;
            aUrl.href = ideaList[i].url;
            pUrl.appendChild(aUrl);
            divIdeaDisplay.appendChild(pUrl);
        }
        
        if(ideaList[i].cost != ""){
            let pCost = document.createElement("p");
            pCost.textContent = ideaList[i].cost;
            divIdeaDisplay.appendChild(pCost);
        }
        liGift.appendChild(spanDelete);
        liGift.appendChild(divIdeaDisplay);
        giftList.appendChild(liGift);
    }
    
}

function cancelGiftModal(){
    var endEvent = new CustomEvent('touchend', {bubbles:true, cancelable:true});
    var a = document.querySelector("a#xGiftButton");
    a.dispatchEvent(endEvent);
}

function saveToContact(){
    let length = people.length;
    for(let i = 0; i < length; i++){
        if(giftListPerson == people[i].id){
            people[i].ideas = ideaList;
            console.log(people);
            break;
        }
    }
    saveToLocalStorage();
}

function deleteIdea(ev){
    console.dir(ev);
    let ideaToBeDeleted = ev.target.parentElement.attributes.dataId.nodeValue;
    let length = ideaList.length;
    for(let i = 0; i < length; i++){
        if(ideaList[i].id == ideaToBeDeleted){
            ideaList.splice(i,1);
            break;
        }
    }
    saveToContact();
    displayGiftList();
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
