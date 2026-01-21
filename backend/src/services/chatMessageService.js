const chatMessageRepository = require("../repositories/chatMessageRepository");

function mapRow(row) {
  return {
    id: row.id,
    subcategoryid: row.subcategoryid,
    created_at: row.created_at,
    message: row.message,
    userid: row.userid,
    name: row.name
  };
}

exports.createChatMessage = async ({ subcategoryid, userid, name, message, created_at }) => {
  return chatMessageRepository.createChatMessage(subcategoryid, userid, name, message, created_at);
};

exports.getChatMessagesBySubcategoryId = async (subcategoryId) => {
  const rows = await chatMessageRepository.findBySubcategoryId(subcategoryId);
  return rows.map(mapRow);
};
