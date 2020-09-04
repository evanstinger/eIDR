// thousand separators
function thousands_separators(num) {
  var num_parts = num.toString().split(".");
  num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return num_parts.join(".");
}

!(function($) {
  "use strict";

  // Preloader
  $(window).on('load', function() {
    if ($('#preloader').length) {
      $('#preloader').delay(100).fadeOut('slow', function() {
        $(this).remove();
      });
    }
  });

  // Hero typed
  if ($('.typed').length) {
    var typed_strings = $(".typed").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on('click', '.nav-menu a, .scrollto', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top;

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        }
        return false;
      }
    }
  });

  
  $(document).ready(function() {

    var tokenInfo;
    let minted;
    let transactions;
    let holders;
    let burnedSupply;
    let burned;
    let circulating;

    //calling eIDR TRC10 information
    function callTokenInfo() {

      $.ajax({
  
        url: 'https://apilist.tronscan.org/api/token',
        type: 'get',
        dataType: 'json',
        data: {
          'id': '1002652'
        },
        success: function (result) {
          //push ajax call result to global var
          tokenInfo = result.data[0];
          // callback function to push result after ajax success
          useTokenInfo();
  
        }
      });
    }


    //calling burnedSupply
    function callBurnedSupply() {

      $.ajax({
  
        url: 'https://apilist.tronscan.org/api/account',
        type: 'get',
        dataType: 'json',
        data: {
          'address': 'TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy'
        },
        success: function (result) {
          //push result to global var
          burnedSupply = result.balances[617].balance / 100;
          // callback
          useBurnedSupply();
        }
  
      });
    }

    function useTokenInfo() {
      //set mintedSupply
      minted = tokenInfo.issued / 100;
      
      //set transactions
      transactions = tokenInfo.totalTransactions;
      
      //set Holders
      holders = tokenInfo.nrOfTokenHolders;
      
    }

    function useBurnedSupply() {
      //set burned
      burned = burnedSupply;

    }

    //use global vars to populare numbers
    function populateCounters() {
      circulating = minted - burned;
      $('#minted').html(thousands_separators(minted));
      $('#transactions').html(thousands_separators(transactions));
      $('#holders').html(thousands_separators(holders));
      $('#burned').html(thousands_separators(burned));
      $('#circulating').html(thousands_separators(circulating.toFixed(2)));
    }

    function runCounters() {
      callTokenInfo();
      callBurnedSupply();
      setTimeout(() => { populateCounters();},2500)

    }

    //execute counters chain
    runCounters();
 
    //calling latestTransactions
    $.ajax({

      url: 'https://apilist.tronscan.org/api/asset/transfer',
      type: 'get',
      dataType: 'json',
      data: {
        'limit': '5',
        'start': '0',
        'name': 'eIDR',
        'issueAddress': 'TPz5uVytAaUup9vTydcqscyj3kqSeekKvn'
      },
      success: function (result) {

        let txs = result.Data;

        $.each(txs, function (i, data) {
          let waktu = formatTime(data.timestamp);

          $('#transactionList').append(`
            <a data-alias="`+ data.transactionHash +`" class="list-group-item list-group-item-action" data-toggle="modal" data-target="#searchModal">
              <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">`+ thousands_separators(data.amount / 100) + ` eIDR</h5>
                <small class="timeago">`+ waktu + `</small>
              </div>
              <p class="mb-1">
              Dari: `+ data.transferFromAddress + `<br>
              Ke: `+ data.transferToAddress + ` <br>
              </p>
              <small class="text-break">HASH: `+ data.transactionHash + `</small>
            </a>


          `);

        });
      }

    });

    //using alias to get transaction detail from list-group
    $("#transactionList").on("click", "a", function (event) {
      event.preventDefault();
      searchHash($(this).data('alias'));
    });

    

    // Activate smooth scroll on page load with hash links in the url
    
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  $(document).on('click', '.mobile-nav-toggle', function(e) {
    $('body').toggleClass('mobile-nav-active');
    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
  });

  $(document).click(function(e) {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($('body').hasClass('mobile-nav-active')) {
        $('body').removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, #mobile-nav');

  $(window).on('scroll', function() {
    var cur_pos = $(this).scrollTop() + 300;

    nav_sections.each(function() {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 200) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true
    });
  }

  // Onload
  $(window).on('load', function() {

    // Initiate aos_init() function
    aos_init();

  });


})(jQuery);

// copy button at donate address
document.getElementById("copy-btn").addEventListener("click", copy_address);

function copy_address() {
  var copyText = document.getElementById("donateAddress");
  var textArea = document.createElement("textarea");
  textArea.value = copyText.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("Copy");
  textArea.remove();

  var x = document.getElementById("snackbar");

  // Add the "show" class to Snackbar DIV
  x.className = "show";

  // After 3 seconds, remove the show class from Snackbar DIV
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}


  //AJAX search Address//
  function searchAddress() {

    $('.modal-body').html('');
    $('#modal-title').text($('#search-input').val());
    let eIDRbalance = 0;
    let LMBbalance = 0;

    $.ajax({
      url: 'https://apilist.tronscan.org/api/account',
      type: 'get',
      dataType: 'json',
      data: {
        'address': $('#search-input').val()
      },
      success: function (result) {
        // get date created
        let dateCreated = new Date(result.date_created);

        // get transaction counts
        let transactionCounts = result.totalTransactionCount;

        let tokenBalancesArray = result.tokenBalances;

        //check if eIDR exist
        let eIDRexist = tokenBalancesArray.some(function(tokenID){
          return tokenID.name == '1002652';
        })

        if (eIDRexist) {
          // get eIDR Balance
          let eIDRarray = tokenBalancesArray.find(function (tokenID) {
            return tokenID.name == '1002652';
          })
          eIDRbalance = eIDRarray.balance / 100 + ' eIDR';
        }

        //check if LMB exist
        let LMBexist = tokenBalancesArray.some(function (tokenID) {
          return tokenID.name == '1002640';
        })

        if (LMBexist) {
          // get LMB Balance
          let LMBarray = tokenBalancesArray.find(function (tokenID) {
            return tokenID.name == '1002640';
          })
          LMBbalance = LMBarray.balance / 1000000 + ' LMB';
        }

        
        
        
        //put all of those above into modal box
        $('.modal-body').html(`
        
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Saldo eIDR: <strong>`+ thousands_separators(eIDRbalance) +`</strong></li>
            <li class="list-group-item">Saldo LMB: <strong>`+ thousands_separators(LMBbalance) +`</strong></li>
            <li class="list-group-item">Total Transaksi: `+ transactionCounts +` kali</li>
            <li class="list-group-item">Dibuat sejak: <small>`+ dateCreated +`</small></li>
          </ul>
        `)
      },
    });

    $('#search-input').val('');

  }

//AJAX search HASH//
function searchHash(hash) {

  $('.modal-body').html('');
  $('#modal-title').html(`<h4>Detail Transaksi</h4>`);
  let nominal = '';
  let token = '';

  $.ajax({
    url: 'https://apilist.tronscan.org/api/transaction-info',
    type: 'get',
    dataType: 'json',
    data: {
      'hash': hash
    },
    success: function (result) {
      let tipeTransaksi = result.contractData;
      let waktu = new Date(result.timestamp);
      if (tipeTransaksi.asset_name == "1002652") {
        nominal = tipeTransaksi.amount / 100;
        token = ' eIDR';
      } else if (tipeTransaksi.asset_name == "1002640") {
        nominal = tipeTransaksi.amount / 1000000;
        token = ' LMB';
      }else {
        nominal = tipeTransaksi.amount;
        token = tipeTransaksi.asset_name;
      }
      
      //put all of those above into modal box
      $('.modal-body').html(`
        
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Pengirim: <strong>`+ result.ownerAddress + `</strong></li>
            <li class="list-group-item">Penerima: <strong>`+ result.toAddress + `</strong></li>
            <li class="list-group-item">Nominal Transfer: <strong>`+ thousands_separators(nominal) + token + `</strong> </li>
            <li class="list-group-item">Waktu Transaksi: `+ waktu + ` </li>
            <li class="list-group-item">Status Konfirmasi: `+ result.confirmed + `</li>
            <li class="list-group-item">Keterangan: `+ result.data + `</li>
            <li class="list-group-item text-break">Hash: `+ hash + `</li>
          </ul>
        `)
    },
  });

  $('#search-input').val('');

}
  
//Search Button Function
$('#search-button').on('click', function(){
  //Check if input === Address
  if ($('#search-input').val().length == 34) {
    searchAddress();
  } else if ($('#search-input').val().length == 64) {
    searchHash($('#search-input').val());
  } else {
    $('#search-input').val('');
    $('#modal-title').text('Ada yang salah, nih!')
    $('.modal-body').html(`
      <p>Periksa kembali alamat atau Hash yang anda masukkan.</p>
    `);
  }
  
});

$('#search-input').change(function(){
  
  if ($('#search-input').val().includes('tronscan')) {
    let hashOnly = $('#search-input').val().split('/')[5];
    $('#search-input').val(hashOnly);
  }
})




// timeago
var periods = {
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000
};

function formatTime(timeCreated) {
  var diff = Date.now() - timeCreated;

  if (diff > periods.month) {
    // it was at least a month ago
    return Math.floor(diff / periods.month) + " bulan yang lalu";
  } else if (diff > periods.week) {
    return Math.floor(diff / periods.week) + " minggu yang lalu";
  } else if (diff > periods.day) {
    return Math.floor(diff / periods.day) + " hari yang lalu";
  } else if (diff > periods.hour) {
    return Math.floor(diff / periods.hour) + " jam yang lalu";
  } else if (diff > periods.minute) {
    return Math.floor(diff / periods.minute) + " menit yang lalu";
  }
  return "Baru saja";
}
