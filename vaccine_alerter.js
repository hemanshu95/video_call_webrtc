DISTRICT_ID1 = 142;
DISTRICT_ID2 = 143;
NAME = "Hemanshu"
AGE_LIMIT = 30
MIN_CAPACITY = 5
CHAT_ID = "-250294277"
BOT_ID = "bot1784738824:AAGjMq_aYuxe6sDeLdI2NAaqNSU6g3a6XSs"
VACCINE = "COVAXIN"

function isSlotAvailable(age_limit, data){
	return data.centers.find(centre=> centre.sessions.find(session=> session.min_age_limit<=age_limit && session.available_capacity>MIN_CAPACITY && session.vaccine==VACCINE))
}
function getDate(){
	let d = new Date();
	let ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
	let mo = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(d);
	let da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
	return `${da}-${mo}-${ye}`;
}
function sendMessage(pincode, district){
	fetch(`https://api.telegram.org/${BOT_ID}/sendMessage?chat_id=${CHAT_ID}&text=Hi @${NAME}, Slot is Available in your district ${district} for pincode ${pincode} for age limit of ${AGE_LIMIT} for vaccine ${VACCINE}`)
}

function sendErrorMessage(){
	fetch(`https://api.telegram.org/${BOT_ID}/sendMessage?chat_id=${CHAT_ID}&text=Hi @${NAME}, API stopped working`)
}

function sendAPIworkingMessage(){
	fetch(`https://api.telegram.org/${BOT_ID}/sendMessage?chat_id=${CHAT_ID}&disable_notification=true&text=API is working`)
}
var errorCount = 0;
function processAPIByDistrict(district){
	fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict?district_id=${district}&date=${getDate()}`)
  	.then(response => {if(response.status!=200){
		if(errorCount>=3)
			sendErrorMessage();
		errorCount = errorCount + 1;
  	}else{
  		errorCount = 0;
  	return response.json();}})
  	.then(data => {
  		var slot = isSlotAvailable(AGE_LIMIT, data); 
  		if(slot){
			sendMessage(slot.pincode, district);	
			console.log("Found a slot");
			console.log(slot);
  		}
  		else
  			console.log("No slot found");
  	});
}

setInterval(function(){processAPIByDistrict(DISTRICT_ID1)}, 20000);
setTimeout(function(){setInterval(function(){processAPIByDistrict(DISTRICT_ID2)}, 20000)}, 10000);

setInterval(sendAPIworkingMessage, 600000);
