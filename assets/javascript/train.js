var config = {
    apiKey: "AIzaSyCMUbb3HBLImQmJOsCf-56ztTMusW6dTtE",
    authDomain: "project-c000e.firebaseapp.com",
    databaseURL: "https://project-c000e.firebaseio.com",
    projectId: "project-c000e",
    storageBucket: "project-c000e.appspot.com",
    messagingSenderId: "98833963738"
  };
firebase.initializeApp(config);
var database = firebase.database();


getData();

window.setInterval(function(){
  getData();
}, 60000);

function getData() {
  $('#table-body').empty();
  var query = firebase.database().ref().orderByKey();
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        var key = childSnapshot.key;
        var childData = childSnapshot.val();
        renderData(childData, key);
    });
  });
};

function getMitutesAway(firsttraintime, frequency) {
  console.log(firsttraintime);
  var now = moment(); //todays date
  var before = moment("2018-01-01 " + firsttraintime); // another date
  var duration = moment.duration(now.diff(before));
  var minutes = Math.floor(duration.asMinutes());
  var df = minutes % frequency;
  minutesAwayTime = frequency - df;

  return minutesAwayTime;
};

function getnextArrival(minutesAwayTime) {

  var nextArrivalTime = moment().add(minutesAwayTime, 'minutes').format("HH:mm");
  return nextArrivalTime;

}


function renderData(childData, key) {
  var tr = $('<tr>').attr("id", key);
  $('#table-body').append(tr);
  var trainName = $('<td>').text(childData.trainName);
  var destination = $('<td>').text(childData.destination);
  var frequency = $('<td>').text(childData.frequency);
  var minutesAway = $('<td>').text(getMitutesAway(childData.firsttraintime, childData.frequency));
  var nextArrival = $('<td>').text(getnextArrival(getMitutesAway(childData.firsttraintime, childData.frequency)));
  tr.append(trainName, destination, frequency, nextArrival, minutesAway);
};


$('#add-train').on("click", function(event) {
  event.preventDefault();
  firebase.database().ref().push({
    "destination" : $('#destination').val(),
    "frequency" : $('#frequency').val(),
    "trainName" : $('#train-name').val(),
    "firsttraintime" : $('#firsttraintime').val() + ":00"
  });
  getData();
});

