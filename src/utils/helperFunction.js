export const getCategories = () => {
  return ['Sport', 'Music', 'Art', 'Food'];
};

export const lockLastDays = () => {
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const time = today.toTimeString().split(' ')[0].substring(0, 5);
  const dateTimeAttributes = { min: `${date}T${time}` };

  return dateTimeAttributes;
};
