$.getJSON("/articles", function(data) {
// Grab the articles as a json
  // For each one

  for (var i = 0; i < data.length; i++) {
            //Format
            switch(data[i].source)
                  {
                      case "Bloomberg":
                            arformat="<div class='bloom'>";
                            break;

                      case "Deutche Welle":
                            arformat="<div class='dw'>";
                            break;
                            
                      case "Reuters":
                            arformat="<div class= 'reu'>";
                            break;

                      case "Time":
                            arformat="<div class='timemag'>";
                            break;

                      case "UPI":
                            arformat="<div class='upi'>";
                            break;
                      default:
                            arformat="<div class='def'>";
                  }

    // Format the Link

    $("#articles").
    append(arformat+"<p data-id='" + data[i]._id+"'>" 
    + data[i].source+": "+ "<br>" 
    + data[i].title + "<br>" 
    + data[i].link + "</p> </div>");
  }
});
            
// Whenever someone clicks a p tag
    $(document).on("click", "p", function() 
        {      
            $("#notes").empty();
            var thisId = $(this).attr("data-id");

            $.ajax({ method: "GET", url: "/articles/" + thisId }).done(function(data) {
                      $("#notes").append("<h2>" + data.title + "</h2>");
                      $("#notes").append("<input id='titleinput' name='title' >");
                      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
                      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) { 
              $("#titleinput").val(data.note.title);
              $("#bodyinput").val(data.note.body);
            }   
          });
      });

        $(document).on("click", "#savenote", function() {
          var thisId = $(this).attr("data-id");

        $.ajax({
          method: "POST",
          url: "/articles/" + thisId,
          data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data,title) {
      console.log(data);
      $("#notes").empty();
    });
  $("#titleinput").val("");
  $("#bodyinput").val("");
});