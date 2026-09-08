// Quick action button clicks — placeholder behavior for now
document.querySelectorAll('.actions-row .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    console.log(`Quick action clicked: ${btn.textContent}`);
  });
});