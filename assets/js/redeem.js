
!(function ($) {
    "use strict";

    // Preloader
    $(window).on('load', function () {
        if ($('#preloader').length) {
            $('#preloader').delay(100).fadeOut('slow', function () {
                $(this).remove();
            });
        }
    });


    // Smooth scroll for the navigation menu and links with .scrollto classes
    $(document).on('click', '.nav-menu a, .scrollto', function (e) {
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


    $(document).ready(function () {

        //form function
        $('input[type="radio"]').click(function () {
            if ($(this).attr('id') == 'stockist-ya') {
                $('#verify-stockist-vendor').show();
                $('#form-umum').hide();
                $('#rekening').hide();
            }
            else if ($(this).attr('id') == 'stockist-tidak') {
                $('#verify-stockist-vendor').hide();
                $('#form-umum').show();
                $('#rekening').show();
            }
        });

        const scriptURL = 'https://script.google.com/macros/s/AKfycbyJ2AdqoEPcGT_7DP_w8niZ23DX2FlJnZsG8x3sXBZf8Lgp9w-s/exec'
        const form = document.forms['submit-to-db']

        form.addEventListener('submit', e => {
            e.preventDefault()
            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then(response => console.log('Success!', response))
                .catch(error => console.error('Error!', error.message))
        })

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

    $(document).on('click', '.mobile-nav-toggle', function (e) {
        $('body').toggleClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
    });

    $(document).click(function (e) {
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

    $(window).on('scroll', function () {
        var cur_pos = $(this).scrollTop() + 300;

        nav_sections.each(function () {
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
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

    // Init AOS
    function aos_init() {
        AOS.init({
            duration: 1000,
            once: true
        });
    }

    // Onload
    $(window).on('load', function () {

        // Initiate aos_init() function
        aos_init();

    });


})(jQuery);

// copy button at burning address
document.getElementById("copy-btn").addEventListener("click", copy_address);

function copy_address() {
    var copyText = document.getElementById("burningAddress");
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

//AJAX search HASH//
function searchHash(hash, nominalRedeem) {

    $('#verification-status').html('');

    $.ajax({
        url: 'https://apilist.tronscan.org/api/transaction-info',
        type: 'get',
        dataType: 'json',
        data: {
            'hash': hash
        },
        success: function (result) {
            let transaksi = result.contractData;
            let nominalTransaksi = transaksi.amount / 100;
            //get current timestamp
            let today = new Date();
            let oneDayPeriodLimit = today.getTime() - 86400000;
            
            if (transaksi.asset_name == "1002652" && nominalTransaksi == nominalRedeem && result.toAddress == "TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy" && Number(result.timestamp) > Number(oneDayPeriodLimit) ) {
                $('#verification-status').html(`
                    <p class="text-success">Transaksi telah diverifikasi</p>
                
                `);
            } else {
                $('#verification-status').html(`
                    <p class="text-danger">HASH yang anda masukkan salah atau telah di Redeem</p>
                
                `);
            }

           
        },
    });

    

}

//Search Button Function
$('#verification-button').on('click', function () {
    //Check if input === HASH
    if ($('#verification-input').val().length == 64) {
        searchHash($('#verification-input').val(), $('#nominal-redeem').val());
        $('#finalForm').html(`
            <div class="row">
                <div class="col">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" name="username" value="`+ $('#username').val() + `" readonly>
                    <small class="form-text text-muted">Username hanya diperlukan apabila Anda adalah Stockist/Vendor.</small>
                </div>
                <div class="col">
                    <label for="nominal">Nominal</label>
                    <input type="text" class="form-control" name="nominal" value="`+ $('#nominal-redeem').val() + `" readonly>
                </div>
            </div><br>
            <div class="row">
                <div class="col">
                    
                    <label for="nama">Nama</label>
                    <input type="text" class="form-control" name="nama" value="`+ $('#nama').val() + `" readonly><br>
                    <label for="contact">Contact</label>
                    <input type="text" class="form-control" name="contact" value="`+ $('#contact').val() + `" readonly>
                </div>
                <div class="col">
                    
                    <label for="bank">Bank</label>
                    <input type="text" class="form-control" name="bank" value="`+ $('#bank').val() + `" readonly><br>
                    <label for="noRek">No Rekening</label>
                    <input type="text" class="form-control" name="noRek" value="`+ $('#noRek').val() + `" readonly>
                </div>
            </div>
            
            
            <label for="hash">Transaction HASH</label>
            <input type="text" class="form-control" name="hash" value="`+ $('#verification-input').val() + `" readonly>
            
        `);

        setTimeout(function(){
            $('#finalSubmit').removeClass("invisible");
        }, 1200);
        
    } else {
        $('#verification-input').val('');
        $('#verification-status').html(`
      <p>ERROR! Periksa kembali Hash yang anda masukkan.</p>
    `);
    }

});

$('#verification-input').change(function () {

    if ($('#verification-input').val().includes('tronscan')) {
        let hashOnly = $('#verification-input').val().split('/')[5];
        $('#verification-input').val(hashOnly);
    }
})

$('#submitButton').on('click', function(){
    $('.modal-body').html(`
        <p>Pengajuan Redeem eIDR anda telah berhasil. <br>
        Anda akan menerima Rupiah tersebut di Rekening/Dompet Digital anda kurang dari 24 jam ke depan (Max. 48 jam di luar hari kerja).</p>
    `)
});