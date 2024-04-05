const ageCalculator = (birthdate) => {
  var today = new Date();
  var birthDate = new Date(birthdate);
  var age_now = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age_now--;
  }
  return age_now;
};

const test = () => {
  console.log('TEST');
};

export { ageCalculator, test };
