var stateArray = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
'Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana',
'Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington',
'West Virginia','Wisconsin','Wyoming']

var typeArray = ["Micro", "Regional", "Brewpub", "Large", "Planning", "Bar", "Contract", "Proprietor"];
var tagsArray = ["Dog-friendly", "Patio", "Food-service", "Food-truck", "Tours"];

var searchCity;
var searchState;
var searchName;
var searchType;
var numResults=0;
var numBrews=0;
var results;
var getResults;
var x =0;

$(document).ready(function() {

    function createDropdown(){
        for(var i=0; i< stateArray.length;i++){
            var dropdown = $("#state-selector");
            var option = $("<option>");
            option.val(stateArray[i].replace(/ /g, '_'));
            option.text(stateArray[i]);
            dropdown.append(option);
        }

        for(var i=0; i< typeArray.length;i++){
            var dropdown = $("#type-input");
            var option = $("<option>");
            option.val(typeArray[i]);
            option.text(typeArray[i]);
            dropdown.append(option);
        }

    }

    function getNumStorage(){
        while(localStorage.getItem("brew"+x)!=null){
          numBrews++;
          x++;
        }
    }


    function fixStorage(){
      for(var i=0;i<numBrews;i++){
        
        if(localStorage.getItem("brew"+i)=="null"){
          
          for(var j = i;j<numBrews;j++){
            localStorage.setItem("brew"+j,localStorage.getItem("brew"+(j+1)));
          }
          numBrews--;
          localStorage.removeItem("brew"+numBrews);
        }
      }
      indexListCreate();
    }

    function indexListCreate(){
      $("#list-area").empty();
      for(var i=0;i<numBrews;i++){
      
        getResults = JSON.parse(localStorage.getItem("brew"+i));
        
  
        // var holderBody = $("<tbody>")
        var holderRow = $("<tr>");
  
        // holderBody.append(holderRow);
  
        var holderName = $("<td>");
        holderName.text(getResults.name);
  
        var holderState = $("<td>");
        holderState.text(getResults.state);
  
        var holderCity = $("<td>");
        holderCity.text(getResults.city);
  
        var holderStreet = $("<td>");
        holderStreet.text(getResults.street);

        var holderModal = $("<button type='button' class='btn btn-primary modalButton' data-toggle='modal' data-target='#exampleModalLong' id='modal'>");
        holderModal.text("Click for more Info");
  
        var radio = $("<div class='form-check'>");
        var input = $("<input class='form-check-input' type='checkbox' value='"+i+"' id='checkbox"+i+"'>");
        radio.append(input);
        
        holderRow.append(radio);
        holderRow.append(holderName);
        holderRow.append(holderState);
        holderRow.append(holderCity);
        holderRow.append(holderStreet);
        holderRow.append(holderModal);
        $("#list-area").append(holderRow);
  
      }
    }
    

    createDropdown();

    $("#form-submit").on("click", function() {
        event.preventDefault();
        $("#results-area").empty();

        searchCity = $("#city-input").val();
        if(searchCity!=""){
            searchCity = searchCity.trim();
            searchCity.replace((/ /g, '_'))
        }
        searchState = $("#state-selector").val();
        searchName = $("#name-input").val();
        if(searchName!=""){
            searchName = searchName.trim();
            searchName.replace((/ /g, '_'))
        }
        searchType = $("#type-input").val();

        var queryURL = "https://api.openbrewerydb.org/breweries?by_state="+searchState+"&by_city="+searchCity+"&by_name="+searchName+"&by_type="+searchType;

      $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
          results = response;
          numResults = results.length;
          
          for(var i=0;i<results.length;i++){
            var holderBody = $("<tbody>")
            var holderRow = $("<tr>");
            
            var radio = $("<div class='form-check'>");
            var input = $("<input class='form-check-input' type='checkbox' value='"+i+"' id='checkbox"+i+"'>");
            radio.append(input);

            holderBody.append(holderRow);
            holderRow.append(radio);

            var holder = $("<td>");
            holder.text(results[i].name);

            holderRow.append(holder);
            $("#results-area").append(holderBody);

          }
        });

    });





    $("#result-submit").on("click", function() {
      event.preventDefault();
      for(var i=0;i<numResults;i++){
    
        if($('#checkbox'+i).prop('checked')){
          
          localStorage.setItem("brew"+numBrews,JSON.stringify(results[i]));
          numBrews++;
        }
      }
    });

    $("#remove-button").on("click", function() {
      event.preventDefault();
      for(var i=0;i<numBrews;i++){
    
        if($('#checkbox'+i).prop('checked')){
          
          localStorage.setItem("brew"+i,null);
          
        }
      }
      fixStorage();
    });

    $(document).on("click",".modalButton", function() {
      event.preventDefault();
      console.log("test");
      $("#modalTitle").text("test");
    });

    getNumStorage();
    indexListCreate();

});

