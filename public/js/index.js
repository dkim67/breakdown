// Get references to page elements
var $exampleText = $("#example-text");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we"ll make
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
  },
  getExamples: function() {
    return $.ajax({
      url: "api/ideas",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.title)
        .attr("href", "/ideas/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    title: $exampleText.val().trim(),
    description: $exampleDescription.val().trim(),
    rating: 3
  };

  if (!(example.title && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example"s delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

//paypal

paypal.Button.render(
  {
    env: "sandbox", // sandbox | production

    // PayPal Client IDs - replace with your own
    // Create a PayPal app: https://developer.paypal.com/developer/applications/create
    client: {
      sandbox:
        "AR9Q_bcRdnunghh10G1xHJU9utET45CTLjtS-Pp4Zut2THxAgm9zYKJBfM9zfYDD6SGhuMDFCrW4XDsg",
      production: "<insert production client id>"
    },

    // Show the buyer a "Pay Now" button in the checkout flow
    commit: true,

    // payment() is called when the button is clicked
    payment: function(data, actions) {
      // Make a call to the REST api to create the payment
      return actions.payment.create({
        payment: {
          transactions: [
            {
              amount: { total: "0.01", currency: "USD" }
            }
          ]
        }
      });
    },

    // onAuthorize() is called when the buyer approves the payment
    onAuthorize: function(data, actions) {
      // Make a call to the REST api to execute the payment
      return actions.payment.execute().then(function() {
        window.alert("Payment Complete!");
      });
    }
  },
  "#paypal-button-container"
);
