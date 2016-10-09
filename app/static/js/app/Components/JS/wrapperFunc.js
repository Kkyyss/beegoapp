import $ from 'jquery';
import swal from 'sweetalert2';
import moment from 'moment';
import Fuse from 'fuse.js';

window.Jquery = $;
window.Moment = moment;
window.SweetAlert = swal;

var ajax = $.ajax;
var roomDataSource,
    requestDataSource,
    bookedDataSource,
    usersDataSource,
    adminDataSource,
    userRequestDataSource,
    roomTypeDataSource,
    roomStatusDataSource,
    userBookedDataSource;

var searchRoomOption = ["RoomNo"],
searchRequestOption = ["Status"],
searchBookedOption = ["Room.RoomNo"],
searchUserRequestOption = ["Status"],
searchRoomTypeOption = ["Campus"],
searchUserOption = ["StudentId"],
searchAdminOption = ["AdminId"],
searchRoomStatusOption = ["Campus"];

require('./pagination.min.js');

window.Wrapper = {
  DisabledFormSubmitByEnterKeyDown: function(obj) {
    obj.on('keyup keypress', function(e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });
  },
  LockScreen: function(btnObj, formObj, decision) {
     btnObj.prop('disabled', decision);
     lockForm(formObj, decision);
     this.LoadingSwitch(decision);
  },
  ResetCap: function(obj) {
    grecaptcha.reset(obj);
  },
  AlertStatus: function(title, text, type, allowOutsideClick, allowEscapeKey) {
   swal({
     title: title,
       text: text,
       type: type,
       allowOutsideClick: allowOutsideClick,
       allowEscapeKey: allowEscapeKey,
   }).done();
  },
  BasicValidation: function(valid, msgObj, message, object) {
   if (!valid) {
     showErrorMessage(msgObj, message);
     verifiedInput(object, false);
     return false;
   }
   hideErrorMessage(msgObj);
   verifiedInput(object, true);
   return true;
  },
  MeetRequirement: function(object, msgObj, message) {
   hideErrorMessage(msgObj);
   setMessage(msgObj, message);
   verifiedInput(object, true);
  },
  ResizeChanging: function() {
    var cardWrapperHeight, cardHeight, marginCardHeight;
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();

    cardWrapperHeight = windowHeight - 112;
    $('#card-wrapper').height(cardWrapperHeight);
    cardHeight = $('#card').height();
    marginCardHeight = 32;
    $('#card').css('margin-top', marginCardHeight).
               css('margin-bottom', marginCardHeight);

    if (windowWidth <= 767) {
      $('.paginationjs').removeClass('paginationjs-big').addClass('paginationjs-medium');
    } else {
      $('.paginationjs').removeClass('paginationjs-medium').addClass('paginationjs-big');
    }
  },
  LoadingSwitch: function(switcher) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd ' +
               'oanimationend animationend';
   if (switcher) {
     $('<div id="wrapper" class="loading-screen hide">'+
       '<div class="loadingPos"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>' +
       '</div>'
     ).prependTo('body');
    $("#wrapper").addClass('animated fadeIn').removeClass('hide');
     return;
   }
    $('#wrapper').addClass("animated fadeOut").one(animationEnd, function() {
      $(".loading-screen").remove();
    });
  },
  PaginateRoomContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = roomListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          var removeRoomBtn = $('.removeRoomButton');
          var editRoomBtn = $('.editRoomButton');
          searchBox.unbind('input', SearchRoomQuery);
          removeRoomBtn.unbind('click', removeRoom);
          editRoomBtn.unbind('click', editRoom);
          searchBox.bind('input', SearchRoomQuery);
          removeRoomBtn.bind('click', removeRoom);
          editRoomBtn.bind('click', editRoom);
        },
        afterPaging: function() {
          var removeRoomBtn = $('.removeRoomButton');
          var editRoomBtn = $('.editRoomButton');
          removeRoomBtn.on('click', removeRoom);
          editRoomBtn.on('click', editRoom);
        }
    });
  },
  PaginateRequestContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = requestListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          var removeRequestBtn = $('.removeRequestButton'),
          viewRequestBtn = $('.viewRequestButton'),
          approveRequestButton = $('.approveRequestButton'),
          deniedRequestButton = $('.deniedRequestButton');

          searchBox.unbind('input', SearchRequestQuery);
          removeRequestBtn.unbind('click', removeRequest);
          viewRequestBtn.unbind('click', viewRequest);
          approveRequestButton.unbind('click', approveRequest);
          deniedRequestButton.unbind('click', deniedRequest);

          searchBox.bind('input', SearchRequestQuery);
          removeRequestBtn.bind('click', removeRequest);
          viewRequestBtn.bind('click', viewRequest);
          approveRequestButton.bind('click', approveRequest);
          deniedRequestButton.bind('click', deniedRequest);
        },
        afterPaging: function() {
          var removeRequestBtn = $('.removeRequestButton'),
          viewRequestBtn = $('.viewRequestButton'),
          approveRequestButton = $('.approveRequestButton'),
          deniedRequestButton = $('.deniedRequestButton');

          removeRequestBtn.on('click', removeRequest);
          viewRequestBtn.on('click', viewRequest);
          approveRequestButton.on('click', approveRequest);
          deniedRequestButton.on('click', deniedRequest);
        }
    });
  },
  PaginateBookedContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = bookedListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          var removeBookedBtn = $('.removeBookedButton'),
          viewBookedBtn = $('.viewBookedButton');

          searchBox.unbind('input', SearchBookedQuery);
          removeBookedBtn.unbind('click', removeBooked);
          viewBookedBtn.unbind('click', viewBooked);

          searchBox.bind('input', SearchBookedQuery);
          removeBookedBtn.bind('click', removeBooked);
          viewBookedBtn.bind('click', viewBooked);
        },
        afterPaging: function() {
          var removeBookedBtn = $('.removeBookedButton'),
          viewBookedBtn = $('.viewBookedButton');

          removeBookedBtn.on('click', removeBooked);
          viewBookedBtn.on('click', viewBooked);
        }
    });
  },
  PaginateUsersContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = userListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          var removeUserBtn = $('.removeUserButton'),
          editUserBtn = $('.editUserButton');

          searchBox.unbind('input', SearchUserQuery);
          removeUserBtn.unbind('click', removeUser);
          editUserBtn.unbind('click', editUser);

          searchBox.bind('input', SearchUserQuery);
          removeUserBtn.bind('click', removeUser);
          editUserBtn.bind('click', editUser);
        },
        afterPaging: function() {
          var removeUserBtn = $('.removeUserButton'),
          editUserBtn = $('.editUserButton');

          removeUserBtn.on('click', removeUser);
          editUserBtn.on('click', editUser);
        }
    });
  },
  PaginateAdminContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = adminListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          var removeAdminBtn = $('.removeAdminButton'),
          editAdminBtn = $('.editAdminButton'),
          viewAdminBtn = $('.viewAdminButton');

          searchBox.unbind('input', SearchAdminQuery);
          removeAdminBtn.unbind('click', removeAdmin);
          editAdminBtn.unbind('click', editAdmin);
          viewAdminBtn.unbind('click', viewAdmin);

          searchBox.bind('input', SearchAdminQuery);
          removeAdminBtn.bind('click', removeAdmin);
          editAdminBtn.bind('click', editAdmin);
          viewAdminBtn.bind('click', viewAdmin);
        },
        afterPaging: function() {
          var removeAdminBtn = $('.removeAdminButton'),
          editAdminBtn = $('.editAdminButton'),
          viewAdminBtn = $('.viewAdminButton');

          removeAdminBtn.on('click', removeAdmin);
          editAdminBtn.on('click', editAdmin);
          viewAdminBtn.on('click', viewAdmin);
        }
    });
  },
  PaginateUserRequestContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = userRequestListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          var cancelRequestBtn = $('.cancelRequestButton'),
          paymentBtn = $('.paymentButton'),
          viewRequestBtn = $('.viewRequestButton');

          searchBox.unbind('input', SearchUserRequestQuery);
          cancelRequestBtn.unbind('click', cancelRequest);
          paymentBtn.unbind('click', madePayment);
          viewRequestBtn.unbind('click', viewRequest);

          searchBox.bind('input', SearchUserRequestQuery);
          cancelRequestBtn.bind('click', cancelRequest);
          paymentBtn.bind('click', madePayment);
          viewRequestBtn.bind('click', viewRequest);
        },
        afterPaging: function() {
          var cancelRequestBtn = $('.cancelRequestButton'),
          paymentBtn = $('.paymentButton'),
          viewRequestBtn = $('.viewRequestButton');

          cancelRequestBtn.on('click', cancelRequest);
          paymentBtn.on('click', madePayment);
          viewRequestBtn.on('click', viewRequest);
        }
    });
  },
  PaginateRoomTypeContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = roomTypeListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          var removeRoomTypeBtn = $('.removeRoomTypeButton'),
          editRoomTypeBtn = $('.editRoomTypeButton');

          searchBox.unbind('input', SearchRoomTypeQuery);
          removeRoomTypeBtn.unbind('click', removeRoomType);
          editRoomTypeBtn.unbind('click', editRoomType);

          searchBox.bind('input', SearchRoomTypeQuery);
          removeRoomTypeBtn.bind('click', removeRoomType);
          editRoomTypeBtn.bind('click', editRoomType);
        },
        afterPaging: function() {
          var removeRoomTypeBtn = $('.removeRoomTypeButton'),
          editRoomTypeBtn = $('.editRoomTypeButton');

          removeRoomTypeBtn.on('click', removeRoomType);
          editRoomTypeBtn.on('click', editRoomType);
        }
    });
  },
  PaginateRoomStatusContent: function(ds) {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    var searchBox = $('#search-box');

    if (ds.length == 0) {
      content.empty();
      container.pagination('destroy');
      $('#errMsg').text('No Results Found.');
      return;
    }
    container.pagination({
        dataSource: ds,
        pageSize: 5,
        // autoHidePrevious: true,
        // autoHideNext: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        showGoInput: true,
        showGoButton: true,
        className: 'paginationjs-theme-red paginationjs-big',
        formatGoInput: 'Go to <%= input %>',
        callback: function(data, pagination) {
          $('#errMsg').text('');
          var html = roomStatusListTemplate(data);
          content.html(html);
        },
        afterRender: function() {
          // var viewRoomStatusBtn = $('.viewRoomStatusButton');

          searchBox.unbind('input', SearchRoomStatusRequestQuery);
          searchBox.bind('input', SearchRoomStatusRequestQuery);
        },
        afterPaging: function() {
        }
    });
  },
  SetRoomDataSource: function(ds) {
    roomDataSource = ds;
  },
  SetRequestDataSource: function(ds) {
    requestDataSource = ds;
  },
  SetBookedDataSource: function(ds) {
    bookedDataSource = ds;
  },
  SetUsersDataSource: function(ds) {
    usersDataSource = ds;
  },
  SetAdminDataSource: function(ds) {
    adminDataSource = ds;
  },  
  SetUserRequestDataSource: function(ds) {
    userRequestDataSource = ds;
  },
  SetUserBookedDataSource: function(ds) {
    userBookedDataSource = ds;
  },
  SetRoomTypeDataSource: function(ds) {
    roomTypeDataSource = ds;
  },
  SetRoomStatusDataSource: function(ds) {
    roomStatusDataSource = ds;
  },
  GetRoomDataSource: function() {
    return roomDataSource;
  },
  GetRequestDataSource: function() {
    return requestDataSource;
  },
  GetBookedDataSource: function() {
    return bookedDataSource;
  },
  GetUsersDataSource: function() {
    return usersDataSource;
  },
  GetUserRequestDataSource: function() {
    return userRequestDataSource;
  },
  GetUserBookedDataSource: function() {
    return userBookedDataSource;
  },
  GetRoomTypeDataSource: function() {
    return roomTypeDataSource;
  },
  GetRoomStatusDataSource: function() {
    return roomStatusDataSource;
  },
  ClearContent: function() {
    var container = $('#pagination-container');
    var content = $('#pagination-content');
    content.empty();
    container.pagination('destroy');    
  },
  SetUpUser: function(ds) {
    window.UserData = ds;
  },
  SetUpUserSearchOption: function(ds) {
    searchUserOption = ds;
    SearchUserQuery();
  },
  SetUpAdminSearchOption: function(ds) {
    searchAdminOption = ds;
    SearchAdminQuery();
  },  
  SetUpRoomTypeSearchOption: function(ds) {
    searchRoomTypeOption = ds;
    SearchRoomTypeQuery();
  },
  SetUpRoomSearchOption: function(ds) {
    searchRoomOption = ds;
    SearchRoomQuery();
  },
  SetUpRequestSearchOption: function(ds) {
    searchRequestOption = ds;
    SearchRequestQuery();
  },
  SetUpUserRequestSearchOption: function(ds) {
    searchUserRequestOption = ds;
    SearchUserRequestQuery();
  },
  SetUpBookedSearchOption: function(ds) {
    searchBookedOption = ds;
    SearchBookedQuery();
  },
  SetUpRoomStatusSearchOption: function(ds) {
    searchRoomStatusOption = ds;
    SearchRoomStatusRequestQuery();
  },
  SetUpEditUser: function() {

  },
}

function setObjectCss(object, selector, value) {
 $(object).css(selector, value);
}

function showErrorMessage(object, message) {
 object.text(message).removeClass("text-success")
   .addClass("text-danger");
}
function hideErrorMessage(object) {
 object.removeClass("text-danger")
   .addClass("text-success");
}
function setMessage(object, message) {
 object.text(message);
}
function lockForm(obj, decision) {
 obj.each(function(){
     $(this).find(':input').prop('readonly', decision);
 });
}

function verifiedInput(object, verified) {
 if (verified) {
   object.removeClass("text-danger");
   return;
 }
 object.addClass("text-danger");
}

function roomListTemplate(data) {
  var html = '';
  $.each(data, function(index, item){
    var available = item.IsAvailable ? 'Available' : 'Not Available';
    var twin = item.Twin ? 'Twin' : 'Single';
    html += '<div class="room-list-style">'+ 
    '<span id="room-id" class="hide">' + item.Id + '</span>' +
    '<span id="room-pmf" class="hide">' + item.PerMonthFee + '</span>' +
    '<span id="room-cp" class="paraStyle">' + item.Campus + '</span>' + 
    '<span id="room-no" class="paraStyle">' + item.RoomNo + '</span>' +
    '<span id="room-tp" class="paraStyle">' + item.TypesOfRooms + '</span>' +
    '<span id="room-a" class="paraStyle">' + available + '</span>' +
    '<span id="room-t" class="paraStyle">' + twin + '</span>' +
    '<div class="rightAlignment">' +
    '<button type="button" class="editRoomButton">Edit</button>' +
    '<button type="button" class="removeRoomButton">Remove</button>' +
    '</div>' +
    '</div>';
  });
  return html;
}
function requestListTemplate(data) {
  var html = '';
  $.each(data, function(index, item){
    var Isprocess = (item.Status === 'Processing') ? '<button type="button" class="deniedRequestButton">Denied</button>' +
    '<button type="button" class="approveRequestButton">Approve</button>' : "";
    html += '<div class="request-list-style">'+
    '<span id="request-id" class="hide">' + item.Id + '</span>' +
    '<span id="request-rd" class="paraStyle">' + moment(item.DateRequest).format('MMMM Do YYYY') + '</span>' +
    '<span id="request-ss" class="hide">' + item.Session + '</span>' +
    '<span id="request-tp" class="hide">' + item.TypesOfRooms + '</span>' +
    '<span id="request-dp" class="hide">' + item.Deposit + '</span>' +
    '<span id="request-rpp" class="hide">' + item.RatesPerPerson + '</span>' +
    '<span id="request-py" class="hide">' + item.Payment + '</span>' +
    '<span id="request-s" class="paraStyle">' + item.Status + '</span>' +
    '<span id="request-dmd" class="hide">' + moment(item.DicisionMadeDate).format('MMMM Do YYYY') + '</span>' +
    '<span id="request-user-id" class="hide">' + item.User.Id + '</span>' +
    '<span id="request-user-name" class="paraStyle">' + item.User.Name + '</span>' +
    '<span id="request-user-si" class="paraStyle">' + item.User.StudentId + '</span>' +
    '<span id="request-user-gender" class="hide">' + item.User.Gender + '</span>' +
    '<span id="request-user-email" class="hide">' + item.User.Email + '</span>' +
    '<span id="request-user-contactno" class="hide">' + item.User.ContactNo + '</span>' +
    '<span id="request-user-avatar" class="hide">' + item.User.AvatarUrl + '</span>' +
    '<div class="rightAlignment">' +
    Isprocess +
    '<button type="button" class="viewRequestButton">View</button>' +
    '<button type="button" class="removeRequestButton">Remove</button>' +
    '</div>' +
    '</div>';
  });
  return html;  
}

function bookedListTemplate(data) {
  var html = '';
  $.each(data, function(index, item){
    html += '<div class="booked-list-style">'+
    '<span id="booked-id" class="hide">' + item.Id + '</span>' +
    '<span id="booked-room-id" class="hide">' + item.Room.Id + '</span>' +
    '<span id="booked-name" class="paraStyle">' + item.Name + '</span>' +
    '<span id="booked-student-id" class="hide">' + item.StudentId + '</span>' +
    '<span id="booked-cp" class="paraStyle">' + item.Room.Campus + '</span>' +
    '<span id="booked-tor" class="paraStyle">' + item.Room.TypesOfRooms + '</span>' +
    '<span id="booked-rn" class="paraStyle">' + item.Room.RoomNo + '</span>' +
    '<div class="rightAlignment">' +
    '<button type="button" class="viewBookedButton">View</button>' +
    '<button type="button" class="removeBookedButton">Remove</button>' +
    '</div>' +
    '</div>';
  });

  return html;
}


function userListTemplate(data) {
  var html = '';
  $.each(data, function(index, item){
    var buttons = '<button type="button" class="editUserButton">Edit</button>' +
              '<button type="button" class="removeUserButton">Remove</button>';

    var activated = (item.Activated) ? "Activated" : "Inactivated";
    var profiled = (item.FillUpProfile) ? "Filled" : "Not yet";

    html += '<div class="user-list-style">'+
    '<img src="'+ item.AvatarUrl +'" width="32x32" class="imgRound" />'+
    '<span id="u-id" class="hide">' + item.Id + '</span>' +
    '<span id="u-cn" class="hide">' + item.ContactNo + '</span>' +
    '<span id="u-avatar" class="hide">' + item.AvatarUrl + '</span>' +
    '<span id="u-email" class="hide">' + item.Email + '</span>' +
    '<span id="u-gender" class="hide">' + item.Gender + '</span>' +
    '<span id="u-activated" class="hide">' + activated + '</span>' +
    '<span id="u-profiled" class="hide">' + profiled + '</span>' +
    '<span class="paraStyle">Campus -</span><span id="u-campus">' + item.Campus + '</span>' +
    '<span class="paraStyle">ID - </span><span id="u-student-id">' + item.StudentId + '</span>' +
    '<span class="paraStyle">Name -</span><span id="u-name">' + item.Name + '</span>' +
    '<div class="rightAlignment">' +
    buttons +
    '</div>' +
    '</div>';
  });

  return html;
}

function adminListTemplate(data) {
  var html = '';
  var user_data = window.UserData;
  $.each(data, function(index, item){
    var buttons;
    switch (user_data.campus) {
      case 'ALL':
        if (user_data.fullPermission) {
          switch (item.Campus) {
            case 'ALL':
              buttons = (!item.FullPermission) ? '<button type="button" class="editAdminButton">Edit</button>' +
              '<button type="button" class="removeAdminButton">Remove</button>' : '<button type="button" class="viewAdminButton">View</button>';
              break;
            default:
              buttons = '<button type="button" class="editAdminButton">Edit</button>' +
              '<button type="button" class="removeAdminButton">Remove</button>';
              break;
          }
        } else {
          buttons = (item.Campus !== 'ALL') ? '<button type="button" class="editAdminButton">Edit</button>' +
          '<button type="button" class="removeAdminButton">Remove</button>' : '<button type="button" class="viewAdminButton">View</button>';
        }
        break;
      default:
        if (user_data.fullPermission) {
          switch (item.Campus) {
            case user_data.campus:
              buttons =  (!item.FullPermission) ? '<button type="button" class="editAdminButton">Edit</button>' +
              '<button type="button" class="removeAdminButton">Remove</button>' : '<button type="button" class="viewAdminButton">View</button>';
              break;
            default:
              buttons = '<button type="button" class="viewAdminButton">View</button>';
              break;
          }
        } else {
          buttons = '<button type="button" class="viewAdminButton">View</button>';
        }
        break;
    }
    var admin_id = '<span class="paraStyle">ID - </span><span id="u-student-id">' + item.AdminId + '</span>' ;

    var activated = (item.Activated) ? "Activated" : "Inactivated";
    var fullPermission = (item.FullPermission) ? "Full" : "Normal";

    var permission = '<span class="paraStyle">Permission -</span><span id="a-fullPermission">' + fullPermission + '</span>';

    html += '<div class="user-list-style">'+
    '<img src="'+ item.AvatarUrl +'" width="32x32" class="imgRound" />'+
    '<span id="a-id" class="hide">' + item.Id + '</span>' +
    '<span id="a-cn" class="hide">' + item.ContactNo + '</span>' +
    '<span id="a-avatar" class="hide">' + item.AvatarUrl + '</span>' +
    '<span id="a-email" class="hide">' + item.Email + '</span>' +
    '<span id="a-gender" class="hide">' + item.Gender + '</span>' +
    '<span id="a-activated" class="hide">' + activated + '</span>' +
    '<span class="paraStyle">Campus -</span><span id="a-campus">' + item.Campus + '</span>' +
    admin_id +
    '<span class="paraStyle">Name -</span><span id="a-name">' + item.Name + '</span>' +
    permission +
    '<div class="rightAlignment">' +
    buttons +
    '</div>' +
    '</div>';
  });

  return html;
}

function userRequestListTemplate(data) {
  var html = '';
  $.each(data, function(index, item){
    var Isprocess = (item.Status === 'Approved') ? '<button type="button" class="paymentButton">Payment</button>' : "";
    Isprocess += (item.Status === 'Processing' || item.Status === 'Approved' || item.Status === 'Paid Off') ? '<button type="button" class="cancelRequestButton">Cancel</button>' : "";
    html += '<div class="request-list-style">'+
    '<span id="request-id" class="hide">' + item.Id + '</span>' +
    '<span id="request-rd" class="paraStyle">' + moment(item.DateRequest).format('MMMM Do YYYY') + '</span>' +
    '<span id="request-ss" class="hide">' + item.Session + '</span>' +
    '<span id="request-tp" class="hide">' + item.TypesOfRooms + '</span>' +
    '<span id="request-dp" class="hide">' + item.Deposit + '</span>' +
    '<span id="request-rpp" class="hide">' + item.RatesPerPerson + '</span>' +
    '<span id="request-py" class="hide">' + item.Payment + '</span>' +
    '<span id="request-s" class="paraStyle">' + item.Status + '</span>' +
    '<span id="request-dmd" class="hide">' + moment(item.DicisionMadeDate).format('MMMM Do YYYY') + '</span>' +
    '<span id="request-user-id" class="hide">' + item.User.Id + '</span>' +
    '<span id="request-user-name" class="hide">' + item.User.Name + '</span>' +
    '<span id="request-user-si" class="paraStyle">' + item.User.StudentId + '</span>' +
    '<span id="request-user-balance" class="hide">' + item.User.Balance + '</span>' +
    '<span id="request-user-gender" class="hide">' + item.User.Gender + '</span>' +
    '<span id="request-user-email" class="hide">' + item.User.Email + '</span>' +
    '<span id="request-user-contactno" class="hide">' + item.User.ContactNo + '</span>' +
    '<span id="request-user-avatar" class="hide">' + item.User.AvatarUrl + '</span>' +
    '<span id="request-nap" class="hide">' + (item.Payment + item.User.Balance) + '</span>' +
    '<div class="rightAlignment">' +
    '<button type="button" class="viewRequestButton">View</button>' +
    Isprocess +
    '</div>' +
    '</div>';
  });
  return html;  
}

function roomTypeListTemplate(data) {
  var html = '';
  $.each(data, function(index, item){
    var twin = (item.Twin) ? "Twin" : "Single";
    html += '<div class="room-type-list-style">'+
    '<span id="rt-id" class="hide">' + item.Id + '</span>' +
    '<span id="rt-campus" class="paraStyle">' + item.Campus + '</span>' +
    '<span id="rt-tor" class="paraStyle">' + item.TypesOfRooms + '</span>' +
    '<span id="rt-dp" class="paraStyle">' + item.Deposit + '</span>' +
    '<span id="rt-rpp" class="paraStyle">' + item.RatesPerPerson + '</span>' +
    '<span id="rt-twin" class="paraStyle">' + twin + '</span>' +
    '<span id="rt-gender" class="paraStyle">' + item.Gender + '</span>' +
    '<div class="rightAlignment">' +
    '<button type="button" class="editRoomTypeButton">Edit</button>' +
    '<button type="button" class="removeRoomTypeButton">Remove</button>' +
    '</div>' +
    '</div>';
  });
  return html;
}

function roomStatusListTemplate(data) {
  var html = '';
  $.each(data, function(index, item){
    html += '<div class="room-status-list-style">'+
    '<span id="rt-campus" class="paraStyle">' + item.Campus + '</span>' +
    '<span id="rt-tor" class="paraStyle">' + item.TypesOfRooms + '</span>' +
    '<span id="rt-total" class="hide">' + item.Total + '</span>' +
    '<span id="rt-available" class="hide">' + item.Available + '</span>' +
    '<span class="paraStyle">' + (item.Total - item.Available) + '/' +item.Total + '</span>' +
    '<div class="rightAlignment">' +
    // '<button type="button" class="viewRoomStatusButtonButton">View</button>' +
    '</div>' +    
    '</div>';
  });
  return html;
}

var wrapFunc = window.Wrapper;

function removeRoom(e) {
  e.preventDefault();
  var roomId = {
    roomId: $(this).parent().parent().children("#room-id").text()
  }
  ajax({
    url: "/user/room-console",
    method: "DELETE",
    data: JSON.stringify(roomId),
    dataType: 'json',
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateRoomView();
      }
    }
  });
}

function editRoom(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();
  $('#bg-overlay, #edit-room-box').css('display', 'block');
  $('#edit-room-id').val(thisObj.children("#room-id").text());
  $('#current-campus').text(thisObj.children("#room-cp").text());
  $('#current-tor').text(thisObj.children("#room-tp").text());
  $('#current-no').text(thisObj.children("#room-no").text());
  var available = thisObj.children("#room-a").text();
  if (available === 'Available') {
    $('#current-av').text("Yes");
  } else {
    $('#current-av').text("No");
  }
    
}

function updateRoomView() {
  var userData = window.UserData;

  var userState = {
    userCampus: userData.campus,
  };

  ajax({
    url: "/api/view-room-list",
    method: "POST",
    cache: false,
    data: JSON.stringify(userState),
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },    
    success: function(res) {
      if (res.error != null) {
        wrapFunc.ClearContent();
        $('#errMsg').text(res.error);                
      } else {
        roomDataSource = res.data;
        wrapFunc.PaginateRoomContent(roomDataSource);
      }        
      wrapFunc.LoadingSwitch(false);
    }
  });
}

function removeRequest(e) {
  e.preventDefault();
  var requestId = {
    requestId: $(this).parent().parent().children("#request-id").text()
  };
  ajax({
    url: "/user/request-console",
    method: "DELETE",
    data: JSON.stringify(requestId),
    dataType: 'json',
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateRequestView();
      }
    }
  });
}

function approveRequest(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();
  updateRequestStatus("Approved", thisObj);
}

function deniedRequest(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();
  updateRequestStatus("Denied", thisObj);
}

function updateRequestStatus(reqStatus, thisObj) {
  var requestId = {
    requestId: thisObj.children("#request-id").text(),
    status: reqStatus,
    userId: thisObj.children("#request-user-id").text()
  }
  ajax({
    url: "/user/request-console",
    method: "PUT",
    data: JSON.stringify(requestId),
    dataType: 'json',    
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateRequestView();
      }
    }
  });
}

function updateRequestView() {
  var userData = window.UserData;

  var userState = {
    userCampus: userData.campus
  };
  ajax({
    url: "/api/view-request-list",
    method: "POST",
    cache: false,
    data: JSON.stringify(userState),
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      if (res.error != null) {
        wrapFunc.ClearContent();
        $('#errMsg').text(res.error);                
      } else {
        requestDataSource = res.data;
        wrapFunc.PaginateRequestContent(requestDataSource);
      }                
      wrapFunc.LoadingSwitch(false);
    }
  });
}

function viewRequest(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();
  $('#bg-overlay, #view-request-box').css('display', 'block');
  $('#view-user-name').val(thisObj.children("#request-user-name").text());
  $('#view-user-si').val(thisObj.children("#request-user-si").text());
  $('#view-user-gender').val(thisObj.children("#request-user-gender").text());
  $('#view-user-contactno').val(thisObj.children("#request-user-contactno").text());
  $('#view-user-session').val(thisObj.children("#request-ss").text());
  $('#view-rd').val(thisObj.children("#request-rd").text());
  $('#view-tp').val(thisObj.children("#request-tp").text());
  $('#view-s').val(thisObj.children("#request-s").text());
  var dmd = thisObj.children("#request-dmd").text();
  if (dmd === 'January 1st 0001') {
    $('#view-dmd').val("");
  } else {
    $('#view-dmd').val(dmd);
  }
  $('#view-dp').val(thisObj.children("#request-dp").text());
  $('#view-rpp').val(thisObj.children("#request-rpp").text());
  $('#view-py').val(thisObj.children("#request-py").text()); 
}

function SearchRoomQuery() {
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateRoomContent(roomDataSource);
    return;
  }
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchRoomOption
  };
  console.log(roomDataSource);
  var fuse = new Fuse(roomDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateRoomContent(result);
}

function SearchRequestQuery() {
  console.log(requestDataSource);
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateRequestContent(requestDataSource);
    return;
  }
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchRequestOption
  };
  console.log(requestDataSource);
  var fuse = new Fuse(requestDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateRequestContent(result);
}

function SearchBookedQuery() {
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateBookedContent(bookedDataSource);
    return;
  }      
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchBookedOption
  };
  console.log(bookedDataSource);
  var fuse = new Fuse(bookedDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateBookedContent(result);
}

function SearchUserRequestQuery() {
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateUserRequestContent(userRequestDataSource);
    return;
  }
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchUserRequestOption
  };
  console.log(userRequestDataSource);
  var fuse = new Fuse(userRequestDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateUserRequestContent(result);
}

function SearchRoomTypeQuery() {
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateRoomTypeContent(roomTypeDataSource);
    return;
  }
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchRoomTypeOption
  };
  console.log(roomTypeDataSource);
  var fuse = new Fuse(roomTypeDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateRoomTypeContent(result);
}

function SearchUserQuery() {
  console.log(usersDataSource);
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateUsersContent(usersDataSource);
    return;
  }
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchUserOption
  };
  console.log(usersDataSource);
  var fuse = new Fuse(usersDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateUsersContent(result);
}

function SearchAdminQuery() {
  console.log(adminDataSource);
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateAdminContent(adminDataSource);
    return;
  }
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchAdminOption
  };
  console.log(adminDataSource);
  var fuse = new Fuse(adminDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateAdminContent(result);
}

function removeBooked(e) {
  e.preventDefault();

  var bookedId = {
    bookedId: $(this).parent().parent().children("#booked-id").text(),
    bookedRoomId: $(this).parent().parent().children("#booked-room-id").text()
  }
  ajax({
    url: "/user/booked-room-console",
    method: "DELETE",
    data: JSON.stringify(bookedId),
    dataType: 'json',
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateBookedView();
      }
    }
  });
}

function viewBooked(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();
  $('#bg-overlay, #view-booked-box').css('display', 'block');

  $('#view-booked-name').text(thisObj.children("#booked-name").text());
  $('#view-booked-si').text(thisObj.children('#booked-student-id').text());
  $('#view-booked-cp').text(thisObj.children('#booked-cp').text());
  $('#view-booked-rn').text(thisObj.children('#booked-rn').text());
  $('#view-booked-tor').text(thisObj.children('#booked-tor').text());
}

function updateBookedView() {
  var userData = window.UserData;

  var userState = {
    userCampus: userData.campus
  };

  ajax({
    url: "/api/view-booked-list",
    method: "POST",
    cache: false,
    data: JSON.stringify(userState),
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      if (res.error != null) {
        wrapFunc.ClearContent();
        $('#errMsg').text(res.error);                
      } else {
        bookedDataSource = res.data;
        wrapFunc.PaginateBookedContent(bookedDataSource);
      }                
      wrapFunc.LoadingSwitch(false);
    }
  });
}

function removeUser(e) {
  e.preventDefault();
  console.log($(this).parent().parent().children("#u-id").text());
  var userId = {
    userId: $(this).parent().parent().children("#u-id").text(),
  }
  ajax({
    url: "/user/user-console",
    method: "DELETE",
    data: JSON.stringify(userId),
    dataType: 'json',
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateUserView();
      }
    }
  });
}

function editUser(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();
  var gender = thisObj.children("#u-gender").text();
  switch (gender) {
    case 'Male':
      $('input[name=edit-user-gender]')[0].click();
      break;
    case 'Female':
      $('input[name=edit-user-gender]')[1].click();
      break;
    default: break;
  }

  $('#bg-overlay, #edit-user-box').css('display', 'block');
  $('#edit-user-id').val(thisObj.children("#u-id").text());
  $('#edit-user-campus').val(thisObj.children("#u-campus").text());
  $('#edit-user-name').val(thisObj.children("#u-name").text());
  $('#edit-user-email').val(thisObj.children("#u-email").text());
  $('#edit-user-contact-no').val(thisObj.children("#u-cn").text());
  var activated = thisObj.children("#u-activated").text();
  var profiled = thisObj.children("#u-profiled").text();
  if (activated !== 'Activated' &&
      $('#edit-user-activated:checked').length != 0) {
    $('#edit-user-activated').click();
  }
  if (activated === 'Activated' &&
      $('#edit-user-activated:checked').length == 0) {
    $('#edit-user-activated').click();
  }

  if (profiled !== 'Filled' &&
      $('#edit-user-profiled:checked').length != 0) {
    $('#edit-user-profiled').click();
  }
  if (profiled === 'Filled' &&
      $('#edit-user-profiled:checked').length == 0) {
    $('#edit-user-profiled').click();
  }
}

// function viewUser(e) {
//   e.preventDefault();

//   var thisObj = $(this).parent().parent();
//   var gender = thisObj.children("#u-gender").text();
//   $('#bg-overlay, #view-user-box').css('display', 'block');
//   $('#view-user-id').text(thisObj.children("#u-id").text());
//   $('#view-user-avatar').attr('src', thisObj.children("#u-avatar").text());
//   $('#view-user-dj').text(moment(thisObj.children("#u-dj").text()).format('MMMM Do YYYY'));
//   $('#view-user-campus').text(thisObj.children("#u-campus").text());
//   $('#view-user-name').text(thisObj.children("#u-name").text());
//   $('#view-user-email').text(thisObj.children("#u-email").text());
//   $('#view-user-contact-no').text(thisObj.children("#u-cn").text());
//   var activated = thisObj.children("#u-activated").text();
//   var fullPermission = thisObj.children('#u-fullPermission').text();
//   if (activated === 'Activated') {
//     $('#view-user-activated').text("Yes");
//   }
//   $('#view-user-pm').text(fullPermission);
// }

function updateUserView() {
  var userData = window.UserData;

  var userState = {
    userCampus: userData.campus
  };
  ajax({
    url: "/api/view-users-list",
    method: "POST",
    cache: false,
    data: JSON.stringify(userState),
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      if (res.error != null) {
        wrapFunc.ClearContent();
        $('#errMsg').text(res.error);
      } else {
        usersDataSource = res.data;
        wrapFunc.PaginateUsersContent(usersDataSource);
      } 
      wrapFunc.LoadingSwitch(false);
    }
  });
}

function removeAdmin(e) {
  e.preventDefault();
  console.log($(this).parent().parent().children("#a-id").text());
  var userId = {
    userId: $(this).parent().parent().children("#a-id").text(),
  }
  ajax({
    url: "/user/admin-console",
    method: "DELETE",
    data: JSON.stringify(userId),
    dataType: 'json',
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateAdminView();
      }
    }
  });
}

function editAdmin(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();

  $('#bg-overlay, #edit-admin-box').css('display', 'block');
  $('#edit-admin-id').val(thisObj.children("#a-id").text());
  $('#edit-admin-campus').val(thisObj.children("#a-campus").text());
  $('#edit-admin-name').val(thisObj.children("#a-name").text());
  $('#edit-admin-email').val(thisObj.children("#a-email").text());
  $('#edit-admin-contact-no').val(thisObj.children("#a-cn").text());
  var activated = thisObj.children("#a-activated").text();
  var fullPermission = thisObj.children('#a-fullPermission').text();
  if (activated !== 'Activated' &&
      $('#edit-admin-activated:checked').length != 0) {
    $('#edit-admin-activated').click();
  }
  if (activated === 'Activated' &&
      $('#edit-admin-activated:checked').length == 0) {
    $('#edit-admin-activated').click();
  }

  if (fullPermission !== 'Full' &&
      $('#edit-admin-permission:checked').length != 0) {
    $('#edit-admin-permission').click();

  }
  if (fullPermission === 'Full' &&
      $('#edit-admin-permission:checked').length == 0) {
    $('#edit-admin-permission').click();
  }
}

function viewAdmin(e) {
  e.preventDefault();

  var thisObj = $(this).parent().parent();
  $('#bg-overlay, #view-admin-box').css('display', 'block');
  $('#view-admin-id').text(thisObj.children("#a-id").text());
  $('#view-admin-avatar').attr('src', thisObj.children("#a-avatar").text());
  $('#view-admin-campus').text(thisObj.children("#a-campus").text());
  $('#view-admin-name').text(thisObj.children("#a-name").text());
  $('#view-admin-email').text(thisObj.children("#a-email").text());
  $('#view-admin-contact-no').text(thisObj.children("#a-cn").text());
  var activated = thisObj.children("#a-activated").text();
  var fullPermission = thisObj.children('#a-fullPermission').text();
  if (activated === 'Activated') {
    $('#view-admin-activated').text("Yes");
  }
  $('#view-admin-pm').text(fullPermission);
}

function updateAdminView() {
  ajax({
    url: "/api/view-admin-list",
    method: "POST",
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      if (res.error != null) {
        wrapFunc.ClearContent();
        $('#errMsg').text(res.error);
      } else {
        adminDataSource = res.data;
        wrapFunc.PaginateAdminContent(adminDataSource);
      } 
      wrapFunc.LoadingSwitch(false);
    }
  });
}

function madePayment(e) {
  e.preventDefault();
  var thisObj = $(this).parent().parent();
  var nap = thisObj.children('#request-nap').text();
  if (parseFloat(nap) > 0) {
    $('.tableWrapperPay').removeClass('hide');
  } else {
    $('#clear-tr').removeClass('hide');
    $('.tableWrapperNap').parent().addClass('block-center');
  }
  $('#bg-overlay, #payment-box').css('display', 'block');
  $('#req-id').val(thisObj.children('#request-id').text());
  $('#usr-id').val(thisObj.children('#request-user-id').text());
  $('#payment-dp').text(thisObj.children('#request-dp').text());
  $('#payment-rpp').text(thisObj.children('#request-rpp').text());
  $('#payment-amount').text(thisObj.children('#request-py').text());
  $('#user-balance').text(thisObj.children('#request-user-balance').text());
  $('#net-amount-payable').text(nap);
}

function cancelRequest(e) {
  e.preventDefault();
  var userData = window.UserData;
  var userState = {
    requestId: $(this).parent().parent().children("#request-id").text(),
    balance: $(this).parent().parent().children("#request-user-balance").text(),
    userId: userData.id,
    status: "Cancelled"
  };

  ajax({
    url: "/user/request",
    method: "PUT",
    cache: false,
    data: JSON.stringify(userState),
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateUserReuqest();
      }
    }
  });
}

function updateUserReuqest() {
  var userData = window.UserData;

  var userState = {
    userId: userData.id
  };
  ajax({
    url: "/api/user-request-list",
    method: "POST",
    cache: false,
    data: JSON.stringify(userState),
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      if (res.error != null) {
        wrapFunc.ClearContent();
        $('#errMsg').text(res.error);
      } else {
        userRequestDataSource = res.data;
        wrapFunc.PaginateUserRequestContent(userRequestDataSource);
      } 
      wrapFunc.LoadingSwitch(false);
    }
  });
}

function editRoomType(e) {
  e.preventDefault();

  var thisObj = $(this).parent().parent();

  $('#bg-overlay, #edit-room-type-box').css('display', 'block');
  $('#edit-id').val(thisObj.children("#rt-id").text());
  $('#edit-camp').val(thisObj.children("#rt-campus").text());
  $('#edit-tor').val(thisObj.children("#rt-tor").text());
  $('#edit-dp').val(thisObj.children("#rt-dp").text());
  $('#edit-rpp').val(thisObj.children("#rt-rpp").text());
  var twin = thisObj.children("#rt-twin").text();
  var gender = thisObj.children("#rt-gender").text();
  if (twin !== 'Twin' &&
      $('#rt-twin:checked').length != 0) {
    $('#rt-twin').click();

  }
  if (twin === 'Twin' &&
      $('#rt-twin:checked').length == 0) {
    $('#rt-twin').click();
  }
  switch (gender) {
    case 'Male':
      $('input[name=edit-gender]')[0].click();
      break;
    case 'Female':
      $('input[name=edit-gender]')[1].click();
      break;
    default: break;
  }
}

function removeRoomType(e) {
  e.preventDefault();

  var roomTypeState = {
    roomTypeId: $(this).parent().parent().children("#rt-id").text(),
  }
  ajax({
    url: "/user/room-type-console",
    method: "DELETE",
    data: JSON.stringify(roomTypeState),
    dataType: 'json',
    cache: false,
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      wrapFunc.LoadingSwitch(false);
      if (res.length != 0) {
        wrapFunc.AlertStatus(
          'Oops...',
          res,
          'error',
          false,
          false
        );
      } else {
        updateRoomTypeRequest();
      }
    }
  });
}

function updateRoomTypeRequest() {
  var userData = window.UserData;

  var userState = {
    userCampus: userData.campus
  };
  ajax({
    url: "/api/view-room-type-list",
    method: "POST",
    cache: false,
    data: JSON.stringify(userState),
    beforeSend: function() {
      wrapFunc.LoadingSwitch(true);
    },
    success: function(res) {
      if (res.error != null) {
        wrapFunc.ClearContent();
        $('#errMsg').text(res.error);
      } else {
        roomTypeDataSource = res.data;
        wrapFunc.PaginateRoomTypeContent(roomTypeDataSource);
      } 
      wrapFunc.LoadingSwitch(false);
    }
  });
}

function SearchRoomStatusRequestQuery() {
  console.log(roomStatusDataSource);
  var query = $('#search-box').val();
  console.log(query.length);
  if (query.length == 0) {
    wrapFunc.PaginateRoomStatusContent(roomStatusDataSource);
    return;
  }
  var options = {
    caseSensitive: false,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    keys: searchRoomStatusOption
  };
  console.log(roomStatusDataSource);
  var fuse = new Fuse(roomStatusDataSource, options);
  var result = fuse.search(query);
  console.log(result);
  wrapFunc.PaginateRoomStatusContent(result);
}
