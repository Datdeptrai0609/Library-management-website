var fs = require('fs');
var readline = require('readline-sync');
//load data synchronus 
var userData = JSON.parse(fs.readFileSync('./user.json',));
var bookData = JSON.parse(fs.readFileSync('./book.json'));

//create function lateDate
function lateDate(val1,val2){
    var Bdate = new Date(val1);
    var Adate = new Date(val2);
    var count =0;
    if (Bdate.getMonth() !== Adate.getMonth()){
            count = count+(Adate.getMonth() - Bdate.getMonth())*30;
    }
    count = count + Adate.getDate() - Bdate.getDate();

    return count;
}

//create function save and exit
function Save(){
    fs.writeFileSync('./user.json', JSON.stringify(userData));
    fs.writeFileSync('./book.json', JSON.stringify(bookData));
    askBookOrUser();
}

//create function give book back
function giveBookBack(user,book){
    var userBookId = user.bookBorrowId;
    var path = bookData.filter(data => data.id == userBookId[0]);
    path[0].status ="";
    console.log("khai bao ngay theo dinh dang YYYY/MM/DD");
    user.giveBackDate = readline.question('give back date(ngay tra thuc te): ');
    user.totalLateDate =user.totalLateDate + lateDate(user.giveBackDateCrr, user.giveBackDate); 
    console.log(user.totalLateDate);
    path[0].borrowDate ="";
    path[0].giveBackDateCrr ="";
    path[0].locate = readline.question("location: ");
    path[0].userIdBrr = 0;
    user.giveBackDateCrr = "";
    user.borrowDate ="";
    user.giveBackDate ="";
    user.bookBorrowId.splice(0,1);
}
//create function update book
function updateBook(user, book){
    if ( book.status == ""){
        book.status = "full";
        console.log("khai bao ngay theo dinh dang YYYY/MM/DD");
        book.borrowDate = readline.question("Borrow Date: ");
        book.giveBackDateCrr = readline.question("Give Back Date(ngay tra theo thoi han): ");
        user.borrowDate = book.borrowDate;
        user.giveBackDateCrr = book.giveBackDateCrr;
        user.bookBorrowId.push(book.id);
        book.userIdBrr = user.Id;
        book.locate ="";
        console.log("1. Continue ");
        console.log("2. Save ");
        var change = readline.question(">> ");
        switch (change) {
            case "1":{
                checkBook(user);
                break;
            }
            case "2":{
                Save();
                break;
            }
        }
    }
    else{
        giveBookBack(user,book);
        console.log("1. Continue ");
        console.log("2. Save ");
        var change = readline.question(">> ");
        switch (change) {
            case "1":{
                checkBook(user);
                break;
            }
            case "2":{
                Save();
                break;
            }
        }
    }
}

//create function checkBook
function checkBook(user){
    var bookName = readline.question('book name: ');
    var result = bookData.filter(book => book.title == bookName );
    if (result[0] == undefined){
        console.log("Not Found");
        checkBook(user);
    }
    else{
        console.log("1. borrow or give");
        console.log("2.find book");
        var change = readline.question(">> ");
        if(change == 1){
            updateBook(user, result[0]);
        }
        else{
            console.log(result[0]);
        }
    }
}

//create new user
function createNewUser(){
    var Id = userData[userData.length-1].Id + Math.floor((Math.random()*100)+1);
    var name = readline.question("name: ");
    var age = readline.question("age: ");
    var newUser = {
        Id: Id,
        name: name,
        age: parseInt(age),
        bookBorrowId: [],
        borrowDate:"",
        giveBackDateCrr: "",
        giveBackDate: "",
        totalLateDate: 0
    }
    userData.push(newUser);
    Save();
}

// create function find user
function findUser(){
    var userId = readline.question("user Id: ");
    var result =userData.filter(user => user.Id == userId);
        if (result[0] == undefined){
            console.log("Not Found");
            findUser();
        }
        else{
            console.log(result);
            checkBook(result[0]);
        }
}
// create function ask book or user
function askBookOrUser(){
    console.log('1. borrow or give book back');
    console.log('2. find book');
    console.log('3. create new user');
    console.log('4. Exit');
    var change = readline.question('>> ');
    switch (change){
        case '1':{
            findUser();
            break;
        }
        case '2':{
            checkBook();
            askBookOrUser();
            break;
        }
        case '3':{
            createNewUser();
            break;
        }
        case '4':{
            console.log("done");
            break;
        }
        default:{
            console.log('wrong option!!!');
            askBookOrUser();
            break;
        }
    }
}

askBookOrUser();
