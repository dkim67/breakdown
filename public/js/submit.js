// Get references to page elements
var $title = $("#title");
var $description = $("#description");
var $technologyUsed = $("#technology-used");
var $usersStory = $("#users-story");
var $rating = $("#rating");
var $link = $("#link");
var $submitBtn = $("#submit");
// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/ideas",
      data: JSON.stringify(example)
    });
  }
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();
  var example = {
    title: $title.val().trim(),
    description: $description.val().trim(),
    technologyUsed: $technologyUsed.val().trim(),
    usersStory: $usersStory.val().trim(),
    rating: $rating.val().trim(),
    link: $link.val().trim()
  };
  console.log(example);
  if (!(example.title && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }
  API.saveExample(example).then(function() {
    res.end();
  });
  $title.val("");
  $description.val("");
  $technologyUsed.val("");
  $usersStory.val("");
  $rating.val("");
  $link.val("");
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
