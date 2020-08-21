function fromDTO(data, offset = 0, limit = 10, order) {
  offset = data.offset ? parseInt(data.offset) : offset;
  limit = data.limit ? parseInt(data.limit) : limit;
  return {
    offset,
    limit
  };
}

module.exports = {
  fromDTO
};
