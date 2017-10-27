$(function () {
  /*
   * Flot Interactive Chart
   * -----------------------
   */
  // We use an inline data source in the example, usually data would
  // be fetched from a server
  var data = [], totalPoints = 100

  function getRandomData() {

    if (data.length > 0)
      data = data.slice(1)

    // Do a random walk
    while (data.length < totalPoints) {

      var prev = data.length > 0 ? data[data.length - 1] : 50,
          y    = prev + Math.random() * 10 - 5

      if (y < 0) {
        y = 0
      } else if (y > 100) {
        y = 100
      }

      data.push(y)
    }

    // Zip the generated y values with the x values
    var res = []
    for (var i = 0; i < data.length; ++i) {
      res.push([i, data[i]])
    }

    return res
  }

  var interactive_plot = $.plot('#interactive', [getRandomData()], {
    grid  : {
      borderColor: '#f3f3f3',
      borderWidth: 1,
      tickColor  : '#f3f3f3'
    },
    series: {
      shadowSize: 0, // Drawing is faster without shadows
      color     : '#3c8dbc'
    },
    lines : {
      fill : true, //Converts the line chart to area chart
      color: '#3c8dbc'
    },
    yaxis : {
      min : 0,
      max : 100,
      show: true
    },
    xaxis : {
      show: true
    }
  })

  var updateInterval = 500 //Fetch data ever x milliseconds
  var realtime       = 'on' //If == to on then fetch data every x seconds. else stop fetching
  function update() {

    interactive_plot.setData([getRandomData()])

    // Since the axes don't change, we don't need to call plot.setupGrid()
    interactive_plot.draw()
    if (realtime === 'on')
      setTimeout(update, updateInterval)
  }

  //INITIALIZE REALTIME DATA FETCHING
  if (realtime === 'on') {
    update()
  }
  //REALTIME TOGGLE
  $('#realtime .btn').click(function () {
    if ($(this).data('toggle') === 'on') {
      realtime = 'on'
    }
    else {
      realtime = 'off'
    }
    update()
  })
  /*
   * END INTERACTIVE CHART
   */

  /*
   * LINE CHART
   * ----------
   */
  //LINE randomly generated data

  var sin = [], cos = []
  for (var i = 0; i < 14; i += 0.5) {
    sin.push([i, 40 + 3*i + 3*Math.sin(2*i)])
    cos.push([i, 35 + 4*i + 2*Math.cos(5*i)])
  }
  var line_data1 = {
    data : sin,
    color: '#3c8dbc'
  }
  var line_data2 = {
    data : cos,
    color: '#00c0ef'
  }
  $.plot('#line-chart', [line_data1, line_data2], {
    grid  : {
      hoverable  : true,
      borderColor: '#f3f3f3',
      borderWidth: 1,
      tickColor  : '#f3f3f3'
    },
    series: {
      shadowSize: 0,
      lines     : {
        show: true
      },
      points    : {
        show: true
      }
    },
    lines : {
      fill : false,
      color: ['#3c8dbc', '#f56954']
    },
    yaxis : {
      show: true
    },
    xaxis : {
      show: true
    }
  })
  //Initialize tooltip on hover
  $('<div class="tooltip-inner" id="line-chart-tooltip"></div>').css({
    position: 'absolute',
    display : 'none',
    opacity : 0.8
  }).appendTo('body')
  $('#line-chart').bind('plothover', function (event, pos, item) {

    if (item) {
      var x = item.datapoint[0].toFixed(2),
          y = item.datapoint[1].toFixed(2)

      $('#line-chart-tooltip').html(item.series.label + ' of ' + x + ' = ' + y)
        .css({ top: item.pageY + 5, left: item.pageX + 5 })
        .fadeIn(200)
    } else {
      $('#line-chart-tooltip').hide()
    }

  })
  /* END LINE CHART */

  /*
   * FULL WIDTH STATIC AREA CHART
   * -----------------
   */
  var areaData = [[2, 88.0], [3, 93.3], [4, 102.0], [5, 108.5], [6, 115.7], [7, 115.6],
    [8, 124.6], [9, 130.3], [10, 134.3], [11, 141.4], [12, 146.5], [13, 151.7], [14, 159.9],
    [15, 165.4], [16, 167.8], [17, 168.7], [18, 169.5], [19, 168.0]]
  $.plot('#area-chart', [areaData], {
    grid  : {
      borderWidth: 0
    },
    series: {
      shadowSize: 0, // Drawing is faster without shadows
      color     : '#00c0ef'
    },
    lines : {
      fill: true //Converts the line chart to area chart
    },
    yaxis : {
      show: false
    },
    xaxis : {
      show: false
    }
  })

  /* END AREA CHART */

  /*
   * BAR CHART
   * ---------
   */

  var bar_data = {
    data : [['January', 10], ['February', 8], ['March', 4], ['April', 13], ['May', 17], ['June', 9]],
    color: '#3c8dbc'
  }
  $.plot('#bar-chart', [bar_data], {
    grid  : {
      borderWidth: 1,
      borderColor: '#f3f3f3',
      tickColor  : '#f3f3f3'
    },
    series: {
      bars: {
        show    : true,
        barWidth: 0.5,
        align   : 'center'
      }
    },
    xaxis : {
      mode      : 'categories',
      tickLength: 0
    }
  })
  /* END BAR CHART */

  /*
   * DONUT CHART
   * -----------
   */

  var donutData = [
    { label: 'Series2', data: 30, color: '#3c8dbc' },
    { label: 'Series3', data: 20, color: '#0073b7' },
    { label: 'Series4', data: 50, color: '#00c0ef' }
  ]
  $.plot('#donut-chart', donutData, {
    series: {
      pie: {
        show       : true,
        radius     : 1,
        innerRadius: 0.5,
        label      : {
          show     : true,
          radius   : 2 / 3,
          formatter: labelFormatter,
          threshold: 0.1
        }

      }
    },
    legend: {
      show: false
    }
  })
  /*
   * END DONUT CHART
   */




     function init_events(ele) {
       ele.each(function () {
         // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
         // it doesn't need to have a start or end
         var eventObject = {
           title: $.trim($(this).text()) // use the element's text as the event title
         }
         // store the Event Object in the DOM element so we can get to it later
         $(this).data('eventObject', eventObject)
         // make the event draggable using jQuery UI
         $(this).draggable({
           zIndex        : 1070,
           revert        : true, // will cause the event to go back to its
           revertDuration: 0  //  original position after the drag
         })
       })
     }
     init_events($('#external-events div.external-event'))
     /* initialize the calendar
     -----------------------------------------------------------------*/
     //Date for the calendar events (dummy data)
     var date = new Date()
     var d    = date.getDate(),
     m    = date.getMonth(),
     y    = date.getFullYear()
     $('#calendar').fullCalendar({
       header    : {
         left  : 'prev,next today',
         center: 'title',
         right : 'month,agendaWeek,agendaDay'
       },
       buttonText: {
         today: 'today',
         month: 'month',
         week : 'week',
         day  : 'day'
       },
       //Random default events
       events    : [
         {
           title          : 'All Day Event',
           start          : new Date(y, m, 1),
           backgroundColor: '#f56954', //red
           borderColor    : '#f56954' //red
         },
         {
           title          : 'Long Event',
           start          : new Date(y, m, d - 5),
           end            : new Date(y, m, d - 2),
           backgroundColor: '#f39c12', //yellow
           borderColor    : '#f39c12' //yellow
         },
         {
           title          : 'Meeting',
           start          : new Date(y, m, d, 10, 30),
           allDay         : false,
           backgroundColor: '#0073b7', //Blue
           borderColor    : '#0073b7' //Blue
         },
         {
           title          : 'Lunch',
           start          : new Date(y, m, d, 12, 0),
           end            : new Date(y, m, d, 14, 0),
           allDay         : false,
           backgroundColor: '#00c0ef', //Info (aqua)
           borderColor    : '#00c0ef' //Info (aqua)
         },
         {
           title          : 'Birthday Party',
           start          : new Date(y, m, d + 1, 19, 0),
           end            : new Date(y, m, d + 1, 22, 30),
           allDay         : false,
           backgroundColor: '#00a65a', //Success (green)
           borderColor    : '#00a65a' //Success (green)
         },
         {
           title          : 'Click for Google',
           start          : new Date(y, m, 28),
           end            : new Date(y, m, 29),
           url            : 'http://google.com/',
           backgroundColor: '#3c8dbc', //Primary (light-blue)
           borderColor    : '#3c8dbc' //Primary (light-blue)
         }
       ],
       editable  : true,
       droppable : true, // this allows things to be dropped onto the calendar !!!
       drop      : function (date, allDay) { // this function is called when something is dropped
         // retrieve the dropped element's stored Event Object
         var originalEventObject = $(this).data('eventObject')
         // we need to copy it, so that multiple events don't have a reference to the same object
         var copiedEventObject = $.extend({}, originalEventObject)
         // assign it the date that was reported
         copiedEventObject.start           = date
         copiedEventObject.allDay          = allDay
         copiedEventObject.backgroundColor = $(this).css('background-color')
         copiedEventObject.borderColor     = $(this).css('border-color')
         // render the event on the calendar
         // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
         $('#calendar').fullCalendar('renderEvent', copiedEventObject, true)
         // is the "remove after drop" checkbox checked?
         if ($('#drop-remove').is(':checked')) {
           // if so, remove the element from the "Draggable Events" list
           $(this).remove()
         }
       }
     })
     /* ADDING EVENTS */
     var currColor = '#3c8dbc' //Red by default
     //Color chooser button
     var colorChooser = $('#color-chooser-btn')
     $('#color-chooser > li > a').click(function (e) {
       e.preventDefault()
       //Save color
       currColor = $(this).css('color')
       //Add color effect to button
       $('#add-new-event').css({ 'background-color': currColor, 'border-color': currColor })
     })
     $('#add-new-event').click(function (e) {
       e.preventDefault()
       //Get value and make sure it is not null
       var val = $('#new-event').val()
       if (val.length == 0) {
         return
       }
       //Create events
       var event = $('<div />')
       event.css({
         'background-color': currColor,
         'border-color'    : currColor,
         'color'           : '#fff'
       }).addClass('external-event')
       event.html(val)
       $('#external-events').prepend(event)
       //Add draggable funtionality
       init_events(event)
       //Remove event from text input
       $('#new-event').val('')
     })

     $('.login-input').blur(function() {
       var $this = $(this);
       if ($this.val())
         $this.addClass('used');
       else
         $this.removeClass('used');
     });


})

/*
 * Custom Label formatter
 * ----------------------
 */
function labelFormatter(label, series) {
  return '<div style="font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 600;">'
    + label
    + '<br>'
    + Math.round(series.percent) + '%</div>'
}

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
});


/*$("#active-contact-list").on("click", ".init", function() {
    $(this).closest("ul").children('li:not(.init)').toggle();
    var a = $(this);
    var b = a.selectedIndex();
});

var allOptions = $("#active-contact-list").children('li:not(.init)');
$("#active-contact-list").on("click", "li:not(.init)", function() {
    allOptions.removeClass('selected');
    $(this).addClass('selected');
    $("#active-contact-list").children('.init').html($(this).html());
    allOptions.toggle();
});
*/
