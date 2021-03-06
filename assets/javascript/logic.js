// Revisions:
// 8/6 18:00 CJ - Updated current, simplified JS
// 8/6 19:00 CJ - Added comments, fixed Null images, retooled to "slightly" fit search-results.html
// 8/11 17:45 CJ - Removed unnecessary formatting, commented out some code (may re-use if time)
// 8/11 22:00 CJ - Removed a console log, hide result table and then fade in as ajax call returns
// 8/12 00:05 CJ - Removed unused code

var generalSearch = "";
var categorySearch = "";
var locationSearch = "";
var distanceSearch = 0;
var startDate = "";
var endDate = "";

// On submit button click, perform ajax call and main search/populating functions
$("#submit-button").on("click", function() {
	event.preventDefault();
	generalSearch = $("#input-general").val().trim();
	locationSearch = $("#input-location").val().trim();
	distanceSearch = parseInt($(".input-distance").val());
	startDate = $("#input-start").val();
	endDate = $("#input-end").val();

	// Converts time from our calendar to UTC for queryURL
	var convertedStart = moment.utc(startDate).format();
	var convertedEnd = moment.utc(endDate).format();

	var queryURL = "https://www.eventbriteapi.com/v3/events/search/?token=PBMOFDBNG7TPGBUP7OSZ" + "&q=" + generalSearch + "&location.address=" + locationSearch + "&location.within=" + distanceSearch+"mi" + "&start_date.range_start=" + convertedStart + "&start_date.range_end=" + convertedEnd + "&expand=organizer,venue,pagination";
	$.ajax({
		url: queryURL,
		method: "GET"
		}).done(function(response) {
			console.log(response);
			var results = response.events;
			// loop through JSON results to create unique variables/storage/populating HTML
			results.forEach(function(result) {
				// Saving JSON object results to variables
				var eventImageDiv = $("<img class='event-image-toggled'>");
				if (result.logo === null) {
					var eventImage = "https://placehold.it/400x200";
					eventImageDiv.attr("src", "https://placehold.it/400x200");
				}
				else {
					var eventImage = result.logo.url;
					eventImageDiv.attr("src", eventImage).attr("href", "eventpage.html");
					// originalLogo size/URL for use on results page
					var originalLogo = result.logo.original.url;
				}
				var eventTitle = result.name.text;
				var eventDescription = result.description.text;
				var startEvent = result.start.local;
				var endEvent = result.end.local;
				var venueName = result.venue.name;
				var venueLat = result.venue.latitude;
				var venueLon = result.venue.longitude;
				var venueAddress = result.venue.address.localized_address_display;
				var organizerName = result.organizer.name;

				// converts time from UNIX ISO 8601 to MM/DD/YY hh:mm format
				var startEventConverted = moment(startEvent).format('MM/DD/YYYY hh:mm');
				var endEventConverted = moment(endEvent).format('MM/DD/YYYY hh:mm');

				// creates dynamic div for populating results
				var eventDiv = $("<tr class='toggle-form'>");
				// Fades in JSON result table
				$(eventDiv).hide().fadeIn(2500);
				// Appends 
				eventDiv.append(eventImageDiv);
				eventDiv.append("<td class= 'table-data-format' width='600'>" + eventTitle + "</td>");
				eventDiv.append("<td class= 'table-data-format' width='150'>" + startEventConverted + "</td>");
				eventDiv.append("<td class= 'table-data-format' width='150'>" + endEventConverted + "</td>");
				eventDiv.append("<td class= 'table-data-format' width='300'>" + venueName + "</td>");
				$(".search-results").prepend(eventDiv);

				// When a result's div is clicked, that information is saved in localStorage to be passed onto event page
				eventDiv.on("click", function() {
					localStorage.setItem("title", eventTitle);
					localStorage.setItem("description", eventDescription);
					localStorage.setItem("eventstart", startEventConverted);
					localStorage.setItem("eventend", endEventConverted);
					localStorage.setItem("logo", eventImage);
					localStorage.setItem("biglogo", originalLogo), 
					localStorage.setItem("venue", venueName);
					localStorage.setItem("latitude", venueLat);
					localStorage.setItem("longitude", venueLon);
					localStorage.setItem("address", venueAddress);
					localStorage.setItem("organizer", organizerName);
					eventImageDiv.slideToggle("slow");
				})
				eventImageDiv.on("click", function() {
					window.open("eventpage.html", "_blank");
				})
			})
			// Fades in existing HTML
			$(".event-table").fadeIn(2500);
		});
	// Clear form
	$("form").trigger("reset");
});

// jQuery UI datepicker
$(function() {
	var dateFormat = "mm/dd/yy",
		from = $("#input-start")
			.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				numberOfMonths: 2,
				minDate:0
		})
		.on("change", function() {
			to.datepicker("option", "minDate", getDate(this));
		}),
		to = $("#input-end").datepicker({
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1
		})
		.on("change", function() {
			from.datepicker("option", "maxDate", getDate(this));
		});
 
	function getDate(element) {
		var date;
		try {
			date = $.datepicker.parseDate(dateFormat, element.value);
		} catch(error) {
			date = null;
		}
		return date;
	}
});

// Hide HTML table (headings) on page load
function hideTable() {
	$(".event-table").hide();
}
hideTable();