export default (physics) => {
  document.getElementById('g-change-left').addEventListener('click', () => {
    physics.gravity.x = -7.81;
    physics.gravity.y = 2;
  });

  document.getElementById('g-change-right').addEventListener('click', () => {
    physics.gravity.x = 7.81;
    physics.gravity.y = 2;
  });

  document.getElementById('g-change-top').addEventListener('click', () => {
    physics.gravity.x = 1;
    physics.gravity.y = 8.81;
  });
};
