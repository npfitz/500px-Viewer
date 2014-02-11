var js_key = 'a584e6e0dfbbb816269e61e8cfd1a64362cd980f'

var image_page = {};
var search_page = {};

//init 500px api
$(document).ready(function(){
    //Set up external JQM elements
    $("body>[data-role='panel']").panel();
    $("#search_popup").enhanceWithin().popup();
    $("#nav").listview();

    init500px(fetchFlow);

});

function init500px(cb){
    _500px.init({
        sdk_key: js_key
    });
    cb();
}

function fetchFlow(){
    // Use the 500px API to fetch images
    _500px.api('/photos', { feature: 'popular', page: 1, rpp: 40, image_size: 3 }, function (response) {
        console.log(response.data.photos);
        //Loop through all photos and append each one to the flow container element
        response.data.photos.forEach(function(element){
            var img = $("<img>");
            img.prop("src", element.image_url);
            img.addClass("thumbnail");
            img.click(function(){
                image_page.id = element.id;
                $.mobile.changePage("image.html");
            });
            $(".flow_container").append(img);
        })        
    });
}

$(document).on("click", "#search_button", function(e){
    e.preventDefault();
    search_page.term = $("#search_term").val();
    $.mobile.changePage("search.html");
})

$(document).on("pagecreate", "#search_page", function(){

    $("#search_page .ui-content h2").html(search_page.term);

    _500px.api("/photos/search", {image_size: 3, term: search_page.term, rpp: 40, image_size: 3}, function(response){
        response.data.photos.forEach(function(element){
            var img = $("<img>");
            img.prop("src", element.image_url);
            img.addClass("thumbnail");

            img.click(function(){
                image_page.id = element.id;
                $.mobile.changePage("image.html");
            })

            $(".search_results_container").append(img);
        })

    });


});

$(document).on("pagecreate", "#image_page", function(){
    //Remove the image that is there, if there is one;
    $("#full_screen_img").prop("src", "");
    $("#image_name").html("");
    //Use the 500px API to fetch full size image
    _500px.api("/photos/" + image_page.id, {image_size: 4}, function(response){
        $("#full_screen_img").prop("src", response.data.photo.image_url);
        $("#image_name").html(response.data.photo.name);
    });
});
