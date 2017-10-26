//function addContact() {
STATE = {
  contacts:  [],
};

$(document).ready(function() {

  refreshContacts = function() {
    $.ajax({
       method: "GET",
       url: "/usercontacts",
       data: {'action': 'get'},
       success: function(data) {
         $(".existing-users-list").empty();
         STATE.contacts = [];
         for (var i in data) {
             var contact = data[i];
             STATE.contacts.push(contact);
             var item = '<li>';//' id=' + contact._id + '>';
             if (contact.profile && contact.profile.picture)
               item += '<img src=" + data[contacts].profile.picture "/>';
             else
               item += '<img src=https://gravatar.com/avatar/?s=60&d=retro class="avatar-large-img"/>';
             item += '<a href="#" class="users-list-name existing-users-list-name">'
             item += contact.email;
             item += '</a><span class="existing-list-date list-date"> joined: ';
             item += contact.createdAt.substr(0, contact.createdAt.indexOf('T'));
             item += '</span></li>';

             $(".existing-users-list").append(item);
         }
       },
       error: function(err) {
            console.log('error: ', err);

       }
    });
  }

  $('.users-list').on('click', '.btn-add-contact', function (){

  //$('button.btn.btn-success.btn-block.btn-add-contact').on('click', function() {
     var csrf = $('input[name=_csrf]')[0].value;
     var userId = $(this).attr('data-id');
     $.ajax({
        method: "POST",
        url: "/usercontacts",
        data: {'action': 'add',
               'userId': userId,
               '_csrf': csrf},
        success: function(result) {
          refreshContacts();
          $(this).remove();
        }
     });
  });


  $("#search-button").click(function(e){
      e.preventDefault();
      var search_str = $("#search-string").val();
      $.ajax({
          url: "/search",
          type: "GET",
          data: {'type':'user', 'str':search_str},  // request is the value of search input
          success: function (data) {
            $(".search-users-list").empty();
            for (var i in data) {
                var contact = data[i];
                // if the contact is already added...
                if(STATE.contacts.indexOf(contact) >= 0) {
                  continue;
                }
                var item = '<li>';//' id=' + contact._id + '>';
                if (contact.profile && contact.profile.picture)
                  item += '<img src=" + data[contacts].profile.picture "/>';
                else
                  item += '<img src=https://gravatar.com/avatar/?s=60&d=retro class="avatar-large-img"/>';
                item += '<a href="#" class="users-list-name list-name">'
                item += contact.email;
                item += '</a><span class="list-date users-list-date"> joined: ';
                item += contact.createdAt.substr(0, contact.createdAt.indexOf('T'));
                //item += '</p><a href="add-contact?item=' + contact._id + '" class="btn btn-success btn-block">View Item</a></p>' +
                item += '<button data-id="' + contact._id + '" class="btn btn-success btn-block btn-add-contact">add</button>';
                item += '</span></li>';

                $(".search-users-list").append(item);
            }
          },
          error: function(err) {
             console.log('error: ', err);
          }
          });
  });


  main = function() {
    refreshContacts();
  };

  main()



  /*$("#search-member").autocomplete({
      source: function (request, response) {
         $.ajax({
            url: "/search_member",
            type: "GET",
            data: request,  // request is the value of search input
            success: function (data) {
              // Map response values to fiedl label and value
               response($.map(data, function (el) {
                  return {
                     label: el.fullname,
                     value: el._id
                  };
                  }));
               }
            });
         },

         // The minimum number of characters a user must type before a search is performed.
         minLength: 3,

         // set an onFocus event to show the result on input field when result is focused
         focus: function (event, ui) {
            this.value = ui.item.label;
            // Prevent other event from not being execute
            event.preventDefault();
         },
         select: function (event, ui) {
            // Prevent value from being put in the input:
            this.value = ui.item.label;
            // Set the id to the next input hidden field
            $(this).next("input").val(ui.item.value);
            // Prevent other event from not being execute
            event.preventDefault();
            // optionnal: submit the form after field has been filled up
            $('#quicksearch').submit();
         }
  }); */
});
