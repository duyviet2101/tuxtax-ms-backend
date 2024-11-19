const getMonday = () => {
  const date = new Date();
  var day = date.getDay() || 7;
  if( day !== 1 )
    date.setHours(-24 * (day - 1));
  date.setHours(0,0,0,0);
  return date;
}

export default getMonday;