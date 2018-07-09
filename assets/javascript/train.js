var config = {
    apiKey: "AIzaSyCMUbb3HBLImQmJOsCf-56ztTMusW6dTtE",
    authDomain: "project-c000e.firebaseapp.com",
    databaseURL: "https://project-c000e.firebaseio.com",
    projectId: "project-c000e",
    storageBucket: "project-c000e.appspot.com",
    messagingSenderId: "98833963738"
  };
firebase.initializeApp(config);
getData();


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

function setTimings() {
  var query = firebase.database().ref().orderByKey();
  query.once("value")
    .then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();
          var currentTime = moment().format('HH:mm');
          var trainStart = moment('2018-01-01 ' + childData.firsttraintime).format('HH:mm');
          var interval = childData.frequency;

          var differenceTime = moment.utc(moment(trainStart,"HH:mm").diff(moment(currentTime,"HH:mm"))).format("HH:mm");
          var differenceAsMinTime = moment.duration(differenceTime).asMinutes();

          var minutesAwayTime = differenceAsMinTime % interval;
          var nextArrivalTime = moment().add(minutesAwayTime, 'minutes').format("HH:mm");

          firebase.database().ref().child(key).update({
            nextArrival : nextArrivalTime,
            minutesAway: minutesAwayTime
          });
      });
  });
};


function renderData(childData, key) {
  var tr = $('<tr>').attr("id", key);
  $('#table-body').append(tr);
  var trainName = $('<td>').text(childData.trainName);
  var destination = $('<td>').text(childData.destination);
  var frequency = $('<td>').text(childData.frequency);
  var nextArrival = $('<td>').text(childData.nextArrival);
  var minutesAway = $('<td>').text(childData.minutesAway);
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
  setTimings();
  getData();
});

