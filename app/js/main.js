$( document ).ready(function() {
  initModalBtns($(".js-modal__open"), $(".js-modal__close"), $(".js-modal__remove"));
});

function initModalBtns(btnOpen, btnClose, btnRemove) {
  var modal = $("." + btnOpen.data("target"));

  btnOpen.on("mousedown", function() {
    setTimeout(function() { toggleModal(modal, false) }, 300);
  });

  modal.on("click", function(e) {
    var target = $(e.target);

    if (!target.closest(".modal__container").length || target.hasClass("js-modal__close")) {
      toggleModal(modal, false);
    } else if (target.hasClass("js-modal__remove")) {
      toggleModal(modal, true);
    }
  });
}

function toggleModal(modal, removeModal) {
  if (removeModal) {
    $.when( modal.remove() ).then(function(){ 
      alert("DONE"); 
    });
  } else modal.toggleClass("active");
}

