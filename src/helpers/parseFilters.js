export default function parseFilters(queries, filters) {
  const filterArr = filters.split(",");
  const filterObj = {};
  filterArr.forEach(filter => {
    const [key, value] = filter.split(":");
    filterObj[key] = value;
  });
  Object.assign(queries, filterObj);
}