function onContactsReadyCallback() {
  var active_contacts_list = $('#active-contact-list');
  for (var i in STATE.contacts) {
    var contact = STATE.contacts[i];
    var item = '<li class="active-contact">';
    //if (contact.profile && contact.profile.picture)
    //  item += '<img src=" + data[contacts].profile.picture "/>';
    //else
    //  item += '<img src=https://gravatar.com/avatar/?s=60&d=retro class="avatar-large-img"/>';
    item += '<a>';
    item += contact.email;
    item += '</a>';//<span class="existing-list-date list-date"> </span></li>';
    active_contacts_list.append(item)
  }
}

$('#active-contact-list').on('click', '.active-contact', function() {
    var li = $(this);
    var lu = li.parent();
    var sc = $('.selected-active-contact');
    var t = li.text();
    sc.text(li.text());
    STATE.selectedContact = STATE.contacts[li.text()];
});

