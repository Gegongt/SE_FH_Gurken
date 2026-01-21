const requireAuth = require("../middlewares/requireAuth");
const checkBlocked = require("../middlewares/checkBlocked");

/*
    In order to use express middleware, a wrapper is needed
    so that they also work with sockets.
*/
function middleWareSocketWrapper(middleware)
{
    return async (socket, next) =>
    {
        // we create a req object as a normal middleware function typically has this
        const req = {
                        // here is the authentication header contained
                        headers: { ...socket.handshake.headers },
                        user: socket.user,
                        dbUser: socket.dbUser
                    };

        const authToken = socket.handshake?.auth?.token;
        
        if(authToken)
        {
            req.headers.authorization = authToken;
        }

        /*
            The original middleware uses the original response object to send
            responses. In the case of the above middlewares its just error messages
            that are being sent. In order for this work with sockets, the res functions
            need to programmed in a way so that they can return errors to the client.
        */
        const res = {
                        status: (code) =>
                        {
                            res._status = code;
                            return res;
                        },

                        json: (obj) =>
                        {
                            console.table(obj);
                            return next(new Error(`${ res._status }: ${ obj }`));
                        },

                        send: (msg) =>
                        {
                            console.table(msg)
                            return next(new Error(`${ res._status }: ${ msg }`));
                        }
                    };

        //imitates the next function of express
        const expressNext = (err) =>
        {
            if(err)
            {
                return next(err);
            }

            if(req.user)
            {
                socket.user = req.user;
            }

            if(req.dbUser)
            {
                socket.dbUser = req.dbUser;
            }

            return next();
        };

        try
        {
            await middleware(req, res, expressNext);
        }

        catch(error)
        {
            return next(error);
        }
    };
}

// these functions imitate what the normal middleware functions would do
module.exports = {
                    requireAuthSocket: middleWareSocketWrapper(requireAuth),
                    checkBlockedSocket: middleWareSocketWrapper(checkBlocked)
                 };
