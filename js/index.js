$(document).ready( function() {
  
  // Comiple handlbars template
  var listComponent   = $("#list-template").html();
  var listTemplate = Handlebars.compile( listComponent );
  
  var searchComponent = $("#searchbox-template").html();
  var searchTemplate = Handlebars.compile( searchComponent );
  
  var randomWikiComponent = $("#random-article-template").html();
  var randomWikiTemplate = Handlebars.compile( randomWikiComponent );
  
  var resultCounterComponent =  $('#result-counter-template').html();
  var resultCounterTemplate = Handlebars.compile( resultCounterComponent );
  
  $( "#random_article_container" ).html( randomWikiTemplate );
  $( "#searchbox_container" ).html( searchTemplate );
  $( "result_counter_container" ).html( resultCounterTemplate );
  $( "#list_container" ).html( listTemplate );
  
  function formHandler(e) {
   e.preventDefault();
   var $input = $( "input:first" );
   if( $input.val() ){
      ajaxRequest( $input.val() );
   }
   
  }
  
  $( "form" ).submit( formHandler );
  $( "#list_container" ).delegate( "li", "mouseenter", function( e ) {     
    $( e.currentTarget ).find( ".list-indicator").addClass( "light_indicator_lighter" );        
     console.log( e.currentTarget );   
  });
  
  $( "#list_container" ).delegate( "li", "mouseleave", function( e ) {    
    $( e.currentTarget ).find( ".list-indicator").removeClass( "light_indicator_lighter" );  
    console.log( e.currentTarget ); 
  });
  
  function createWikipediaUrl( title ){
     var url = "https://en.wikipedia.org/wiki/{{id}}";
     if( title.indexOf(" ") !== -1 ){
       title = title.replace( / /g, "_" );
     }
     
     return url.replace( "{{id}}", title );
  }
  
  function handleWikipediaResp( data ){
     
     var items = [];
     if( data.query !== undefined ){

      var pages = data.query.pages;
      for (var page in pages ){
        items.push(
         { 
          extract: pages[page].extract,
          title: pages[page].title,
          url: createWikipediaUrl( pages[page]. title ) 
         }
        )
      }
     
      $( "#list_container" ).html( listTemplate({ items: items, results: false  }) );
      $( "#result_counter_container" ).html( resultCounterTemplate({ count: items.length }) );
      console.log( items );      
     } else {

       $( "#list_container" ).html( listTemplate({ items: items, results: true  }) );
       $( "#result_counter_container" ).html( resultCounterTemplate({ count: items.length }) );
     }
     
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
    
   function wikiAjaxRequest( url, options) {
       return $.ajax({
                    url : url,
                    jsonp : "callback",
                    data: options,
                    headers: { 'Api-User-Agent': "http://codepen.io/Reggie01; reggie@bgcreatives.com" },
                  });
    };
    
    function ajaxRequest( searchTerm ) {
      var term = searchTerm || "";
      var url =  "https://en.wikipedia.org/w/api.php?&exintro&explaintext"
      var options = {
         action: "query",
         format: "json",
         generator:"search",
         //gsrnamespace: 0,
         gsrlimit: 10,
         //srlimit: 10,
         prop: "extracts",
         //pilimit: "max",
         exsentences: 1,
         exlimit: "max",
         gsrsearch: searchTerm,
      }
     
      var request = wikiAjaxRequest( url, options);
      request.then(handleWikipediaResp).
        fail( AjaxErrorHandler );
    };
    
    //ajaxRequest( searchTerm );
});