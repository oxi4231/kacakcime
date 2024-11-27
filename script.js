document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('#stream-menu button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const streamPage = button.getAttribute('data-stream');
      window.location.href = streamPage;
    });
  });
});
