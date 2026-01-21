const { Server } = require("socket.io");
const { requireAuthSocket, checkBlockedSocket } = require("./socketAuth");
const { getChatMessagesBySubcategoryId } = require("../services/chatMessageService");
const { createChatMessage } = require("../repositories/chatMessageRepository");

function initChatMessageSocket(server)
{
    const io = new Server(server);

    io.use(requireAuthSocket);
    io.use(checkBlockedSocket);

    io.on("connection", (socket) =>
    {
        console.log("New user connected: ", socket.id);    
        console.log("dbUser: ", socket.dbUser?.id);

        socket.on("join_subcategory", async ({ subcategoryId }, ack) =>
        {
            try
            {
                subcategoryId = Number(subcategoryId);
                
                console.log("Connecting to subcategory chat: " + subcategoryId);

                if(!Number.isInteger(subcategoryId) || subcategoryId <= 0)
                {
                    if(ack)
                    {
                        console.error("Connecting failed!");
                        ack({ ok: false, error: "Invalid subcategoryId" });
                    }

                    return;
                }

                console.log("Connecting succeeded!");

                // leaving old room
                if(socket.currentRoom)
                {
                    socket.leave(socket.currentRoom);
                }

                // every subcategory gets its own room
                const room = `subcategory:${subcategoryId}`;
                
                // the socket now belongs to this room
                socket.join(room);
                socket.currentRoom = room;
                socket.currentSubcategoryId = subcategoryId;

                try
                {
                    const history = await getChatMessagesBySubcategoryId(subcategoryId);

                    socket.emit("history", { subcategoryId, messages: history });

                    if(ack)
                    {
                        ack({ ok: true });
                    }
                }

                catch(error)
                {
                    return ack?.({ ok: false, error: "Loading history failed!" });
                }
            }
            
            catch(error)
            {
                console.error(error);

                if(ack)
                {
                    ack({ ok: false, error: "Server error" });
                }
            }
        });

        socket.on("message", async (data, ack) =>
        {
            try
            {
                // the user must be part of a room
                if(!socket.currentSubcategoryId || !socket.currentRoom)
                {
                    ack?.({ ok: false, error: "Not joined to a subcategory" });
                    return;
                }

                const message =
                {
                    subcategoryid: socket.currentSubcategoryId,
                    userid: socket.dbUser.id,
                    name: socket.dbUser.name,
                    message: data.message.trim()
                };

                const row = await createChatMessage(message.subcategoryid, message.userid, message.name, message.message);

                message.created_at = row.created_at;

                io.to(socket.currentRoom).emit("message", { subcategoryId: socket.currentSubcategoryId, message });

                ack?.({ ok: true });
            }

            catch(error)
            {
                console.error("message error:", err);
                ack?.({ ok: false, error: "Server error" });
            }
        });

        socket.on("disconnect", () =>
        {
            console.log("User disconnected: ", socket.id);
        });
    });

    io.engine.on("connection_error", (err) =>
    {
        console.log("Socket connection error: ", err.message);
    });
}

module.exports = { initChatMessageSocket }
