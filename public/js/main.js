//function addContact() {
STATE = {
  contacts:  [],
  initialized: false,
};

$(document).ready(function() {

  refreshContacts = function() {
    $.ajax({
       method: "GET",
       url: "/usercontacts",
       data: {'action': 'get'},
       success: function(data) {
         var existing_users_list = $(".existing-users-list");
         existing_users_list.empty();
         STATE.contacts = [];
         for (var i in data) {
             var contact = data[i];
             var item = '<li>';//' id=' + contact._id + '>';
             if (contact.profile && contact.profile.picture)
               item += '<img src=" + data[contacts].profile.picture "/>';
             else
               item += '<img src=https://gravatar.com/avatar/?s=60&d=retro class="avatar-large-img"/>';
             item += '<a href="#" class="users-list-name existing-users-list-name">'
             item += contact.email;
             item += '</a><span class="existing-list-date list-date"> joined: ';
             item += contact.createdAt.substr(0, contact.createdAt.indexOf('T'));
             item += '<button data-id="' + contact._id + '" class="btn bg-red btn-block btn-remove-contact">-</button>';
             item += '</span></li>';

             STATE.contacts.push(contact);
             existing_users_list.append(item);
         }
         onContactsReadyCallback();

       },
       error: function(err) {
            console.log('error: ', err);

       }
    });
  }

  $('.users-list').on('click', '.btn-add-contact', function (){
  //$('button.btn.btn-success.btn-block.btn-add-contact').on('click', function() {
     var csrf = $('input[name=_csrf]')[0].value;
     var addBtn = $(this);
     var userBlk = addBtn.parent().parent();
     var userId = addBtn.attr('data-id');
     $.ajax({
        method: "POST",
        url: "/usercontacts",
        data: {'action': 'add',
               'userId': userId,
               '_csrf': csrf},
        success: function(result) {
          refreshContacts();
          userBlk.remove();
        }
     });
  });

  $('.users-list').on('click', '.btn-remove-contact', function (){
     var csrf = $('input[name=_csrf]')[0].value;
     var removeBtn = $(this);
     var userBlk = removeBtn.parent().parent();
     var userId = removeBtn.attr('data-id');
     $.ajax({
        method: "POST",
        url: "/usercontacts",
        data: {'action': 'remove',
               'userId': userId,
               '_csrf': csrf},
        success: function(result) {
          refreshContacts();
          userBlk.remove();
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
            var search_users_list = $(".search-users-list");
            search_users_list.empty();
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
                item += '<button data-id="' + contact._id + '" class="btn btn-success btn-block btn-add-contact">+</button>';
                item += '</span></li>';

                search_users_list.append(item);
            }
          },
          error: function(err) {
             console.log('error: ', err);
          }
          });
  });


  main = function() {
    console.log("AAA: ", notAuthenticated);
    if(notAuthenticated == false && STATE.initialized == false) {
      refreshContacts();
      STATE.initialized = true;
    }
  };

  main();

});
