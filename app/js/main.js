$( document ).ready(function() {
  initShowModalBtn($(".js-btn__modal"));
});

function initShowModalBtn(button) {
  button.on("click", function() {
    console.log(111);
  });
}
