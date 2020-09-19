!(function ($) {
  "use strict";

  // Preloader
  $(window).on("load", function () {
    if ($("#preloader").length) {
      $("#preloader")
        .delay(100)
        .fadeOut("slow", function () {
          $(this).remove();
        });
    }
  });

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on("click", ".nav-menu a, .scrollto", function (e) {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      if (target.length) {
        e.preventDefault();

        var scrollto = target.offset().top;

        $("html, body").animate(
          {
            scrollTop: scrollto,
          },
          1500,
          "easeInOutExpo"
        );

        if ($(this).parents(".nav-menu, .mobile-nav").length) {
          $(".nav-menu .active, .mobile-nav .active").removeClass("active");
          $(this).closest("li").addClass("active");
        }

        if ($("body").hasClass("mobile-nav-active")) {
          $("body").removeClass("mobile-nav-active");
          $(".mobile-nav-toggle i").toggleClass(
            "icofont-navigation-menu icofont-close"
          );
        }
        return false;
      }
    }
  });

  $(document).ready(function () {
    //form radio function
    $('input[type="radio"]').click(function () {
      if ($(this).attr("id") == "stockist-ya") {
        $("#verify-stockist-vendor").show();
        $("#form-umum").hide();
        $("#rekening").hide();
      } else if ($(this).attr("id") == "stockist-tidak") {
        $("#verify-stockist-vendor").hide();
        $("#form-umum").show();
        $("#rekening").show();
      }
    });

    //show eIDR balance
    async function showTronBalance() {
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        const userAddress = window.tronWeb.defaultAddress.base58;
        let tokenBalancesArray;
        let balanceCheck = await tronWeb.trx
          .getAccount(userAddress)
          .then((result) => (tokenBalancesArray = result.assetV2));
        balanceCheck;
        let eIDRexist = await tokenBalancesArray.some(function (tokenID) {
          return tokenID.key == "1002652";
        });
        if (eIDRexist) {
          let eIDRarray = await tokenBalancesArray.find(function (tokenID) {
            return tokenID.key == "1002652";
          });
          $("#saldo-eidr").html(
            `<small>Saldo eIDR anda:</small> <h5 class="text-success">` +
              eIDRarray.value / 100 +
              ` eIDR</h5>`
          );
        } else {
          $("#saldo-eidr").html(`<h5>Alamat TRON ini tidak memiliki eIDR</h5>`);
        }
      }
    }

    setTimeout(() => showTronBalance(), 2000);

    //submit finalForm to Google Sheet
    const scriptURL =
      "https://script.google.com/macros/s/AKfycbyJ2AdqoEPcGT_7DP_w8niZ23DX2FlJnZsG8x3sXBZf8Lgp9w-s/exec";
    const form = document.forms["submit-to-db"];

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      fetch(scriptURL, { method: "POST", body: new FormData(form) })
        .then((response) => console.log("Success!", response))
        .catch((error) => console.error("Error!", error.message));
    });

    // Activate smooth scroll on page load with hash links in the url
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top;
        $("html, body").animate(
          {
            scrollTop: scrollto,
          },
          1500,
          "easeInOutExpo"
        );
      }
    }
  });

  //mobile nav button
  $(document).on("click", ".mobile-nav-toggle", function (e) {
    $("body").toggleClass("mobile-nav-active");
    $(".mobile-nav-toggle i").toggleClass(
      "icofont-navigation-menu icofont-close"
    );
  });

  $(document).click(function (e) {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($("body").hasClass("mobile-nav-active")) {
        $("body").removeClass("mobile-nav-active");
        $(".mobile-nav-toggle i").toggleClass(
          "icofont-navigation-menu icofont-close"
        );
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $("section");
  var main_nav = $(".nav-menu, #mobile-nav");

  $(window).on("scroll", function () {
    var cur_pos = $(this).scrollTop() + 300;

    nav_sections.each(function () {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find("li").removeClass("active");
        }
        main_nav
          .find('a[href="#' + $(this).attr("id") + '"]')
          .parent("li")
          .addClass("active");
      }
      if (cur_pos < 200) {
        $(".nav-menu ul:first li:first").addClass("active");
      }
    });
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });

  $(".back-to-top").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      1500,
      "easeInOutExpo"
    );
    return false;
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }

  // Onload
  $(window).on("load", function () {
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
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3000);
}

//AJAX search HASH//
function searchHash(hash, nominalRedeem) {
  $("#verification-status").html("");

  $.ajax({
    url: "https://apilist.tronscan.org/api/transaction-info",
    type: "get",
    dataType: "json",
    data: {
      hash: hash,
    },
    success: function (result) {
      let transaksi = result.contractData;
      let nominalTransaksi = transaksi.amount / 100;

      if (
        transaksi.asset_name == "1002652" &&
        nominalTransaksi == nominalRedeem &&
        result.toAddress == "TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy"
      ) {
        $("#verification-status").html(`
                    <p class="text-success">Transaksi telah diverifikasi</p>
                
                `);
        setTimeout(function () {
          $("#finalSubmit").show();
          $("#submitButton").prop("disabled", false);
        }, 400);
      } else {
        $("#verification-status").html(`
                    <p class="text-danger">Ada yang salah! Periksa Nominal dan HASH anda!</p>
                
                `);
        $("#submitButton").prop("disabled", true);
        $("#finalSubmit").hide();
      }
    },
  });
}

//AJAX call Telegram API bots for notif
const tgAk = config.TG_AK;
function sendTelegramNotif() {
  let telegramMessage =
    `
        Seseorang telah Redeem eIDR!
        Nama: *` +
    $("#username").val() +
    $("#nama").val() +
    `*
        Jumlah: *Rp. ` +
    $("#nominal-redeem").val() +
    `*
        Hash: [` +
    $("#verification-input").val() +
    `](https://tronscan.org/#/transaction/` +
    $("#verification-input").val() +
    `)
        `;

  $.ajax({
    url: "https://api.telegram.org/bot" + tgAk + "/sendMessage",
    type: "get",
    dataType: "json",
    data: {
      chat_id: "365874331",
      text: telegramMessage,
      parse_mode: "markdown",
    },
  });
}

//populate final form function
function populateFinalForm(hash) {
  $("#finalForm").html(
    `
            <div class="row">
                <div class="col">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" name="username" value="` +
      $("#username").val() +
      `" readonly>
                    <small class="form-text text-muted">Username hanya diperlukan apabila Anda adalah Stockist/Vendor.</small>
                </div>
                <div class="col">
                    <label for="nominal">Nominal</label>
                    <input type="text" class="form-control" name="nominal" value="` +
      $("#nominal-redeem").val() +
      `" readonly>
                </div>
            </div><br>
            <div class="row">
                <div class="col">
                    
                    <label for="nama">Nama</label>
                    <input type="text" class="form-control" name="nama" value="` +
      $("#nama").val() +
      `" readonly><br>
                    <label for="contact">Contact</label>
                    <input type="text" class="form-control" name="contact" value="` +
      $("#contact").val() +
      `" readonly>
                </div>
                <div class="col">
                    
                    <label for="bank">Bank</label>
                    <input type="text" class="form-control" name="bank" value="` +
      $("#bank").val() +
      `" readonly><br>
                    <label for="noRek">No Rekening</label>
                    <input type="text" class="form-control" name="noRek" value="` +
      $("#noRek").val() +
      `" readonly>
                </div>
            </div><br>
            <small>Stokis/Vendor tidak perlu mengisi data Rekening Bank</small><br><br>
            
            
            <label for="hash">Transaction HASH</label>
            <input type="text" class="form-control" name="hash" value="` +
      hash +
      `" readonly>
            
        `
  );
}

//verify and run populate final form function
function verify() {
  searchHash($("#verification-input").val(), $("#nominal-redeem").val());
  populateFinalForm($("#verification-input").val());
}

//monitor and clean HASH input
$("#verification-input").change(async function () {
  $("#verification-status").html(`
         <p class="text-warning">Sedang memproses...</p>
    `);

  //clean the Tronscan baseURL from copied Hash
  if ($("#verification-input").val().includes("tronscan")) {
    let hashOnly = $("#verification-input").val().split("/")[5];
    $("#verification-input").val(hashOnly);
  }
});

//Verify Button Function
$("#verification-button").on("click", async function () {
  let found;
  //check HASH length
  if ($("#verification-input").val().length == 64) {
    //check redeemed hash from Google Sheet db
    await $.ajax({
      url:
        "https://spreadsheets.google.com/feeds/list/1SFTGurB6jjGKgy2RAF5-eN9wIkTSceCh-ouKsR9pBZI/1/public/full?alt=json",
      type: "get",
      dataType: "json",
      data: "",
      success: function (result) {
        let data = result.feed.entry;
        found = data.some(
          (el) => el.gsx$hash.$t === $("#verification-input").val()
        );
      },
    });

    if (!found) {
      verify();
    } else {
      $("#verification-status").html(`
                <p class="text-danger">ERROR! Hash SUDAH PERNAH di Reedem.</p>
            `);
      $("#submitButton").prop("disabled", true);
      $("#finalSubmit").hide();
    }
  } else {
    $("#verification-input").val("");
    $("#verification-status").html(`
            <p class="text-danger">ERROR! Periksa kembali Hash yang anda masukkan.</p>
        `);
  }
});

//Nominal Redeem Validator
$("#nominal-redeem").keyup(function () {
  if ($("#nominal-redeem").val() < 10000) {
    $("#errorMsg").show();
    $("#prosedur-burning").hide();
    $("#verifikasi-hash").hide();
    $("#submitButton").prop("disabled", true);
    $("#tronweb-enabled").hide();
  } else {
    $("#errorMsg").hide();
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      $("#tronweb-enabled").show();
    } else {
      $("#prosedur-burning").show();
      $("#verifikasi-hash").show();
    }
  }
});

//Burning by TronWeb service
$("#burning-button").click(async function () {
  const userAddress = tronWeb.defaultAddress.base58;
  const toAddress = "TLsV52sRDL79HXGGm9yzwKibb6BeruhUzy";
  let sendAmount = $("#nominal-redeem").val() * 100;
  var tronweb = window.tronWeb;
  try {
    var tx = await tronweb.transactionBuilder.sendAsset(
      toAddress,
      sendAmount,
      "1002652",
      userAddress
    );
    var signedTx = await tronweb.trx.sign(tx);
    var broastTx = await tronweb.trx.sendRawTransaction(signedTx);
    if (broastTx.result) {
      alert("Transaksi Berhasil, Silakan Klik Redeem di bawah!");
      console.log(broastTx.txid);
      populateFinalForm(broastTx.txid);
      $("#finalSubmit").show();
      $("#submitButton").prop("disabled", false);
      $("#tronweb-enabled").hide();
    } else {
      alert("Transaksi Gagal! Cek kembali koneksi anda lalu ulangi");
    }
  } catch (e) {
    if (e.includes("assetBalance is not sufficient")) {
      alert("Saldo eIDR tidak mencukupi");
    } else if (e.includes("assetBalance must be greater than")) {
      alert("Alamat TRON ini tidak memiliki eIDR");
    } else {
      console.log(e);
    }
  }
});

//Opsi Manual Transfer
$("#manual-transfer").on("click", function () {
  $("#prosedur-burning").show();
  $("#verifikasi-hash").show();
  $("#tronweb-enabled").hide();
});

// Send Telegram Bot Notif on Submit
$("#submitButton").on("click", function () {
  $("#submitButton").hide();
  $(".modal-body").html(`
        <p>Pengajuan Redeem eIDR anda telah berhasil. <br>
        Anda akan menerima Rupiah tersebut di Rekening/Dompet Digital anda dalam 24 jam ke depan (Max. 48 jam di luar hari kerja).</p>
    `);
  sendTelegramNotif();
  setTimeout(() => window.location.replace("explorer.html"), 10000);
});
