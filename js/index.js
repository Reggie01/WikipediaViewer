$(document).ready( function() {
  
  // Comiple handlbars template
  var listComponent   = $("#list-template").html();
  var listTemplate = Handlebars.compile( listComponent );
  
  var searchComponent = $("#searchbox-template").html();
  var searchTemplate = Handlebars.compile( searchComponent );
  
  var randomWikiComponent = $("#random-article-template").html();
  var randomWikiTemplate = Handlebars.compile( randomWikiComponent );
  
  $("#random_article_container").html(randomWikiTemplate);
  $("#searchbox_container").html(searchTemplate);
  $("#list_ul").html(listTemplate);
  
  function handleWikipediaResp( data ){
     console.log( data );
  }
  
  $.ajaxSetup({
        type : "GET",
        dataType : "jsonp",
    });
    
    function AjaxErrorHandler( xhr, status, errorThrown ){
      console.log("Sorry there was a problem.");
      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
    }
    
   function wikiAjaxRequest(url, options) {
       return $.ajax({
                    url : url,
                    jsonp : "callback",
                    data: options,
                    headers: { 'Api-User-Agent': "http://codepen.io/Reggie01; reggie@bgcreatives.com" },
                  });
    };
    
    function ajaxRequest() {
      var options = {
         action: "query",
         format: "json",
      }
      var request = wikiAjaxRequest("https://en.wikipedia.org/w/api.php?action=query&titles=Javascript&prop=revisions&rvprop=content&format=json");
      request.then(handleWikipediaResp).
        fail( AjaxErrorHandler );
    };
    
    ajaxRequest();
});